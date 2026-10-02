import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  ShoppingBag,
  Heart,
  User as UserIcon,
  Menu,
  X,
  Shield,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { BrandLogo } from "./BrandLogo.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useCart } from "../../context/CartContext.jsx";
import { useWishlist } from "../../context/WishlistContext.jsx";
import { productService } from "../../services/productService.js";

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { totalItemCount, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    productService
      .getCategories()
      .then((data) => {
        if (Array.isArray(data)) setCategories(data);
      })
      .catch(() => {});
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Royal Luxury Announcement Bar */}
      <div className="bg-gradient-to-r from-noir via-[#161309] to-noir border-b border-gold/20 py-1.5 px-4 text-center">
        <div className="flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.2em] text-gold-light">
          <Sparkles className="w-3 h-3 text-gold animate-pulse" />
          <span>Complimentary Royal Delivery on Orders Above ₹999</span>
          <span className="hidden md:inline text-zinc-500">•</span>
          <span className="hidden md:inline text-gold">
            Use Code <strong className="font-bold underline">ROYAL10</strong>{" "}
            for 10% Off
          </span>
        </div>
      </div>

      {/* Main Luxury Navigation Bar */}
      <nav
        className={`w-full px-4 sm:px-8 py-3.5 transition-all duration-300 border-b ${
          scrolled
            ? "bg-noir/95 backdrop-blur-md border-gold/30 shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
            : "bg-noir/80 backdrop-blur-sm border-gold/15"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-zinc-300 hover:text-gold transition-colors p-1"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

          {/* Brand Logo & Royal Crest */}
          <div className="flex items-center">
            <BrandLogo size="normal" showTagline={!scrolled} />
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8 text-xs uppercase tracking-[0.2em] font-medium text-zinc-300">
            <Link
              to="/"
              className="hover:text-gold transition-colors duration-200"
            >
              Home
            </Link>

            {/* Categories Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setCategoriesOpen(true)}
              onMouseLeave={() => setCategoriesOpen(false)}
            >
              <button
                type="button"
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                className="flex items-center gap-1 hover:text-gold transition-colors duration-200"
              >
                Categories
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    categoriesOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {categoriesOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3">
                  <div className="w-56 bg-noir-card border border-gold/30 shadow-2xl py-2">
                    {/* All Categories */}
                    <Link
                      to="/shop"
                      onClick={() => setCategoriesOpen(false)}
                      className="block px-4 py-3 text-xs uppercase tracking-wider text-gold hover:bg-gold/10 transition-colors border-b border-noir-border"
                    >
                      All Categories
                    </Link>

                    {categories.map((cat) => (
                      <Link
                        key={cat._id}
                        to={`/category/${cat.slug}`}
                        onClick={() => setCategoriesOpen(false)}
                        className="block px-4 py-3 text-xs tracking-wider text-zinc-300 hover:text-gold hover:bg-white/5 transition-colors"
                      >
                        {cat.name}
                      </Link>
                    ))}

                    {categories.length === 0 && (
                      <div className="px-4 py-3 text-xs text-zinc-500">
                        No categories available
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <Link
              to="/"
              className="hover:text-gold transition-colors duration-200"
            >
              About Us
            </Link>
            <Link
              to="/blog"
              className="hover:text-gold transition-colors duration-200"
            >
              Blogs
            </Link>
          </div>

          {/* Right Action Icons: Search, Wishlist, Account, Cart */}
          <div className="flex items-center gap-4 sm:gap-6 text-zinc-300">
            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(true)}
              className="hover:text-gold transition-colors p-1"
              aria-label="Search collection"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Link */}
            <Link
              to="/wishlist"
              className="relative hover:text-gold transition-colors p-1"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold text-black text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-sm">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* User Account Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-1 hover:text-gold transition-colors p-1"
                aria-label="User account"
              >
                <UserIcon className="w-5 h-5" />
                <ChevronDown className="w-3 h-3 opacity-70" />
              </button>

              {userDropdownOpen && (
                <div
                  className="absolute right-0 mt-3 w-56 bg-noir-card border border-gold/30 rounded-none shadow-2xl py-2 z-50 text-xs tracking-wider"
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-2 border-b border-noir-border">
                        <p className="font-semibold text-zinc-100">
                          {user?.name}
                        </p>
                        <p className="text-[11px] text-zinc-400 truncate">
                          {user?.email}
                        </p>
                      </div>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-gold hover:bg-gold/10 transition-colors"
                        >
                          <Shield className="w-4 h-4" />
                          <span>Admin Dashboard</span>
                        </Link>
                      )}

                      <Link
                        to="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-4 py-2 text-zinc-300 hover:text-gold hover:bg-white/5 transition-colors"
                      >
                        My Profile & Addresses
                      </Link>
                      <Link
                        to="/orders"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-4 py-2 text-zinc-300 hover:text-gold hover:bg-white/5 transition-colors"
                      >
                        Order History & Tracking
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-500/10 transition-colors border-t border-noir-border mt-1"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-4 py-2.5 text-zinc-100 hover:text-gold hover:bg-white/5 transition-colors"
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-4 py-2.5 text-zinc-300 hover:text-gold hover:bg-white/5 transition-colors border-t border-noir-border"
                      >
                        Create Royal Account
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Shopping Cart Drawer Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-1 text-gold hover:text-gold-light transition-colors"
              aria-label="View shopping bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-gold to-gold-amber text-black font-extrabold text-[10px] rounded-full w-4 h-4 flex items-center justify-center shadow-[0_0_10px_rgba(212,175,55,0.6)]">
                  {totalItemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-gold/20 flex flex-col gap-3 text-xs uppercase tracking-widest text-zinc-200">
            <Link
              to="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-gold transition-colors"
            >
              All Creations
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat._id}
                to={`/category/${cat.slug}`}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 hover:text-gold transition-colors"
              >
                {cat.name}
              </Link>
            ))}
            <Link
              to="/blog"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-gold transition-colors"
            >
              Editorial Journal
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 text-gold font-bold flex items-center gap-2"
              >
                <Shield className="w-4 h-4" /> Admin Console
              </Link>
            )}
          </div>
        )}
      </nav>

      {/* Live Search Overlay Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-start justify-center pt-24 px-4">
          <div className="w-full max-w-2xl bg-noir-card border border-gold/40 p-6 shadow-2xl relative">
            <button
              onClick={() => setSearchOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-gold"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="font-serif text-lg text-gold mb-4 tracking-wider uppercase">
              Search Fragrances & Skincare
            </h3>

            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, oud, saffron, pimples cream, notes..."
                className="flex-1 bg-noir border border-gold/30 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-gold"
              />
              <button type="submit" className="btn-gold">
                Search
              </button>
            </form>

            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-zinc-400">
              <span className="text-zinc-500">Popular:</span>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("Royal Oud");
                  navigate("/shop?search=Royal%20Oud");
                  setSearchOpen(false);
                }}
                className="hover:text-gold border border-zinc-800 px-2.5 py-1 rounded-full"
              >
                Royal Oud
              </button>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("Pimples Cream");
                  navigate("/shop?search=Pimples");
                  setSearchOpen(false);
                }}
                className="hover:text-gold border border-zinc-800 px-2.5 py-1 rounded-full text-gold-amber"
              >
                Jayroop Special Pimples Cream
              </button>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("Sandalwood");
                  navigate("/shop?search=Sandalwood");
                  setSearchOpen(false);
                }}
                className="hover:text-gold border border-zinc-800 px-2.5 py-1 rounded-full"
              >
                Mysore Sandalwood
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
