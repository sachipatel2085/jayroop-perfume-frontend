import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation, useParams } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { WishlistProvider } from './context/WishlistContext.jsx';

// Shell (eager)
import { Navbar } from './components/common/Navbar.jsx';
import { Footer } from './components/common/Footer.jsx';
import { CartDrawer } from './components/cart/CartDrawer.jsx';
import { ScrollToTop } from './components/common/ScrollToTop.jsx';
import { SiteEffects } from './components/common/SiteEffects.jsx';
import { PageLoader } from './components/ui/Field.jsx';
import { Home } from './pages/Home.jsx';

// Route-level code splitting keeps the storefront fast (Core Web Vitals)
const lazyNamed = (loader, name) => lazy(() => loader().then((m) => ({ default: m[name] })));

const Shop = lazyNamed(() => import('./pages/Shop.jsx'), 'Shop');
const CategoryPage = lazyNamed(() => import('./pages/CategoryPage.jsx'), 'CategoryPage');
const ProductDetail = lazyNamed(() => import('./pages/ProductDetail.jsx'), 'ProductDetail');
const CartPage = lazyNamed(() => import('./pages/CartPage.jsx'), 'CartPage');
const CheckoutPage = lazyNamed(() => import('./pages/CheckoutPage.jsx'), 'CheckoutPage');
const PaymentStatusPage = lazyNamed(() => import('./pages/PaymentStatusPage.jsx'), 'PaymentStatusPage');
const OrderSuccessPage = lazyNamed(() => import('./pages/OrderSuccessPage.jsx'), 'OrderSuccessPage');
const OrderTrackingPage = lazyNamed(() => import('./pages/OrderTrackingPage.jsx'), 'OrderTrackingPage');
const WishlistPage = lazyNamed(() => import('./pages/WishlistPage.jsx'), 'WishlistPage');
const BlogList = lazyNamed(() => import('./pages/BlogList.jsx'), 'BlogList');
const BlogDetail = lazyNamed(() => import('./pages/BlogDetail.jsx'), 'BlogDetail');
const AboutUs = lazyNamed(() => import('./pages/AboutUs.jsx'), 'AboutUs');
const PrivacyPolicy = lazyNamed(() => import('./pages/PrivacyPolicy.jsx'), 'PrivacyPolicy');
const ShippingPolicy = lazyNamed(() => import('./pages/ShippingPolicy.jsx'), 'ShippingPolicy');
const ReturnRefundPolicy = lazyNamed(() => import('./pages/ReturnRefundPolicy.jsx'), 'ReturnRefundPolicy');
const TermsOfService = lazyNamed(() => import('./pages/TermsOfService.jsx'), 'TermsOfService');
const ContactUs = lazyNamed(() => import('./pages/ContactUs.jsx'), 'ContactUs');
const FAQ = lazyNamed(() => import('./pages/FAQ.jsx'), 'FAQ');
const Login = lazyNamed(() => import('./pages/Auth/Login.jsx'), 'Login');
const Register = lazyNamed(() => import('./pages/Auth/Register.jsx'), 'Register');
const ForgotPassword = lazyNamed(() => import('./pages/Auth/ForgotPassword.jsx'), 'ForgotPassword');
const ResetPassword = lazyNamed(() => import('./pages/Auth/ResetPassword.jsx'), 'ResetPassword');
const NotFound = lazyNamed(() => import('./pages/NotFound.jsx'), 'NotFound');

// Customer account
const AccountLayout = lazyNamed(() => import('./pages/account/AccountLayout.jsx'), 'AccountLayout');
const AccountDashboard = lazyNamed(() => import('./pages/account/AccountDashboard.jsx'), 'AccountDashboard');
const AccountOrders = lazyNamed(() => import('./pages/account/AccountOrders.jsx'), 'AccountOrders');
const AccountOrderDetail = lazyNamed(() => import('./pages/account/AccountOrderDetail.jsx'), 'AccountOrderDetail');
const AccountAddresses = lazyNamed(() => import('./pages/account/AccountAddresses.jsx'), 'AccountAddresses');
const AccountProfile = lazyNamed(() => import('./pages/account/AccountProfile.jsx'), 'AccountProfile');

// Admin
const AdminLayout = lazyNamed(() => import('./components/admin/AdminLayout.jsx'), 'AdminLayout');
const AdminDashboard = lazyNamed(() => import('./pages/admin/AdminDashboard.jsx'), 'AdminDashboard');
const AdminProducts = lazyNamed(() => import('./pages/admin/AdminProducts.jsx'), 'AdminProducts');
const AdminCategories = lazyNamed(() => import('./pages/admin/AdminCategories.jsx'), 'AdminCategories');
const AdminOrders = lazyNamed(() => import('./pages/admin/AdminOrders.jsx'), 'AdminOrders');
const AdminReports = lazyNamed(() => import('./pages/admin/AdminReports.jsx'), 'AdminReports');
const AdminCustomers = lazyNamed(() => import('./pages/admin/AdminCustomers.jsx'), 'AdminCustomers');
const AdminInquiries = lazyNamed(() => import('./pages/admin/AdminInquiries.jsx'), 'AdminInquiries');
const AdminAds = lazyNamed(() => import('./pages/admin/AdminAds.jsx'), 'AdminAds');
const AdminCoupons = lazyNamed(() => import('./pages/admin/AdminCoupons.jsx'), 'AdminCoupons');
const AdminInventory = lazyNamed(() => import('./pages/admin/AdminInventory.jsx'), 'AdminInventory');
const AdminReviews = lazyNamed(() => import('./pages/admin/AdminReviews.jsx'), 'AdminReviews');
const AdminBlogs = lazyNamed(() => import('./pages/admin/AdminBlogs.jsx'), 'AdminBlogs');
const AdminAuditLogs = lazyNamed(() => import('./pages/admin/AdminAuditLogs.jsx'), 'AdminAuditLogs');
const AdminInfluencerVideos = lazyNamed(() => import('./pages/admin/AdminInfluencerVideos.jsx'), 'AdminInfluencerVideos');
const AdminSettings = lazyNamed(() => import('./pages/admin/AdminSettings.jsx'), 'AdminSettings');

const ProtectedCustomerRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  if (loading) return <PageLoader />;
  return isAuthenticated ? <Outlet /> : <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`} replace />;
};

const ProtectedAdminRoute = () => {
  const { isAdmin, loading } = useAuth();
  const location = useLocation();
  if (loading) return <PageLoader />;
  return isAdmin ? <AdminLayout /> : <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
};

const StorefrontLayout = () => (
  <div className="flex flex-col min-h-screen bg-noir">
    <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-gold focus:text-black focus:px-4 focus:py-2 focus:rounded">
      Skip to content
    </a>
    <Navbar />
    <main id="main" className="flex-1">
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
    </main>
    <Footer />
    <CartDrawer />
  </div>
);

// Old WordPress / WooCommerce URLs → new routes (server/.htaccess also send 301s)
const LegacyProductRedirect = () => {
  const { slug } = useParams();
  return <Navigate to={`/products/${slug}`} replace />;
};
const LegacyCategoryRedirect = () => {
  const { slug } = useParams();
  return <Navigate to={`/category/${slug}`} replace />;
};

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Router>
            <ScrollToTop />
            <SiteEffects />
            <Routes>
              <Route element={<StorefrontLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/category/:slug" element={<CategoryPage />} />
                <Route path="/products/:slug" element={<ProductDetail />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/payment/status/:orderNumber" element={<PaymentStatusPage />} />
                <Route path="/order-success/:orderNumber" element={<OrderSuccessPage />} />
                <Route path="/track-order" element={<OrderTrackingPage />} />
                <Route path="/track-order/:orderNumber" element={<OrderTrackingPage />} />
                <Route path="/wishlist" element={<WishlistPage />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/contact-us" element={<ContactUs />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/blog" element={<BlogList />} />
                <Route path="/blog/:slug" element={<BlogDetail />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/shipping-policy" element={<ShippingPolicy />} />
                <Route path="/refund-return-policy" element={<ReturnRefundPolicy />} />
                <Route path="/terms-and-conditions" element={<TermsOfService />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />

                {/* Aliases & legacy WordPress URLs */}
                <Route path="/store" element={<Navigate to="/shop" replace />} />
                <Route path="/product/:slug" element={<LegacyProductRedirect />} />
                <Route path="/product-category/:slug" element={<LegacyCategoryRedirect />} />
                <Route path="/product-category/:parent/:slug" element={<LegacyCategoryRedirect />} />
                <Route path="/contact" element={<Navigate to="/contact-us" replace />} />
                <Route path="/about-us" element={<Navigate to="/about" replace />} />
                <Route path="/return-policy" element={<Navigate to="/refund-return-policy" replace />} />
                <Route path="/refund-policy" element={<Navigate to="/refund-return-policy" replace />} />
                <Route path="/cancellation-policy" element={<Navigate to="/refund-return-policy" replace />} />
                <Route path="/terms-of-service" element={<Navigate to="/terms-and-conditions" replace />} />
                <Route path="/my-account" element={<Navigate to="/account" replace />} />
                <Route path="/my-account/*" element={<Navigate to="/account" replace />} />
                <Route path="/profile" element={<Navigate to="/account/profile" replace />} />
                <Route path="/orders" element={<Navigate to="/account/orders" replace />} />

                <Route element={<ProtectedCustomerRoute />}>
                  <Route path="/account" element={<AccountLayout />}>
                    <Route index element={<AccountDashboard />} />
                    <Route path="orders" element={<AccountOrders />} />
                    <Route path="orders/:orderNumber" element={<AccountOrderDetail />} />
                    <Route path="addresses" element={<AccountAddresses />} />
                    <Route path="profile" element={<AccountProfile />} />
                  </Route>
                </Route>

                <Route path="*" element={<NotFound />} />
              </Route>

              <Route
                path="/admin"
                element={
                  <Suspense fallback={<PageLoader />}>
                    <ProtectedAdminRoute />
                  </Suspense>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="reports" element={<AdminReports />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="customers" element={<AdminCustomers />} />
                <Route path="messages" element={<AdminInquiries />} />
                <Route path="ads" element={<AdminAds />} />
                <Route path="influencers" element={<AdminInfluencerVideos />} />
                <Route path="coupons" element={<AdminCoupons />} />
                <Route path="inventory" element={<AdminInventory />} />
                <Route path="reviews" element={<AdminReviews />} />
                <Route path="blogs" element={<AdminBlogs />} />
                <Route path="audit-logs" element={<AdminAuditLogs />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>
            </Routes>
          </Router>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}
