// Google Analytics 4 + Meta Pixel helpers (IDs configured in Admin › Settings › SEO & Tracking).
let loaded = false;

export const initAnalytics = ({ googleAnalyticsId, metaPixelId } = {}) => {
  if (loaded || typeof window === 'undefined') return;
  loaded = true;

  if (googleAnalyticsId && /^G-[A-Z0-9]+$/i.test(googleAnalyticsId)) {
    const s = document.createElement('script');
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', googleAnalyticsId, { send_page_view: false });
  }

  if (metaPixelId && /^\d{6,20}$/.test(metaPixelId)) {
    /* eslint-disable */
    !(function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    /* eslint-enable */
    window.fbq('init', metaPixelId);
  }
};

export const trackPageView = (path) => {
  window.gtag?.('event', 'page_view', { page_path: path, page_location: window.location.href, page_title: document.title });
  window.fbq?.('track', 'PageView');
};

const toItems = (items = []) =>
  items.map((i) => ({
    item_id: i.variant?.sku || i.sku || i.variantSku || i.productId || i.product,
    item_name: i.name,
    item_variant: i.variant?.title || i.variantTitle,
    price: Number(i.price),
    quantity: Number(i.quantity || 1),
  }));

export const trackAddToCart = (item) => {
  window.gtag?.('event', 'add_to_cart', { currency: 'INR', value: Number(item.price) * Number(item.quantity || 1), items: toItems([item]) });
  window.fbq?.('track', 'AddToCart', { currency: 'INR', value: Number(item.price) * Number(item.quantity || 1) });
};

export const trackBeginCheckout = (items, value) => {
  window.gtag?.('event', 'begin_checkout', { currency: 'INR', value, items: toItems(items) });
  window.fbq?.('track', 'InitiateCheckout', { currency: 'INR', value });
};

export const trackPurchase = (order) => {
  if (!order) return;
  const key = `jayrup_tracked_${order.orderNumber}`;
  try {
    if (localStorage.getItem(key)) return;
    localStorage.setItem(key, '1');
  } catch {
    /* ignore */
  }
  window.gtag?.('event', 'purchase', {
    transaction_id: order.orderNumber,
    currency: 'INR',
    value: Number(order.total),
    shipping: Number(order.shipping || 0),
    coupon: order.appliedCoupon?.code || undefined,
    items: toItems(order.items),
  });
  window.fbq?.('track', 'Purchase', { currency: 'INR', value: Number(order.total) });
};
