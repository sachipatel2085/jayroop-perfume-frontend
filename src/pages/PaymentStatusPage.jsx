import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { CheckCircle2, XCircle, Clock, RefreshCw, ShieldCheck, ShoppingBag, FlaskConical } from 'lucide-react';
import { paymentService } from '../services/paymentService.js';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { SEO } from '../components/seo/SEO.jsx';
import { Spinner, Alert } from '../components/ui/Field.jsx';
import { formatINR } from '../config/site.js';

const MAX_POLLS = 24; // ~2 minutes

export const PaymentStatusPage = () => {
  const { orderNumber } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { completeOrder } = useCart();
  const { isAuthenticated, loading: authLoading } = useAuth();

  const isMock = searchParams.get('mock') === '1';
  const [status, setStatus] = useState(null);
  const [phase, setPhase] = useState(isMock ? 'mock' : 'checking'); // mock | checking | paid | failed | pending | error
  const [error, setError] = useState(null);
  const [retrying, setRetrying] = useState(false);
  const polls = useRef(0);
  const cartCleared = useRef(false);

  const clearCartOnce = useCallback(() => {
    if (cartCleared.current) return;
    cartCleared.current = true;
    let instant = false;
    try {
      const pending = JSON.parse(sessionStorage.getItem('jayrup_pending_payment') || 'null');
      if (pending?.orderNumber === orderNumber) instant = Boolean(pending.instant);
      sessionStorage.removeItem('jayrup_pending_payment');
    } catch {
      /* ignore */
    }
    completeOrder(instant);
  }, [completeOrder, orderNumber]);

  const check = useCallback(
    async (mockOutcome) => {
      try {
        const data = await paymentService.getStatus(orderNumber, mockOutcome ? { mock: mockOutcome } : {});
        setStatus(data);
        if (['PAID', 'REFUNDED', 'PARTIALLY_REFUNDED'].includes(data.paymentStatus)) {
          setPhase('paid');
          clearCartOnce();
          setTimeout(() => navigate(`/order-success/${orderNumber}`, { replace: true }), 1800);
          return 'done';
        }
        if (data.paymentStatus === 'FAILED' || data.orderStatus === 'CANCELLED') {
          setPhase('failed');
          return 'done';
        }
        setPhase('pending');
        return 'pending';
      } catch (err) {
        setError(err.message);
        setPhase('error');
        return 'done';
      }
    },
    [orderNumber, navigate, clearCartOnce]
  );

  useEffect(() => {
    if (authLoading || !isAuthenticated || isMock) return undefined;
    let timer;
    let cancelled = false;
    const loop = async () => {
      const r = await check();
      polls.current += 1;
      if (!cancelled && r === 'pending' && polls.current < MAX_POLLS) timer = setTimeout(loop, polls.current < 5 ? 2500 : 5000);
    };
    loop();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [check, authLoading, isAuthenticated, isMock]);

  const handleRetry = async () => {
    try {
      setRetrying(true);
      const res = await paymentService.retry(orderNumber);
      if (res.alreadyPaid) {
        setPhase('paid');
        clearCartOnce();
        navigate(`/order-success/${orderNumber}`, { replace: true });
        return;
      }
      window.location.assign(res.redirectUrl);
    } catch (err) {
      setError(err.message);
      setRetrying(false);
    }
  };

  if (!authLoading && !isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4 text-center">
        <SEO title="Payment status" searchIndexing="NOINDEX_NOFOLLOW" />
        <p className="text-zinc-300">Please sign in to view the payment status for order {orderNumber}.</p>
        <Link className="btn-gold" to={`/login?redirect=/payment/status/${orderNumber}`}>Sign In</Link>
      </div>
    );
  }

  const Icon = { paid: CheckCircle2, failed: XCircle, pending: Clock }[phase];

  return (
    <div className="bg-noir min-h-[75vh] flex items-center justify-center px-4 py-16">
      <SEO title="Payment status" searchIndexing="NOINDEX_NOFOLLOW" />
      <div className="w-full max-w-lg bg-noir-card border border-gold/25 rounded-2xl p-8 text-center shadow-2xl">
        {phase === 'mock' && (
          <div className="space-y-5">
            <FlaskConical className="w-12 h-12 text-gold mx-auto" />
            <h1 className="font-serif text-xl uppercase tracking-wider text-zinc-100">PhonePe Test Mode</h1>
            <p className="text-sm text-zinc-400">
              PhonePe credentials are not configured, so this is a <b>simulated</b> payment page (development only).
            </p>
            <div className="flex gap-3 justify-center">
              <button className="btn-gold" onClick={() => { setPhase('checking'); check('success'); }}>Simulate success</button>
              <button className="btn-outline-gold" onClick={() => { setPhase('checking'); check('failed'); }}>Simulate failure</button>
            </div>
          </div>
        )}

        {phase === 'checking' && (
          <div className="space-y-4 py-6">
            <Spinner className="w-12 h-12 mx-auto" />
            <h1 className="font-serif text-lg uppercase tracking-wider text-zinc-100">Confirming your payment</h1>
            <p className="text-sm text-zinc-400">Verifying with PhonePe. Please don’t close or refresh this page.</p>
          </div>
        )}

        {Icon && (
          <div className="space-y-4">
            <Icon className={`w-16 h-16 mx-auto ${phase === 'paid' ? 'text-emerald-400' : phase === 'failed' ? 'text-red-400' : 'text-amber-300 animate-pulse'}`} />
            <h1 className="font-serif text-xl sm:text-2xl uppercase tracking-wider text-zinc-100">
              {phase === 'paid' && 'Payment successful'}
              {phase === 'failed' && 'Payment not completed'}
              {phase === 'pending' && 'Payment is processing'}
            </h1>
            <p className="text-sm text-zinc-400">
              {phase === 'paid' && 'Thank you! Your order is confirmed. Taking you to your order…'}
              {phase === 'failed' &&
                'Your payment did not go through or was cancelled. No money has been deducted – if it was, it will be auto-refunded by your bank within 5–7 days.'}
              {phase === 'pending' &&
                (polls.current >= MAX_POLLS
                  ? 'Your bank has not confirmed the payment yet. We will update your order automatically and e-mail you as soon as it is confirmed.'
                  : 'Waiting for confirmation from your bank / UPI app…')}
            </p>

            <div className="bg-noir border border-zinc-800 rounded-xl p-4 text-sm text-left space-y-1.5">
              <div className="flex justify-between"><span className="text-zinc-500">Order</span><span className="font-mono text-gold">{orderNumber}</span></div>
              {status && <div className="flex justify-between"><span className="text-zinc-500">Amount</span><span className="text-zinc-100 font-semibold">{formatINR(status.total)}</span></div>}
              {status?.transactionId && <div className="flex justify-between gap-4"><span className="text-zinc-500">PhonePe Txn</span><span className="text-zinc-300 font-mono text-xs truncate">{status.transactionId}</span></div>}
            </div>

            {phase === 'failed' && (
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <button onClick={handleRetry} disabled={retrying} className="btn-gold">
                  <RefreshCw className={`w-4 h-4 mr-2 ${retrying ? 'animate-spin' : ''}`} /> Retry payment
                </button>
                <Link to="/cart" className="btn-outline-gold"><ShoppingBag className="w-4 h-4 mr-2" />Back to bag</Link>
              </div>
            )}
            {phase === 'pending' && (
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <button onClick={() => { polls.current = 0; setPhase('checking'); check(); }} className="btn-outline-gold">
                  <RefreshCw className="w-4 h-4 mr-2" /> Check again
                </button>
                <Link to={`/account/orders/${orderNumber}`} className="btn-gold">View order</Link>
              </div>
            )}
          </div>
        )}

        {phase === 'error' && (
          <div className="space-y-4">
            <Alert>{error}</Alert>
            <Link to="/account/orders" className="btn-outline-gold">My orders</Link>
          </div>
        )}
        {error && phase !== 'error' && <Alert className="mt-4">{error}</Alert>}

        <p className="mt-6 flex items-center justify-center gap-2 text-[11px] text-zinc-500">
          <ShieldCheck className="w-4 h-4 text-gold" /> Payments are verified directly with PhonePe
        </p>
      </div>
    </div>
  );
};
