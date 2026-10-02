import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Video, Image, Check, X } from 'lucide-react';
import { adminService } from '../../services/adminService.js';
import { Badge } from '../../components/common/Badge.jsx';

export const AdminAds = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    mediaType: 'VIDEO',
    mediaUrl: '',
    posterUrl: '',
    ctaText: 'EXPLORE COLLECTION',
    ctaUrl: '/shop',
    location: 'HOMEPAGE_HERO',
    priority: 10,
    status: 'ACTIVE',
  });

  const loadAds = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAds();
      if (Array.isArray(data)) setAds(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAds();
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      mediaType: 'VIDEO',
      mediaUrl: '',
      posterUrl: '',
      ctaText: 'EXPLORE COLLECTION',
      ctaUrl: '/shop',
      location: 'HOMEPAGE_HERO',
      priority: 10,
      status: 'ACTIVE',
    });
    setShowModal(true);
  };

  const handleOpenEdit = (ad) => {
    setEditingId(ad._id);
    setFormData({
      title: ad.title,
      subtitle: ad.subtitle || '',
      description: ad.description || '',
      mediaType: ad.mediaType,
      mediaUrl: ad.mediaUrl,
      posterUrl: ad.posterUrl || '',
      ctaText: ad.ctaText,
      ctaUrl: ad.ctaUrl,
      location: ad.location,
      priority: ad.priority,
      status: ad.status,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await adminService.updateAd(editingId, formData);
      } else {
        await adminService.createAd(formData);
      }
      setShowModal(false);
      loadAds();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this campaign advertisement?')) {
      try {
        await adminService.deleteAd(id);
        loadAds();
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
            Dynamic Campaign & Promotional Videos
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Control the homepage hero promotional video, banners, and call-to-actions dynamically
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="btn-gold py-2.5 px-4 text-xs flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Campaign Media</span>
        </button>
      </div>

      <div className="bg-noir-card border border-gold/20 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-zinc-800 text-[10px] uppercase tracking-wider text-zinc-400">
            <tr>
              <th className="py-3 px-4">Campaign Headline</th>
              <th className="py-3 px-4">Media Type</th>
              <th className="py-3 px-4">Location</th>
              <th className="py-3 px-4">CTA Text & Link</th>
              <th className="py-3 px-4">Priority</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {ads.map((ad) => (
              <tr key={ad._id} className="hover:bg-white/5 transition-colors">
                <td className="py-3 px-4">
                  <p className="font-semibold text-zinc-200">{ad.title}</p>
                  <p className="text-[10px] text-zinc-500">{ad.subtitle}</p>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1.5 text-zinc-300">
                    {ad.mediaType === 'VIDEO' ? <Video className="w-3.5 h-3.5 text-gold" /> : <Image className="w-3.5 h-3.5 text-blue-400" />}
                    <span>{ad.mediaType}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-gold/80 font-mono text-[11px]">{ad.location}</td>
                <td className="py-3 px-4 text-zinc-300">
                  <span className="font-semibold">{ad.ctaText}</span> ({ad.ctaUrl})
                </td>
                <td className="py-3 px-4 font-bold text-zinc-200">{ad.priority}</td>
                <td className="py-3 px-4">
                  <Badge variant={ad.status === 'ACTIVE' ? 'gold' : 'noir'}>
                    {ad.status}
                  </Badge>
                </td>
                <td className="py-3 px-4 text-right space-x-2">
                  <button onClick={() => handleOpenEdit(ad)} className="p-1 text-zinc-400 hover:text-gold">
                    <Edit2 className="w-4 h-4 inline" />
                  </button>
                  <button onClick={() => handleDelete(ad._id)} className="p-1 text-zinc-400 hover:text-red-400">
                    <Trash2 className="w-4 h-4 inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Ad Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-noir-card border border-gold/40 p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-serif text-lg text-gold uppercase tracking-wider font-semibold">
                {editingId ? 'Edit Campaign Media' : 'New Campaign Media'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1">
                  Main Headline *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. THE CROWN OF ROYAL LUXURY"
                  className="w-full bg-noir border border-zinc-800 p-2.5 text-zinc-100 focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1">
                  Subtitle / Subheading
                </label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="e.g. JAYROOP ROYAL FRAGRANCE HOUSE"
                  className="w-full bg-noir border border-zinc-800 p-2.5 text-zinc-100 focus:outline-none focus:border-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1">
                    Media Type
                  </label>
                  <select
                    value={formData.mediaType}
                    onChange={(e) => setFormData({ ...formData, mediaType: e.target.value })}
                    className="w-full bg-noir border border-zinc-800 p-2.5 text-zinc-100 focus:outline-none focus:border-gold"
                  >
                    <option value="VIDEO">VIDEO (MP4 stream)</option>
                    <option value="IMAGE">IMAGE</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1">
                    Display Location
                  </label>
                  <select
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full bg-noir border border-zinc-800 p-2.5 text-zinc-100 focus:outline-none focus:border-gold"
                  >
                    <option value="HOMEPAGE_HERO">Homepage Hero (Primary)</option>
                    <option value="HOMEPAGE_CAMPAIGN">Homepage Banner</option>
                    <option value="CATEGORY_HEADER">Category Header</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1">
                  Media Direct URL (Cloudinary / MP4 link) *
                </label>
                <input
                  type="url"
                  required
                  value={formData.mediaUrl}
                  onChange={(e) => setFormData({ ...formData, mediaUrl: e.target.value })}
                  placeholder="https://...mp4"
                  className="w-full bg-noir border border-zinc-800 p-2.5 text-zinc-100 focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1">
                  Poster Thumbnail URL (For instant video preview)
                </label>
                <input
                  type="url"
                  value={formData.posterUrl}
                  onChange={(e) => setFormData({ ...formData, posterUrl: e.target.value })}
                  placeholder="https://...jpg"
                  className="w-full bg-noir border border-zinc-800 p-2.5 text-zinc-100 focus:outline-none focus:border-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1">
                    CTA Button Text
                  </label>
                  <input
                    type="text"
                    value={formData.ctaText}
                    onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                    placeholder="EXPLORE COLLECTION"
                    className="w-full bg-noir border border-zinc-800 p-2.5 text-zinc-100 focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1">
                    CTA Target Link
                  </label>
                  <input
                    type="text"
                    value={formData.ctaUrl}
                    onChange={(e) => setFormData({ ...formData, ctaUrl: e.target.value })}
                    placeholder="/shop"
                    className="w-full bg-noir border border-zinc-800 p-2.5 text-zinc-100 focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1">
                    Priority (Higher shows first)
                  </label>
                  <input
                    type="number"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full bg-noir border border-zinc-800 p-2.5 text-zinc-100 focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-noir border border-zinc-800 p-2.5 text-zinc-100 focus:outline-none focus:border-gold"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
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
                  {editingId ? 'Update Campaign' : 'Save & Publish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
