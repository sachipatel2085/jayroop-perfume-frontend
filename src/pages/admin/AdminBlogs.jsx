import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, BookOpen, X } from 'lucide-react';
import { adminService } from '../../services/adminService.js';
import { Badge } from '../../components/common/Badge.jsx';
import { ImageDropzone } from '../../components/common/ImageDropzone.jsx';

export const AdminBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Fragrance & Skincare',
    excerpt: '',
    content: '',
    coverImageUrl: '',
    author: 'Jayrup Editorial House',
    readTime: '5 min read',
    tags: 'Fragrance, Luxury, Heritage',
    status: 'PUBLISHED',
  });

  const loadBlogs = async () => {
    try {
      setLoading(true);
      const res = await adminService.getBlogs({ limit: 50 });
      if (res?.data) setBlogs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      title: '',
      slug: '',
      category: 'Fragrance & Skincare',
      excerpt: '',
      content: '',
      coverImageUrl: '',
      author: 'Jayrup Editorial House',
      readTime: '5 min read',
      tags: 'Fragrance, Luxury, Heritage',
      status: 'PUBLISHED',
    });
    setShowModal(true);
  };

  const handleOpenEdit = (b) => {
    setEditingId(b._id);
    setFormData({
      title: b.title,
      slug: b.slug,
      category: b.category,
      excerpt: b.excerpt,
      content: b.content,
      coverImageUrl: b.coverImage?.url || '',
      author: b.author,
      readTime: b.readTime,
      tags: b.tags?.join(', ') || '',
      status: b.status,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: formData.title,
        slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-'),
        category: formData.category,
        excerpt: formData.excerpt,
        content: formData.content,
        coverImage: { url: formData.coverImageUrl },
        author: formData.author,
        readTime: formData.readTime,
        tags: formData.tags.split(',').map((t) => t.trim()),
        status: formData.status,
      };

      if (editingId) {
        await adminService.updateBlog(editingId, payload);
      } else {
        await adminService.createBlog(payload);
      }

      setShowModal(false);
      loadBlogs();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete article?')) {
      try {
        await adminService.deleteBlog(id);
        loadBlogs();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl uppercase tracking-wider text-zinc-100 font-bold">
            Editorial Scent Journal CMS
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Publish SEO-optimized fragrance rituals, botanical research, and heritage stories
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="btn-gold py-2.5 px-4 text-xs flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Write New Article</span>
        </button>
      </div>

      <div className="bg-noir-card border border-gold/20 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-zinc-800 text-[10px] uppercase tracking-wider text-zinc-400">
            <tr>
              <th className="py-3 px-4">Article Title</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Author</th>
              <th className="py-3 px-4">Read Time</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {blogs.map((b) => (
              <tr key={b._id} className="hover:bg-white/5 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={b.coverImage?.url || 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=100'}
                      alt=""
                      className="w-10 h-10 object-cover border border-zinc-800 flex-shrink-0"
                    />
                    <div>
                      <p className="font-semibold text-zinc-200">{b.title}</p>
                      <p className="text-[10px] font-mono text-gold/80">/blog/{b.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 text-zinc-300">{b.category}</td>
                <td className="py-3 px-4 text-zinc-400">{b.author}</td>
                <td className="py-3 px-4 text-zinc-400">{b.readTime}</td>
                <td className="py-3 px-4">
                  <Badge variant={b.status === 'PUBLISHED' ? 'emerald' : 'noir'}>
                    {b.status}
                  </Badge>
                </td>
                <td className="py-3 px-4 text-right space-x-2">
                  <button onClick={() => handleOpenEdit(b)} className="p-1 text-zinc-400 hover:text-gold">
                    <Edit2 className="w-4 h-4 inline" />
                  </button>
                  <button onClick={() => handleDelete(b._id)} className="p-1 text-zinc-400 hover:text-red-400">
                    <Trash2 className="w-4 h-4 inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Blog Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-noir-card border border-gold/40 p-6 sm:p-8 max-w-2xl w-full space-y-4 shadow-2xl text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-serif text-lg text-gold uppercase tracking-wider font-semibold">
                {editingId ? 'Edit Article' : 'Write Journal Article'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1">Article Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-noir border border-zinc-800 p-2.5 text-zinc-100 focus:outline-none focus:border-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-noir border border-zinc-800 p-2.5 text-zinc-100 focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1">Read Time</label>
                  <input
                    type="text"
                    value={formData.readTime}
                    onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                    className="w-full bg-noir border border-zinc-800 p-2.5 text-zinc-100 focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <ImageDropzone
                value={formData.coverImageUrl}
                onChange={(url) => setFormData({ ...formData, coverImageUrl: url })}
                folder="blogs"
                label="Article Editorial Cover Photo"
                hint="Upload high-res editorial banner (PNG, JPG, WebP)"
                required={true}
              />

              <div>
                <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1">Excerpt (Short preview) *</label>
                <textarea
                  rows={2}
                  required
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="w-full bg-noir border border-zinc-800 p-2.5 text-zinc-100 focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1">Content (HTML supported) *</label>
                <textarea
                  rows={6}
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full bg-noir border border-zinc-800 p-2.5 text-zinc-100 focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1">Tags (Comma-separated)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="Fragrance, Oud, Sandalwood"
                  className="w-full bg-noir border border-zinc-800 p-2.5 text-zinc-100 focus:outline-none focus:border-gold"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-zinc-800 text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-gold py-2 px-6 text-xs">
                  Publish Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
