import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Video, Eye, Sparkles, Check, X, Search, ShoppingBag } from 'lucide-react';
import { adminService } from '../../services/adminService.js';
import { productService } from '../../services/productService.js';
import { Badge } from '../../components/common/Badge.jsx';
import { ImageDropzone } from '../../components/common/ImageDropzone.jsx';

export const AdminInfluencerVideos = () => {
  const [videos, setVideos] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'INSPIRATIONS' | 'SCENT_FLUENCER'
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const initialFormData = {
    title: '',
    sectionType: 'INSPIRATIONS',
    influencerName: '',
    caption: '',
    videoUrl: '',
    posterUrl: '',
    altText: '',
    seoDescription: '',
    seoKeywords: '',
    videoDuration: '1:00',
    viewsCount: '1.5k',
    taggedProduct: '',
    externalUrl: '',
    priority: 10,
    status: 'ACTIVE',
  };

  const [formData, setFormData] = useState(initialFormData);

  const loadData = async () => {
    try {
      setLoading(true);
      const [videoRes, productRes] = await Promise.all([
        adminService.getAdminInfluencers({ limit: 100 }),
        productService.getProducts({ limit: 100 }),
      ]);
      if (videoRes?.data) setVideos(videoRes.data);
      if (productRes?.data) setProducts(productRes.data);
    } catch (err) {
      console.error('Failed to load influencer videos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setErrorMsg(null);
    setFormData({
      ...initialFormData,
      sectionType: activeTab === 'SCENT_FLUENCER' ? 'SCENT_FLUENCER' : 'INSPIRATIONS',
    });
    setShowModal(true);
  };

  const handleOpenEdit = (v) => {
    setEditingId(v._id);
    setErrorMsg(null);
    setFormData({
      title: v.title || '',
      sectionType: v.sectionType || 'INSPIRATIONS',
      influencerName: v.influencerName || '',
      caption: v.caption || '',
      videoUrl: v.videoUrl || '',
      posterUrl: v.posterUrl || '',
      altText: v.altText || '',
      seoDescription: v.seoDescription || '',
      seoKeywords: Array.isArray(v.seoKeywords) ? v.seoKeywords.join(', ') : (v.seoKeywords || ''),
      videoDuration: v.videoDuration || '1:00',
      viewsCount: v.viewsCount || '1.0k',
      taggedProduct: v.taggedProduct?._id || v.taggedProduct || '',
      externalUrl: v.externalUrl || '',
      priority: v.priority ?? 10,
      status: v.status || 'ACTIVE',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.videoUrl) {
      setErrorMsg('Title and Video URL/Upload are required.');
      return;
    }

    try {
      setSaving(true);
      setErrorMsg(null);

      const payload = {
        ...formData,
        seoKeywords: typeof formData.seoKeywords === 'string'
          ? formData.seoKeywords.split(',').map((k) => k.trim()).filter(Boolean)
          : formData.seoKeywords,
        taggedProduct: formData.taggedProduct ? formData.taggedProduct : null,
      };

      if (editingId) {
        await adminService.updateInfluencerVideo(editingId, payload);
      } else {
        await adminService.createInfluencerVideo(payload);
      }

      setShowModal(false);
      loadData();
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Operation failed. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this influencer video?')) return;
    try {
      await adminService.deleteInfluencerVideo(id);
      loadData();
    } catch (err) {
      console.error(err);
      alert('Failed to delete video');
    }
  };

  const filteredVideos = videos.filter((v) => {
    if (activeTab === 'ALL') return true;
    return v.sectionType === activeTab;
  });

  return (
    <div className="space-y-6 text-zinc-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center space-x-2.5">
            <span className="p-2 rounded-lg bg-gold/10 border border-gold/30 text-gold">
              <Video size={20} />
            </span>
            <h1 className="font-serif text-2xl uppercase tracking-wider text-zinc-100 font-bold">
              Influencer & Campaign Videos
            </h1>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Manage Inspirations (16:9 Celebrities) & Scent-Fluencers (9:16 Shoppable Reels) with deep Cloudinary upload & Google Video SEO.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="btn-gold py-2.5 px-4 text-xs flex items-center gap-2 font-semibold tracking-wider uppercase shadow-lg"
        >
          <Plus size={16} />
          <span>Add New Video</span>
        </button>
      </div>

      {/* Tabs Filter */}
      <div className="flex items-center space-x-2 border-b border-zinc-800 pb-3">
        <button
          onClick={() => setActiveTab('ALL')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all ${
            activeTab === 'ALL'
              ? 'bg-gold/15 text-gold border border-gold/40 shadow-sm'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60 border border-transparent'
          }`}
        >
          All Videos ({videos.length})
        </button>
        <button
          onClick={() => setActiveTab('INSPIRATIONS')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all ${
            activeTab === 'INSPIRATIONS'
              ? 'bg-gold/15 text-gold border border-gold/40 shadow-sm'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60 border border-transparent'
          }`}
        >
          Inspirations (16:9 Campaigns)
        </button>
        <button
          onClick={() => setActiveTab('SCENT_FLUENCER')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all ${
            activeTab === 'SCENT_FLUENCER'
              ? 'bg-gold/15 text-gold border border-gold/40 shadow-sm'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60 border border-transparent'
          }`}
        >
          Our Scent-Fluencer (9:16 Reels)
        </button>
      </div>

      {/* Videos List / Table */}
      {loading ? (
        <div className="py-20 text-center text-zinc-500 font-mono text-xs">Loading influencer videos...</div>
      ) : filteredVideos.length === 0 ? (
        <div className="py-16 text-center bg-noir-card rounded-2xl border border-zinc-800">
          <Video size={40} className="mx-auto text-zinc-600 mb-3" />
          <h3 className="text-sm font-serif font-medium text-zinc-300 uppercase tracking-wider">No videos found</h3>
          <p className="text-xs text-zinc-500 mt-1">Get started by adding your first celebrity story or shoppable reel.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((item) => (
            <div
              key={item._id}
              className="bg-noir-card rounded-xl border border-gold/20 hover:border-gold/50 shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
            >
              <div>
                {/* Media Preview Header */}
                <div className={`relative ${item.sectionType === 'SCENT_FLUENCER' ? 'aspect-[9/16] max-h-72' : 'aspect-video'} bg-noir overflow-hidden`}>
                  <img
                    src={item.posterUrl || 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=600'}
                    alt={item.altText || item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-90 group-hover:brightness-100"
                  />
                  <div className="absolute top-2 left-2 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-noir/85 backdrop-blur-md text-gold border border-gold/30 shadow-md">
                      {item.sectionType === 'SCENT_FLUENCER' ? '9:16 Reel' : '16:9 Story'}
                    </span>
                    <Badge variant={item.status === 'ACTIVE' ? 'gold' : 'noir'}>
                      {item.status}
                    </Badge>
                  </div>
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-[11px] font-mono text-zinc-200 bg-black/80 border border-zinc-700">
                    {item.videoDuration || '1:00'}
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-gold uppercase tracking-wider text-[11px]">
                      {item.influencerName || 'Brand Icon'}
                    </span>
                    <span className="flex items-center space-x-1 text-zinc-400 text-[11px]">
                      <Eye size={12} className="text-gold/70" />
                      <span>{item.viewsCount || '0'} views</span>
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-zinc-100 text-sm line-clamp-1 group-hover:text-gold transition-colors">
                    {item.title}
                  </h3>

                  {item.caption && (
                    <p className="text-xs text-zinc-400 line-clamp-2 italic font-light">
                      "{item.caption}"
                    </p>
                  )}

                  {/* Tagged Product Box */}
                  {item.taggedProduct && (
                    <div className="mt-2 p-2 bg-noir border border-zinc-800 rounded-lg flex items-center space-x-2">
                      <ShoppingBag size={14} className="text-gold flex-shrink-0" />
                      <span className="text-xs text-zinc-300 truncate font-medium">
                        Tagged: {item.taggedProduct.name || 'Selected Product'}
                      </span>
                    </div>
                  )}

                  {/* SEO Alt Text snippet */}
                  <div className="text-[11px] text-zinc-400 bg-noir/60 border border-zinc-800/80 p-2 rounded truncate">
                    <strong className="text-gold/80">Alt:</strong> {item.altText || 'Auto-generated'}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-3 bg-zinc-900/50 border-t border-zinc-800 flex items-center justify-end space-x-2">
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="p-1.5 text-zinc-400 hover:text-gold hover:bg-zinc-800 rounded-lg transition-colors"
                  title="Edit Video"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                  title="Delete Video"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit / Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-noir-card rounded-2xl shadow-2xl border border-gold/40 my-8 overflow-hidden text-zinc-100">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-noir">
              <h2 className="text-lg font-serif font-bold text-gold uppercase tracking-wider">
                {editingId ? 'Edit Influencer Video' : 'Add New Influencer Video'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto bg-noir-card text-zinc-200">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/50 text-red-300 text-xs font-medium">
                  {errorMsg}
                </div>
              )}

              {/* Section Type Selector */}
              <div>
                <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-2 font-semibold">
                  Display Section Type *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, sectionType: 'INSPIRATIONS' })}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      formData.sectionType === 'INSPIRATIONS'
                        ? 'border-gold bg-gold/10 text-gold ring-1 ring-gold/40'
                        : 'border-zinc-800 bg-noir text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-300'
                    }`}
                  >
                    <span className="block font-bold text-xs">INSPIRATIONS</span>
                    <span className="block text-[11px] text-zinc-500 mt-0.5">16:9 Landscape Celebrities / Ambience</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, sectionType: 'SCENT_FLUENCER' })}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      formData.sectionType === 'SCENT_FLUENCER'
                        ? 'border-gold bg-gold/10 text-gold ring-1 ring-gold/40'
                        : 'border-zinc-800 bg-noir text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-300'
                    }`}
                  >
                    <span className="block font-bold text-xs">OUR SCENT-FLUENCER</span>
                    <span className="block text-[11px] text-zinc-500 mt-0.5">9:16 Vertical Shoppable Video Reels</span>
                  </button>
                </div>
              </div>

              {/* Title & Influencer Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1 font-semibold">
                    Video Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. SRK's Humbleness Radiates..."
                    className="w-full bg-noir border border-zinc-800 p-2.5 text-xs sm:text-sm text-zinc-100 placeholder-zinc-600 rounded-lg focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1 font-semibold">
                    Influencer / Icon Name
                  </label>
                  <input
                    type="text"
                    value={formData.influencerName}
                    onChange={(e) => setFormData({ ...formData, influencerName: e.target.value })}
                    placeholder="e.g. Shah Rukh Khan / Aarav Sharma"
                    className="w-full bg-noir border border-zinc-800 p-2.5 text-xs sm:text-sm text-zinc-100 placeholder-zinc-600 rounded-lg focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              {/* Caption */}
              <div>
                <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1 font-semibold">
                  Caption / Quote
                </label>
                <input
                  type="text"
                  value={formData.caption}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  placeholder="e.g. The Scent of My Success • Dignity & Grace"
                  className="w-full bg-noir border border-zinc-800 p-2.5 text-xs sm:text-sm text-zinc-100 placeholder-zinc-600 rounded-lg focus:outline-none focus:border-gold"
                />
              </div>

              {/* Media Uploads via Cloudinary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <ImageDropzone
                    isVideo={true}
                    accept="video/mp4,video/webm"
                    label="Campaign / Reel MP4 Video *"
                    hint="Drag & drop video (MP4/WebM) or paste URL"
                    folder="influencers/videos"
                    value={formData.videoUrl}
                    onChange={(url) => setFormData({ ...formData, videoUrl: url })}
                  />
                </div>
                <div>
                  <ImageDropzone
                    isVideo={false}
                    accept="image/*"
                    label="Poster Thumbnail *"
                    hint="Thumbnail displayed before playback"
                    folder="influencers/posters"
                    value={formData.posterUrl}
                    onChange={(url) => setFormData({ ...formData, posterUrl: url })}
                  />
                </div>
              </div>

              {/* Shoppable Tagged Product Selector */}
              <div>
                <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1 font-semibold">
                  Tag Shoppable Product (Pinned at bottom of Reel)
                </label>
                <select
                  value={formData.taggedProduct}
                  onChange={(e) => setFormData({ ...formData, taggedProduct: e.target.value })}
                  className="w-full bg-noir border border-zinc-800 p-2.5 text-xs sm:text-sm text-zinc-100 rounded-lg focus:outline-none focus:border-gold"
                >
                  <option value="">-- No Tagged Product --</option>
                  {products.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name} (₹{p.price})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-zinc-500 mt-1">
                  Visitors can click "Shop Now" directly from the reel.
                </p>
              </div>

              {/* Deep SEO Fields */}
              <div className="p-4 bg-noir/70 rounded-xl border border-gold/20 space-y-3">
                <div className="flex items-center space-x-2 text-xs font-bold text-gold uppercase tracking-wider">
                  <Sparkles size={14} className="text-gold" />
                  <span>Deep Video SEO & Ranking Metadata</span>
                </div>

                <div>
                  <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1 font-semibold">
                    Image / Video Alt Text (Google Image & Video Indexing) *
                  </label>
                  <input
                    type="text"
                    value={formData.altText}
                    onChange={(e) => setFormData({ ...formData, altText: e.target.value })}
                    placeholder="e.g. Shah Rukh Khan wearing Royal Oud Eau De Parfum"
                    className="w-full bg-noir border border-zinc-800 p-2 text-xs text-zinc-100 placeholder-zinc-600 rounded-lg focus:outline-none focus:border-gold"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1 font-semibold">
                      SEO Description (schema.org/VideoObject)
                    </label>
                    <textarea
                      rows={2}
                      value={formData.seoDescription}
                      onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                      placeholder="Rich synopsis of the fragrance notes, formulation, and celebrity thoughts..."
                      className="w-full bg-noir border border-zinc-800 p-2 text-xs text-zinc-100 placeholder-zinc-600 rounded-lg focus:outline-none focus:border-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1 font-semibold">
                      SEO Keywords (comma separated)
                    </label>
                    <textarea
                      rows={2}
                      value={formData.seoKeywords}
                      onChange={(e) => setFormData({ ...formData, seoKeywords: e.target.value })}
                      placeholder="Royal Oud, Luxury Perfume, Marwad Perfume, SRK..."
                      className="w-full bg-noir border border-zinc-800 p-2 text-xs text-zinc-100 placeholder-zinc-600 rounded-lg focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>
              </div>

              {/* View Count, Duration, Priority & Status */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1 font-semibold">Duration</label>
                  <input
                    type="text"
                    value={formData.videoDuration}
                    onChange={(e) => setFormData({ ...formData, videoDuration: e.target.value })}
                    placeholder="e.g. 1:15"
                    className="w-full bg-noir border border-zinc-800 p-2 text-xs text-zinc-100 rounded-lg focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1 font-semibold">Views Badge</label>
                  <input
                    type="text"
                    value={formData.viewsCount}
                    onChange={(e) => setFormData({ ...formData, viewsCount: e.target.value })}
                    placeholder="e.g. 2.4k"
                    className="w-full bg-noir border border-zinc-800 p-2 text-xs text-zinc-100 rounded-lg focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1 font-semibold">Priority</label>
                  <input
                    type="number"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 0 })}
                    className="w-full bg-noir border border-zinc-800 p-2 text-xs text-zinc-100 rounded-lg focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1 font-semibold">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-noir border border-zinc-800 p-2 text-xs text-zinc-100 rounded-lg focus:outline-none focus:border-gold"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
              </div>

              {/* External / YouTube Channel Link */}
              <div>
                <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1 font-semibold">
                  External URL / Official YouTube Link (Optional)
                </label>
                <input
                  type="url"
                  value={formData.externalUrl}
                  onChange={(e) => setFormData({ ...formData, externalUrl: e.target.value })}
                  placeholder="https://www.youtube.com/channel/..."
                  className="w-full bg-noir border border-zinc-800 p-2.5 text-xs text-zinc-100 placeholder-zinc-600 rounded-lg focus:outline-none focus:border-gold"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-zinc-800 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg border border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800 text-xs font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-gold px-5 py-2 text-xs font-semibold uppercase tracking-wider shadow-md disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingId ? 'Update Video' : 'Create Video'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInfluencerVideos;
