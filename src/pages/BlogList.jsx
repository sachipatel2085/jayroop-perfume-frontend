import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Clock, Calendar } from 'lucide-react';
import { productService } from '../services/productService.js';
import { SEO } from '../components/seo/SEO.jsx';
import { BreadcrumbSchema } from '../components/seo/BreadcrumbSchema.jsx';

export const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productService
      .getBlogs({ limit: 12 })
      .then((res) => {
        if (res?.data) setBlogs(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-noir min-h-screen text-zinc-100 py-12 px-4 sm:px-8 max-w-7xl mx-auto">
      <SEO
        title="The Royal Blog & Editorial | Jayrup Fragrance House"
        description="Essays, rituals, and botanical insights on royal Indian extraits de parfum, artisanal distillation, and Ayurvedic skincare from the house of Jayrup."
        canonicalUrl="https://jayrup.com/blog"
      >
        <BreadcrumbSchema
          items={[
            { name: 'Home', url: '/' },
            { name: 'The Royal Blog', url: '/blog' },
          ]}
        />
      </SEO>

      <div className="border-b border-gold/20 pb-8 mb-12 text-center max-w-2xl mx-auto space-y-3">
        <span className="text-[10px] uppercase tracking-[0.3em] text-gold font-semibold">
          Editorial & Fragrance Philosophy
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl uppercase tracking-wider font-bold text-zinc-100">
          The Royal Blog
        </h1>
        <p className="text-xs text-zinc-400 font-light">
          Explorations in royal Indian distillation, oud maturation, and the science of skin confidence.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2].map((n) => (
            <div key={n} className="h-96 bg-noir-card border border-zinc-800 animate-pulse" />
          ))}
        </div>
      ) : blogs.length === 0 ? (
        <p className="text-center text-zinc-500 py-20">No blog articles published yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {blogs.map((blog) => (
            <article
              key={blog._id}
              className="group bg-noir-card border border-gold/15 hover:border-gold/45 transition-all flex flex-col justify-between overflow-hidden"
            >
              <div>
                <Link to={`/blog/${blog.slug}`} className="block aspect-16/9 overflow-hidden bg-zinc-900">
                  <img
                    src={blog.coverImage?.url}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </Link>

                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-3 text-[10px] uppercase tracking-wider text-zinc-500">
                    <span className="text-gold font-semibold">{blog.category}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {blog.readTime}
                    </span>
                  </div>

                  <Link to={`/blog/${blog.slug}`}>
                    <h2 className="font-serif text-xl font-bold text-zinc-100 group-hover:text-gold-light transition-colors leading-snug">
                      {blog.title}
                    </h2>
                  </Link>

                  <p className="text-xs text-zinc-400 font-light leading-relaxed line-clamp-3">
                    {blog.excerpt}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2">
                <Link
                  to={`/blog/${blog.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs text-gold uppercase tracking-wider font-semibold group-hover:text-gold-light"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
