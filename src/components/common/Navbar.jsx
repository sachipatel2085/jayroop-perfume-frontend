import React, { useState, useEffect, useRef } from "react";
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
  LogOut,
  Package,
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
  const [mobileAccountOpen, setMobileAccountOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  const mobileDropdownRef = useRef(null);
  const desktopDropdownRef = useRef(null);

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

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileDropdownRef.current &&
        !mobileDropdownRef.current.contains(event.target)
      ) {
        setMobileAccountOpen(false);
      }
      if (
        desktopDropdownRef.current &&
        !desktopDropdownRef.current.contains(event.target)
      ) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
      setMobileAccountOpen(false);
    }
  };

  const handleOpenCartFromMobile = () => {
    setMobileAccountOpen(false);
    setIsCartOpen(true);
  };

  const handleOpenSearchFromMobile = () => {
    setMobileAccountOpen(false);
    setSearchOpen(true);
  };

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Royal Luxury Announcement Bar */}
      <div className="bg-gradient-to-r from-noir via-[#161309] to-noir border-b border-gold/20 py-1.5 px-3 sm:px-4 text-center">
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] uppercase tracking-[0.18em] sm:tracking-[0.2em] text-gold-light truncate">
          <Sparkles className="w-3 h-3 text-gold animate-pulse flex-shrink-0" />
          <span className="truncate">
            Complimentary Royal Delivery on Orders Above ₹999
          </span>
          <span className="hidden md:inline text-zinc-500">•</span>
          <span className="hidden md:inline text-gold">
            Use Code <strong className="font-bold underline">ROYAL10</strong>{" "}
            for 10% Off
          </span>
        </div>
      </div>

      {/* Main Luxury Navigation Bar */}
      <nav
        className={`w-full px-3 sm:px-6 md:px-8 py-2.5 sm:py-3.5 transition-all duration-300 border-b ${
          scrolled
            ? "bg-noir/95 backdrop-blur-md border-gold/30 shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
            : "bg-noir/80 backdrop-blur-sm border-gold/15"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => {
              setMobileMenuOpen(!mobileMenuOpen);
              setMobileAccountOpen(false);
            }}
            className="md:hidden text-zinc-300 hover:text-gold transition-colors p-1.5 -ml-1 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-gold" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>

          {/* Brand Logo & Royal Crest */}
          <div className="flex items-center flex-1 md:flex-initial justify-center md:justify-start">
            <BrandLogo size="normal" showTagline={!scrolled} />
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8 text-xs uppercase tracking-[0.2em] font-medium text-zinc-300">
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
              to="/about"
              className="hover:text-gold transition-colors duration-200"
            >
              About Us
            </Link>

            <Link
              to="/blog"
              className="hover:text-gold transition-colors duration-200"
            >
              Blog
            </Link>
          </div>

          {/* DESKTOP Action Icons: Search, Wishlist, Account, Cart */}
          <div className="hidden md:flex items-center gap-5 sm:gap-6 text-zinc-300">
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

            {/* Desktop User Account Dropdown */}
            <div className="relative" ref={desktopDropdownRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-1 hover:text-gold transition-colors p-1"
                aria-label="User account"
              >
                <UserIcon className="w-5 h-5" />
                <ChevronDown className="w-3 h-3 opacity-70" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-noir-card border border-gold/30 rounded-none shadow-2xl py-2 z-50 text-xs tracking-wider">
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-2 border-b border-noir-border">
                        <p className="font-semibold text-zinc-100 truncate">
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

          {/* MOBILE SINGLE ACTION BUTTON (Account / Quick Actions Menu) */}
          <div
            className="md:hidden relative flex items-center"
            ref={mobileDropdownRef}
          >
            <button
              onClick={() => {
                setMobileAccountOpen(!mobileAccountOpen);
                setMobileMenuOpen(false);
              }}
              className="relative p-2 text-gold hover:text-gold-light transition-colors flex items-center justify-center rounded border border-gold/30 bg-noir-card/80"
              aria-label="Open patron account and actions menu"
            >
              <UserIcon className="w-4 h-4" />
              {/* Badge indicator on mobile account button if cart or wishlist has items */}
              {totalItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-gold to-gold-amber text-black font-extrabold text-[9px] rounded-full w-4 h-4 flex items-center justify-center shadow-md">
                  {totalItemCount}
                </span>
              )}
            </button>

            {/* MOBILE ACCOUNT & ALL ACTIONS DROPDOWN */}
            {mobileAccountOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-noir-card border border-gold/40 shadow-2xl p-4 z-50 rounded-none animate-in fade-in slide-in-from-top-2 duration-200">
                {/* 1. Quick Action Icons Grid */}
                <div className="mb-3">
                  <span className="text-[9px] uppercase tracking-[0.2em] text-zinc-500 font-semibold block mb-2">
                    Quick Actions
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {/* Search */}
                    <button
                      onClick={handleOpenSearchFromMobile}
                      className="flex flex-col items-center justify-center p-2.5 bg-noir border border-gold/20 hover:border-gold/60 text-zinc-300 hover:text-gold transition-colors rounded-none"
                    >
                      <Search className="w-4 h-4 mb-1" />
                      <span className="text-[10px] uppercase tracking-wider font-medium">
                        Search
                      </span>
                    </button>

                    {/* Wishlist */}
                    <Link
                      to="/wishlist"
                      onClick={() => setMobileAccountOpen(false)}
                      className="relative flex flex-col items-center justify-center p-2.5 bg-noir border border-gold/20 hover:border-gold/60 text-zinc-300 hover:text-gold transition-colors rounded-none"
                    >
                      <Heart className="w-4 h-4 mb-1" />
                      {wishlistCount > 0 && (
                        <span className="absolute top-1 right-2 bg-gold text-black text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">
                          {wishlistCount}
                        </span>
                      )}
                      <span className="text-[10px] uppercase tracking-wider font-medium">
                        Wishlist
                      </span>
                    </Link>

                    {/* Cart / Shopping Bag */}
                    <button
                      onClick={handleOpenCartFromMobile}
                      className="relative flex flex-col items-center justify-center p-2.5 bg-noir border border-gold/30 hover:border-gold text-gold hover:text-gold-light transition-colors rounded-none"
                    >
                      <ShoppingBag className="w-4 h-4 mb-1" />
                      {totalItemCount > 0 && (
                        <span className="absolute top-1 right-2 bg-gold text-black text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">
                          {totalItemCount}
                        </span>
                      )}
                      <span className="text-[10px] uppercase tracking-wider font-semibold">
                        My Bag
                      </span>
                    </button>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gold/20 my-3" />

                {/* 2. Patron Account Section */}
                <div>
                  <span className="text-[9px] uppercase tracking-[0.2em] text-zinc-500 font-semibold block mb-2">
                    Patron Account
                  </span>

                  {isAuthenticated ? (
                    <div className="space-y-1 text-xs">
                      {/* User Info Card */}
                      <div className="p-2.5 bg-noir border border-zinc-800 mb-2">
                        <p className="font-semibold text-zinc-100 truncate">
                          {user?.name}
                        </p>
                        <p className="text-[11px] text-zinc-400 truncate">
                          {user?.email}
                        </p>
                        {isAdmin && (
                          <span className="inline-block mt-1 bg-gold/20 text-gold text-[9px] uppercase font-bold px-1.5 py-0.5 border border-gold/30">
                            Administrator
                          </span>
                        )}
                      </div>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setMobileAccountOpen(false)}
                          className="flex items-center gap-2 p-2 text-gold hover:bg-gold/10 transition-colors font-semibold"
                        >
                          <Shield className="w-4 h-4" />
                          <span>Admin Console</span>
                        </Link>
                      )}

                      <Link
                        to="/profile"
                        onClick={() => setMobileAccountOpen(false)}
                        className="flex items-center gap-2 p-2 text-zinc-300 hover:text-gold hover:bg-white/5 transition-colors"
                      >
                        <UserIcon className="w-3.5 h-3.5 text-zinc-500" />
                        <span>My Profile & Addresses</span>
                      </Link>

                      <Link
                        to="/orders"
                        onClick={() => setMobileAccountOpen(false)}
                        className="flex items-center gap-2 p-2 text-zinc-300 hover:text-gold hover:bg-white/5 transition-colors"
                      >
                        <Package className="w-3.5 h-3.5 text-zinc-500" />
                        <span>Order History & Tracking</span>
                      </Link>

                      <button
                        onClick={() => {
                          logout();
                          setMobileAccountOpen(false);
                        }}
                        className="w-full flex items-center gap-2 p-2 text-red-400 hover:bg-red-500/10 transition-colors border-t border-zinc-800 mt-2 pt-2 text-left"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2 pt-1 text-xs">
                      <p className="text-[11px] text-zinc-400 mb-2">
                        Access your saved wishlist, addresses, and bespoke royal
                        order history.
                      </p>
                      <Link
                        to="/login"
                        onClick={() => setMobileAccountOpen(false)}
                        className="w-full btn-gold text-[10px] py-2.5 text-center block"
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setMobileAccountOpen(false)}
                        className="w-full btn-outline-gold text-[10px] py-2 text-center block"
                      >
                        Create Royal Account
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation Drawer for Site Links */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-gold/20 flex flex-col gap-2.5 text-xs uppercase tracking-widest text-zinc-200 animate-in fade-in slide-in-from-top-1 duration-200">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 px-2 hover:text-gold hover:bg-white/5 transition-colors"
            >
              Home
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat._id}
                to={`/category/${cat.slug}`}
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 px-2 text-zinc-300 hover:text-gold hover:bg-white/5 transition-colors"
              >
                {cat.name}
              </Link>
            ))}
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 px-2 hover:text-gold hover:bg-white/5 transition-colors"
            >
              About Us
            </Link>
            <Link
              to="/blog"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 px-2 hover:text-gold hover:bg-white/5 transition-colors"
            >
              Blog
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 px-2 text-gold font-bold flex items-center gap-2 border-t border-zinc-800 mt-1 pt-2"
              >
                <Shield className="w-4 h-4" /> Admin Console
              </Link>
            )}
          </div>
        )}
      </nav>

      {/* Live Search Overlay Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-start justify-center pt-20 sm:pt-24 px-4">
          <div className="w-full max-w-2xl bg-noir-card border border-gold/40 p-5 sm:p-6 shadow-2xl relative">
            <button
              onClick={() => setSearchOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-gold"
              aria-label="Close search"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <h3 className="font-serif text-base sm:text-lg text-gold mb-3 sm:mb-4 tracking-wider uppercase">
              Search Fragrances & Skincare
            </h3>

            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, oud, saffron, pimples cream, notes..."
                className="flex-1 bg-noir border border-gold/30 px-3 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-gold"
              />
              <button
                type="submit"
                className="btn-gold text-[10px] sm:text-xs py-2 px-4 sm:px-6"
              >
                Search
              </button>
            </form>

            <div className="mt-4 flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-zinc-400">
              <span className="text-zinc-500">Popular:</span>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("Royal Oud");
                  navigate("/shop?search=Royal%20Oud");
                  setSearchOpen(false);
                }}
                className="hover:text-gold border border-zinc-800 px-2.5 py-1 rounded-full text-[10px] sm:text-xs"
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
                className="hover:text-gold border border-zinc-800 px-2.5 py-1 rounded-full text-gold-amber text-[10px] sm:text-xs"
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
                className="hover:text-gold border border-zinc-800 px-2.5 py-1 rounded-full text-[10px] sm:text-xs"
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
