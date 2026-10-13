import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, Calendar, ChevronRight, ChevronDown, User, Share2, ArrowLeft, ArrowRight } from 'lucide-react';
import { productService } from '../services/productService.js';
import { SEO } from '../components/seo/SEO.jsx';
import { ArticleSchema } from '../components/seo/ArticleSchema.jsx';
import { BreadcrumbSchema } from '../components/seo/BreadcrumbSchema.jsx';
import { sanitizeHtml } from '../utils/sanitizeHtml.js';
import { FAQSchema } from '../components/seo/FAQSchema.jsx';
import { resolveMediaUrl } from '../utils/media.js';

export const BlogDetail = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const res = await productService.getBlogBySlug(slug);
        if (res?.blog) {
          setBlog(res.blog);
          setRecentBlogs(res.recentBlogs || []);
          // "Shop the products" – products this article is about
          // One request; products that no longer exist are simply left out (no 404s)
          const slugs = (res.blog.relatedProductSlugs || []).slice(0, 4);
          if (slugs.length) {
            productService
              .getProducts({ slugs: slugs.join(','), limit: slugs.length })
              .then((r) => setRelatedProducts(Array.isArray(r?.data) ? r.data : []))
              .catch(() => setRelatedProducts([]));
          } else {
            setRelatedProducts([]);
          }
        }
      } catch (err) {
        console.error('Failed to load blog article', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="bg-noir min-h-screen py-24 text-center">
        <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="font-serif text-xs uppercase tracking-widest text-gold">Loading article…</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="bg-noir min-h-screen py-24 text-center px-4">
        <h2 className="font-serif text-xl uppercase tracking-wider text-zinc-300 mb-4">
          Article Not Found
        </h2>
        <Link to="/blog" className="btn-gold text-xs py-3 px-6">
          Return to Blog
        </Link>
      </div>
    );
  }

  const breadcrumbList = [
    { name: 'Home', url: '/' },
    { name: 'Journal', url: '/blog' },
    { name: blog.title, url: `/blog/${blog.slug}` },
  ];

  return (
    <article className="bg-noir min-h-screen text-zinc-100 py-10 px-4 sm:px-8 max-w-4xl mx-auto">
      <SEO
        title={blog.seo?.metaTitle || `${blog.title} | Jayrup Journal`}
        description={blog.seo?.metaDescription || blog.excerpt}
        keywords={blog.seo?.metaKeywords}
        canonicalUrl={blog.seo?.canonicalUrl || `/blog/${blog.slug}`}
        ogImage={blog.coverImage?.url}
        ogType="article"
      >
        <ArticleSchema blog={blog} />
        <BreadcrumbSchema items={breadcrumbList} />
        <FAQSchema faqs={blog.faqs || []} />
      </SEO>

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-zinc-500 mb-8">
        <Link to="/" className="hover:text-gold transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/blog" className="hover:text-gold transition-colors">Blog</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-gold font-medium truncate">{blog.title}</span>
      </nav>

      {/* Article Header */}
      <header className="space-y-4 mb-8 text-center sm:text-left">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-[11px] uppercase tracking-widest text-zinc-500">
          <span className="text-gold font-semibold">{blog.category}</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {blog.readTime}
          </span>
          <span>•</span>
          <time dateTime={blog.publishedAt}>{new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</time>
        </div>

        <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl uppercase tracking-wider font-bold text-zinc-100 leading-tight">
          {blog.title}
        </h1>

        <p className="text-zinc-400 text-sm sm:text-base font-light italic leading-relaxed max-w-2xl">
          "{blog.excerpt}"
        </p>

        <div className="flex items-center justify-between border-y border-zinc-800 py-3 text-xs text-zinc-400">
          <span className="flex items-center gap-1.5 font-medium text-zinc-300">
            <User className="w-3.5 h-3.5 text-gold" />
            {blog.author}
          </span>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: blog.title, url: window.location.href });
              } else {
                navigator.clipboard?.writeText(window.location.href).catch(() => {});
              }
            }}
            className="flex items-center gap-1.5 text-zinc-400 hover:text-gold transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>
        </div>
      </header>

      {/* Cover Image */}
      <div className="aspect-16/9 overflow-hidden bg-zinc-900 border border-gold/20 shadow-2xl mb-10">
        <img
          src={resolveMediaUrl(blog.coverImage?.url)}
          alt={blog.coverImage?.altText || blog.title}
          className="w-full h-full object-cover"
          fetchPriority="high"
          loading="eager"
        />
      </div>

      {/* Content */}
      <div
        className="rich-content text-zinc-300 text-sm sm:text-base leading-relaxed max-w-none border-b border-zinc-800 pb-12"
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(blog.content) }}
      />

      {/* Tags */}
      {blog.tags && blog.tags.length > 0 && (
        <div className="pt-6 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-zinc-500 uppercase tracking-wider text-[10px]">Tags:</span>
          {blog.tags.map((t, idx) => (
            <span
              key={idx}
              className="bg-noir-card border border-zinc-800 px-3 py-1 text-zinc-400 text-[11px]"
            >
              #{t}
            </span>
          ))}
        </div>
      )}

      {/* Shop the products mentioned in this article */}
      {relatedProducts.length > 0 && (
        <section className="mt-12" aria-labelledby="shop-products">
          <h2 id="shop-products" className="font-serif text-lg uppercase tracking-wider text-gold font-semibold mb-5">
            Shop the products
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {relatedProducts.map((p) => {
              const img = p.images?.find((x) => x.isPrimary) || p.images?.[0];
              const price = p.salePrice && p.salePrice < p.price ? p.salePrice : p.price;
              return (
                <Link
                  key={p._id}
                  to={`/products/${p.slug}`}
                  className="group flex items-center gap-4 p-3 bg-noir-card border border-gold/20 hover:border-gold/50 transition-colors"
                >
                  <img src={resolveMediaUrl(img?.url)} alt={img?.altText || p.name} loading="lazy" className="w-24 h-24 object-cover shrink-0 bg-zinc-900" />
                  <span className="min-w-0">
                    <span className="block font-serif text-sm text-zinc-100 group-hover:text-gold-light line-clamp-2">{p.name}</span>
                    <span className="block text-sm text-zinc-300 mt-1">₹{price}</span>
                    <span className="mt-2 inline-flex items-center gap-1 text-[11px] text-gold uppercase tracking-wider font-semibold">
                      Shop now <ArrowRight className="w-3 h-3" />
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* FAQs (also published as FAQPage structured data) */}
      {blog.faqs?.length > 0 && (
        <section className="mt-12" aria-labelledby="article-faqs">
          <h2 id="article-faqs" className="font-serif text-lg uppercase tracking-wider text-gold font-semibold mb-4">
            Frequently asked questions
          </h2>
          <div className="divide-y divide-zinc-800 border-y border-zinc-800">
            {blog.faqs.map((f, i) => (
              <details key={i} className="group py-4" open={i === 0}>
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none text-zinc-100 font-medium hover:text-gold-light">
                  <h3 className="text-[15px] font-medium">{f.question}</h3>
                  <ChevronDown className="w-4 h-4 text-gold shrink-0 transition-transform group-open:rotate-180" aria-hidden="true" />
                </summary>
                <p className="mt-3 text-sm text-zinc-400 leading-relaxed">{f.answer}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* Recent Articles */}
      {recentBlogs.length > 0 && (
        <div className="mt-16 pt-10 border-t border-zinc-900">
          <h3 className="font-serif text-lg uppercase tracking-wider text-gold font-semibold mb-6">
            More from the Jayrup Journal
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {recentBlogs.map((r) => (
              <Link
                key={r._id}
                to={`/blog/${r.slug}`}
                className="group p-4 bg-noir-card border border-gold/15 hover:border-gold/40 transition-all block"
              >
                <div className="aspect-16/9 bg-zinc-900 overflow-hidden mb-3">
                  <img
                    src={resolveMediaUrl(r.coverImage?.url)}
                    alt={r.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h4 className="font-serif text-xs font-semibold text-zinc-200 group-hover:text-gold-light line-clamp-2">
                  {r.title}
                </h4>
                <span className="text-[10px] text-zinc-500 block mt-2">
                  {r.readTime}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
};
