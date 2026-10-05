import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { WishlistProvider } from './context/WishlistContext.jsx';

// Common Components
import { Navbar } from './components/common/Navbar.jsx';
import { Footer } from './components/common/Footer.jsx';
import { CartDrawer } from './components/cart/CartDrawer.jsx';

// Storefront Pages
import { Home } from './pages/Home.jsx';
import { Shop } from './pages/Shop.jsx';
import { CategoryPage } from './pages/CategoryPage.jsx';
import { ProductDetail } from './pages/ProductDetail.jsx';
import { CartPage } from './pages/CartPage.jsx';
import { CheckoutPage } from './pages/CheckoutPage.jsx';
import { OrderSuccessPage } from './pages/OrderSuccessPage.jsx';
import { OrderTrackingPage } from './pages/OrderTrackingPage.jsx';
import { UserProfile } from './pages/UserProfile.jsx';
import { OrderHistory } from './pages/OrderHistory.jsx';
import { WishlistPage } from './pages/WishlistPage.jsx';
import { BlogList } from './pages/BlogList.jsx';
import { BlogDetail } from './pages/BlogDetail.jsx';
import { AboutUs } from './pages/AboutUs.jsx';
import { Login } from './pages/Auth/Login.jsx';
import { Register } from './pages/Auth/Register.jsx';

// Admin Components & Pages
import { AdminLayout } from './components/admin/AdminLayout.jsx';
import { AdminDashboard } from './pages/admin/AdminDashboard.jsx';
import { AdminProducts } from './pages/admin/AdminProducts.jsx';
import { AdminCategories } from './pages/admin/AdminCategories.jsx';
import { AdminOrders } from './pages/admin/AdminOrders.jsx';
import { AdminAds } from './pages/admin/AdminAds.jsx';
import { AdminCoupons } from './pages/admin/AdminCoupons.jsx';
import { AdminInventory } from './pages/admin/AdminInventory.jsx';
import { AdminReviews } from './pages/admin/AdminReviews.jsx';
import { AdminBlogs } from './pages/admin/AdminBlogs.jsx';
import { AdminAuditLogs } from './pages/admin/AdminAuditLogs.jsx';
import { AdminInfluencerVideos } from './pages/admin/AdminInfluencerVideos.jsx';
import { AdminSettings } from './pages/admin/AdminSettings.jsx';

// Customer Route Protection
const ProtectedCustomerRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

// Admin Route Protection
const ProtectedAdminRoute = () => {
  const { isAdmin, loading } = useAuth();
  if (loading) return null;
  return isAdmin ? <AdminLayout /> : <Navigate to="/login" replace />;
};

// Main Public Storefront Layout Wrapper
const StorefrontLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-noir">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Router>
            <Routes>
              {/* Storefront Routes */}
              <Route element={<StorefrontLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/category/:slug" element={<CategoryPage />} />
                <Route path="/products/:slug" element={<ProductDetail />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/order-success/:orderNumber" element={<OrderSuccessPage />} />
                <Route path="/track-order" element={<OrderTrackingPage />} />
                <Route path="/track-order/:orderNumber" element={<OrderTrackingPage />} />
                <Route path="/wishlist" element={<WishlistPage />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/blog" element={<BlogList />} />
                <Route path="/blog/:slug" element={<BlogDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Customer Account Protected Routes */}
                <Route element={<ProtectedCustomerRoute />}>
                  <Route path="/profile" element={<UserProfile />} />
                  <Route path="/orders" element={<OrderHistory />} />
                </Route>
              </Route>

              {/* Admin Protected Dashboard Routes */}
              <Route path="/admin" element={<ProtectedAdminRoute />}>
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="ads" element={<AdminAds />} />
                <Route path="influencers" element={<AdminInfluencerVideos />} />
                <Route path="coupons" element={<AdminCoupons />} />
                <Route path="inventory" element={<AdminInventory />} />
                <Route path="reviews" element={<AdminReviews />} />
                <Route path="blogs" element={<AdminBlogs />} />
                <Route path="audit-logs" element={<AdminAuditLogs />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>

              {/* 404 Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}
