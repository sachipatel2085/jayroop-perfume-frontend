import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Star,
  Heart,
  ShoppingBag,
  Zap,
  Truck,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { productService } from "../services/productService.js";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import { VariantSelector } from "../components/product/VariantSelector.jsx";
import { FragrancePyramid } from "../components/product/FragrancePyramid.jsx";
import { ProductSpecifications } from "../components/product/ProductSpecifications.jsx";
import { ReviewSection } from "../components/product/ReviewSection.jsx";
import { ProductCard } from "../components/product/ProductCard.jsx";
import { SEO } from "../components/seo/SEO.jsx";
import { ProductSchema } from "../components/seo/ProductSchema.jsx";
import { BreadcrumbSchema } from "../components/seo/BreadcrumbSchema.jsx";

export const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart, setInstantCheckout } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await productService.getProductBySlug(slug);
        if (res?.product) {
          setProduct(res.product);
          setRelatedProducts(res.relatedProducts || []);
          // Set initial image
          setSelectedImage(res.product.images?.[0]?.url || "");
          // Set initial variant if variants exist
          if (res.product.variants && res.product.variants.length > 0) {
            setSelectedVariant(res.product.variants[0]);
          } else {
            setSelectedVariant(null);
          }
        }
      } catch (err) {
        console.error("Failed to load product details", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="bg-noir min-h-screen py-24 text-center">
        <div className="w-12 h-12 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="font-serif text-xs uppercase tracking-widest text-gold">
          Opening Royal Vault...
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-noir min-h-screen py-24 text-center px-4">
        <h2 className="font-serif text-xl text-zinc-300 uppercase tracking-wider mb-4">
          Creation Not Found
        </h2>
        <Link to="/shop" className="btn-gold text-xs py-3 px-6">
          Return to Treasury
        </Link>
      </div>
    );
  }

  // Active price based on selected variant
  const currentPrice = selectedVariant?.price || product.price;
  const currentSalePrice = selectedVariant?.salePrice || product.salePrice;
  const hasSale = currentSalePrice && currentSalePrice < currentPrice;
  const pId = product._id || product.id;
  const inWishlist = isInWishlist(pId);
  const isOutOfStock = (selectedVariant?.stock ?? product.stock) <= 0;

  const handleAddToCart = () => {
    addToCart(product, selectedVariant, quantity);
  };

  const handleBuyNow = () => {
    setInstantCheckout(product, selectedVariant, quantity);
    navigate("/checkout?mode=instant");
  };

  const breadcrumbList = [
    { name: 'Home', url: '/' },
    { name: 'Treasury', url: '/shop' },
    ...(product.category ? [{ name: product.category.name, url: `/category/${product.category.slug}` }] : []),
    { name: product.name, url: `/products/${product.slug}` },
  ];

  return (
    <div className="bg-noir min-h-screen text-zinc-100 py-8 px-4 sm:px-8 max-w-7xl mx-auto">
      <SEO
        title={product.seo?.metaTitle || `${product.name} | Jayrup Royal Luxury`}
        description={
          product.seo?.metaDescription ||
          product.shortDescription ||
          product.description
        }
        keywords={product.seo?.metaKeywords}
        canonicalUrl={product.seo?.canonicalUrl || `/products/${product.slug}`}
        ogImage={product.seo?.ogImage || product.images?.[0]?.url}
        ogType="product"
        searchIndexing={product.seo?.searchIndexing || 'INDEX_FOLLOW'}
      >
        <ProductSchema product={product} />
        <BreadcrumbSchema items={breadcrumbList} />
      </SEO>

      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-zinc-500 mb-8">
        <Link to="/" className="hover:text-gold transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/shop" className="hover:text-gold transition-colors">
          Treasury
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        {product.category && (
          <>
            <Link
              to={`/category/${product.category.slug}`}
              className="hover:text-gold transition-colors"
            >
              {product.category.name}
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
          </>
        )}
        <span className="text-gold font-medium truncate">{product.name}</span>
      </nav>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-16">
        {/* Left Column: Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square bg-noir-card border border-gold/25 overflow-hidden shadow-2xl">
            <img
              src={selectedImage || product.images?.[0]?.url}
              alt={
                product.images?.find((img) => img.url === selectedImage)?.altText ||
                product.images?.[0]?.altText ||
                `${product.name} - ${product.brand || 'Jayrup'}`
              }
              className="w-full h-full object-cover object-center transition-all duration-500"
              fetchPriority="high"
              loading="eager"
            />
            {hasSale && (
              <span className="absolute top-4 left-4 bg-gradient-to-r from-gold-amber to-gold text-black text-[10px] font-bold px-3 py-1 uppercase tracking-wider shadow-lg">
                Privilege Offer
              </span>
            )}
            <button
              onClick={() => toggleWishlist(pId, product)}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-noir/70 border border-white/10 text-zinc-300 hover:text-gold transition-all backdrop-blur-sm"
              aria-label="Toggle Wishlist"
            >
              <Heart
                className={`w-5 h-5 ${
                  inWishlist ? "fill-gold text-gold scale-110" : ""
                }`}
              />
            </button>
          </div>

          {/* Image Thumbnails */}
          {product.images?.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(img.url)}
                  className={`w-20 h-20 border overflow-hidden transition-all flex-shrink-0 ${
                    selectedImage === img.url
                      ? "border-gold shadow-gold-glow"
                      : "border-zinc-800 opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img.url}
                    alt={img.altText || `${product.name} view ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Information & Purchase Controls */}
        <div className="flex flex-col justify-between space-y-6">
          <div>
            {/* Brand & SKU */}
            <div className="flex items-center justify-between text-xs uppercase tracking-widest text-zinc-400 mb-2">
              <span className="text-gold font-semibold">
                {product.brand || "Jayrup Special"}
              </span>
              <span>SKU: {selectedVariant?.sku || product.sku}</span>
            </div>

            {/* Product Title */}
            <h1 className="font-serif text-2xl sm:text-4xl uppercase tracking-wider font-bold text-zinc-100 mb-3">
              {product.name}
            </h1>

            {/* Ratings and Reviews */}
            <div className="flex items-center gap-3 text-xs text-zinc-400 mb-4 pb-4 border-b border-zinc-800">
              <div className="flex items-center text-gold">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-4 h-4 ${
                      s <= Math.round(product.averageRating || 5)
                        ? "fill-gold text-gold"
                        : "text-zinc-700"
                    }`}
                  />
                ))}
                <span className="ml-2 font-bold text-zinc-200">
                  {product.averageRating > 0
                    ? product.averageRating.toFixed(1)
                    : "5.0"}
                </span>
              </div>
              <span>•</span>
              <span className="text-zinc-400">
                {product.numReviews || 12} Verified Royal Reviews
              </span>
            </div>

            {/* Pricing Section */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-sans font-extrabold text-2xl sm:text-3xl text-zinc-100">
                ₹{currentSalePrice || currentPrice}
              </span>
              {hasSale && (
                <span className="text-base text-zinc-500 line-through">
                  ₹{currentPrice}
                </span>
              )}
              {hasSale && (
                <span className="text-xs text-emerald-400 uppercase tracking-wider font-semibold">
                  Save ₹{currentPrice - currentSalePrice}
                </span>
              )}
              <span className="text-[11px] text-zinc-500 ml-2">
                (Inclusive of all royal duties & taxes)
              </span>
            </div>

            {/* Short Description */}
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-light mb-6">
              {product.shortDescription}
            </p>

            {/* Variant Selector */}
            {product.variants?.length > 0 && (
              <div className="mb-6">
                <VariantSelector
                  variants={product.variants}
                  selectedVariant={selectedVariant}
                  onSelectVariant={(v) => setSelectedVariant(v)}
                />
              </div>
            )}

            {/* Stock indicator */}
            <div className="mb-6 text-xs">
              {isOutOfStock ? (
                <span className="text-red-400 font-semibold uppercase tracking-wider">
                  Temporarily Out of Stock
                </span>
              ) : (selectedVariant?.stock ?? product.stock) <= 5 ? (
                <span className="text-gold-amber font-semibold uppercase tracking-wider animate-pulse">
                  Only {selectedVariant?.stock ?? product.stock} flasks
                  remaining in this batch
                </span>
              ) : (
                <span className="text-emerald-400 font-medium uppercase tracking-wider">
                  Available in Royal Inventory
                </span>
              )}
            </div>

            {/* Quantity Picker & Add to Cart */}
            <div className="space-y-3 pt-4 border-t border-zinc-800">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-zinc-800 bg-noir-card">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-zinc-400 hover:text-gold text-sm"
                  >
                    -
                  </button>
                  <span className="px-4 text-xs font-bold text-zinc-100">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-zinc-400 hover:text-gold text-sm"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="flex-1 btn-gold py-3 text-xs flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{isOutOfStock ? "Sold Out" : "Add to Royal Bag"}</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="w-full btn-outline-gold py-3 text-xs flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4" />
                <span>Instant Royal Checkout</span>
              </button>
            </div>

            {/* Luxury Shipping Perks */}
            <div className="grid grid-cols-2 gap-3 pt-6 mt-6 border-t border-zinc-800 text-[11px] text-zinc-400">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-gold" />
                <span>Complimentary Delivery over ₹999</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-gold" />
                <span>100% Authentic House Seal</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-gold" />
                <span>Includes Fragrance Samples</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-gold" />
                <span>Transit Damage Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fragrance Pyramid (Perfume Notes) */}
      <FragrancePyramid specifications={product.specifications} />

      {/* Skincare / Generic Product Specifications */}
      <ProductSpecifications specifications={product.specifications} />

      {/* Detailed Rich Description */}
      <div className="bg-noir-card border border-gold/15 p-6 sm:p-10 my-8">
        <h3 className="font-serif text-lg text-gold tracking-widest uppercase mb-4">
          The Creation & Craftsmanship
        </h3>
        <div
          className="text-zinc-300 text-xs sm:text-sm leading-relaxed space-y-4 font-light prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: product.description }}
        />
      </div>

      {/* Reviews & Client Impressions */}
      <ReviewSection productId={product._id} />

      {/* Related Products Carousel */}
      {relatedProducts.length > 0 && (
        <div className="mt-16 border-t border-zinc-900 pt-12">
          <div className="text-center mb-10">
            <span className="text-[10px] uppercase tracking-[0.3em] text-gold font-medium">
              Harmonizing Blends
            </span>
            <h3 className="font-serif text-2xl uppercase tracking-wider text-zinc-100 font-semibold mt-1">
              You May Also Admire
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
