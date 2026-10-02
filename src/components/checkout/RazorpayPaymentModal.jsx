import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, CreditCard, AlertCircle } from 'lucide-react';
import { paymentService } from '../../services/paymentService.js';
import { useCart } from '../../context/CartContext.jsx';

export const RazorpayPaymentModal = ({
  checkoutData,
  disabled,
  onOrderInitiated,
}) => {
  const { clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePayNow = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Create order on backend (recalculates prices server-side)
      const initRes = await paymentService.createPaymentOrder(checkoutData);
      const { orderId, orderNumber, razorpayOrderId, amount, keyId } = initRes;

      if (onOrderInitiated) onOrderInitiated(orderNumber);

      // 2. Check if Razorpay JS SDK is loaded
      if (typeof window.Razorpay === 'function' && keyId && !keyId.includes('JayroopLuxuryKey')) {
        // Real Razorpay flow
        const options = {
          key: keyId,
          amount: Math.round(amount * 100),
          currency: 'INR',
          name: 'Jayroop (JR) Royal Luxury House',
          description: `Order #${orderNumber}`,
          image: '/src/assets/jayroop-logo.webp',
          order_id: razorpayOrderId,
          handler: async function (response) {
            try {
              // 3. Verify server-side signature
              const verifyRes = await paymentService.verifyPayment({
                orderId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });

              clearCart();
              navigate(`/order-success/${verifyRes.orderNumber || orderNumber}`);
            } catch (vErr) {
              setError(`Payment Verification Failed: ${vErr.message}`);
            }
          },
          prefill: {
            name: checkoutData.shippingAddress.fullName,
            contact: checkoutData.shippingAddress.phone,
          },
          theme: {
            color: '#D4AF37', // Jayroop royal gold brand accent
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response) {
          setError(`Payment Failed: ${response.error.description || 'Transaction declined'}`);
        });
        rzp.open();
      } else {
        // Development / Simulated Razorpay Test Mode
        // Automatically simulates payment verification seamlessly
        const simPaymentId = `pay_sim_${Date.now()}`;
        const verifyRes = await paymentService.verifyPayment({
          orderId,
          razorpay_order_id: razorpayOrderId,
          razorpay_payment_id: simPaymentId,
          razorpay_signature: 'SIMULATED_TEST_SIGNATURE',
        });

        clearCart();
        navigate(`/order-success/${verifyRes.orderNumber || orderNumber}`);
      }
    } catch (err) {
      setError(err.message || 'Payment initiation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <button
        type="button"
        onClick={handlePayNow}
        disabled={disabled || loading}
        className="w-full btn-gold py-4 text-xs tracking-[0.2em] font-bold flex items-center justify-center gap-2 shadow-gold-glow"
      >
        <Lock className="w-4 h-4" />
        <span>{loading ? 'Initiating Royal Secure Gateway...' : 'Pay with Razorpay'}</span>
      </button>

      <div className="flex items-center justify-center gap-3 text-[11px] text-zinc-500">
        <ShieldCheck className="w-4 h-4 text-gold" />
        <span>UPI, RuPay, Visa, Mastercard, NetBanking via Razorpay</span>
      </div>
    </div>
  );
};
