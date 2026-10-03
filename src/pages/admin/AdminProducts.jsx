import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Package, Check, X } from 'lucide-react';
import { adminService } from '../../services/adminService.js';
import { Badge } from '../../components/common/Badge.jsx';
import { ImageDropzone } from '../../components/common/ImageDropzone.jsx';

export const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category: '',
    subCategory: '',
    brand: 'Jayrup Special',
    shortDescription: '',
    description: '',
    price: '',
    salePrice: '',
    sku: '',
    stock: '',
    imageUrl: '',
    featured: false,
    status: 'ACTIVE',
    specKey1: 'Top Notes',
    specVal1: '',
    specKey2: 'Heart Notes',
    specVal2: '',
    specKey3: 'Base Notes',
    specVal3: '',
    variant1Title: '50ml',
    variant1Sku: '',
    variant1Price: '',
    variant1Stock: '',
    variant2Title: '100ml',
    variant2Sku: '',
    variant2Price: '',
    variant2Stock: '',
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        adminService.getProducts({ limit: 50, search }),
        adminService.getCategories(),
      ]);
      if (prodRes?.data) setProducts(prodRes.data);
      if (Array.isArray(catRes)) setCategories(catRes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [search]);

  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormData({
      name: '',
      slug: '',
      category: categories[0]?._id || '',
      subCategory: '',
      brand: 'Jayrup Special',
      shortDescription: '',
      description: '',
      price: '',
      salePrice: '',
      sku: `JR-${Date.now().toString().slice(-4)}`,
      stock: '25',
      imageUrl: '',
      featured: false,
      status: 'ACTIVE',
      specKey1: 'Top Notes',
      specVal1: '',
      specKey2: 'Heart Notes',
      specVal2: '',
      specKey3: 'Base Notes',
      specVal3: '',
      variant1Title: '50ml',
      variant1Sku: '',
      variant1Price: '',
      variant1Stock: '20',
      variant2Title: '100ml',
      variant2Sku: '',
      variant2Price: '',
      variant2Stock: '10',
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (p) => {
    setEditingId(p._id);
    const specs = p.specifications ? Object.entries(p.specifications) : [];
    setFormData({
      name: p.name,
      slug: p.slug,
      category: p.category?._id || p.category || '',
      subCategory: p.subCategory?._id || p.subCategory || '',
      brand: p.brand || 'Jayrup Special',
      shortDescription: p.shortDescription || '',
      description: p.description || '',
      price: p.price,
      salePrice: p.salePrice || '',
      sku: p.sku,
      stock: p.stock,
      imageUrl: p.images?.[0]?.url || '',
      featured: p.featured,
      status: p.status,
      specKey1: specs[0]?.[0] || 'Specification 1',
      specVal1: specs[0]?.[1] || '',
      specKey2: specs[1]?.[0] || 'Specification 2',
      specVal2: specs[1]?.[1] || '',
      specKey3: specs[2]?.[0] || 'Specification 3',
      specVal3: specs[2]?.[1] || '',
      variant1Title: p.variants?.[0]?.title || '50ml',
      variant1Sku: p.variants?.[0]?.sku || '',
      variant1Price: p.variants?.[0]?.price || '',
      variant1Stock: p.variants?.[0]?.stock || '',
      variant2Title: p.variants?.[1]?.title || '100ml',
      variant2Sku: p.variants?.[1]?.sku || '',
      variant2Price: p.variants?.[1]?.price || '',
      variant2Stock: p.variants?.[1]?.stock || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Build specifications map
      const specifications = {};
      if (formData.specKey1 && formData.specVal1) specifications[formData.specKey1] = formData.specVal1;
      if (formData.specKey2 && formData.specVal2) specifications[formData.specKey2] = formData.specVal2;
      if (formData.specKey3 && formData.specVal3) specifications[formData.specKey3] = formData.specVal3;

      // Build variants
      const variants = [];
      if (formData.variant1Title && formData.variant1Price) {
        variants.push({
          title: formData.variant1Title,
          sku: formData.variant1Sku || `${formData.sku}-V1`,
          price: Number(formData.variant1Price),
          stock: Number(formData.variant1Stock || 0),
        });
      }
      if (formData.variant2Title && formData.variant2Price) {
        variants.push({
          title: formData.variant2Title,
          sku: formData.variant2Sku || `${formData.sku}-V2`,
          price: Number(formData.variant2Price),
          stock: Number(formData.variant2Stock || 0),
        });
      }

      const payload = {
        name: formData.name,
        slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
        category: formData.category,
        subCategory: formData.subCategory || undefined,
        brand: formData.brand,
        shortDescription: formData.shortDescription,
        description: formData.description,
        price: Number(formData.price),
        salePrice: formData.salePrice ? Number(formData.salePrice) : null,
        sku: formData.sku,
        stock: Number(formData.stock),
        images: formData.imageUrl ? [{ url: formData.imageUrl, isPrimary: true }] : [],
        variants,
        specifications,
        featured: formData.featured,
        status: formData.status,
      };

      if (editingId) {
        await adminService.updateProduct(editingId, payload);
      } else {
        await adminService.createProduct(payload);
      }

      setShowModal(false);
      loadData();
    } catch (err) {
      alert(`Operation failed: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Archive this product? (It will be hidden from the public catalog)')) {
      try {
        await adminService.deleteProduct(id);
        loadData();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl uppercase tracking-wider text-zinc-100 font-bold">
            Products & Variant Matrix
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Manage luxury perfumes, skincare, soaps, and future generic categories
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="btn-gold py-2.5 px-4 text-xs flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-4 bg-noir-card border border-gold/20 flex gap-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter by product name, SKU, or tags..."
          className="flex-1 bg-noir border border-zinc-800 p-2.5 text-xs text-zinc-100 focus:outline-none focus:border-gold"
        />
      </div>

      {/* Table */}
      <div className="bg-noir-card border border-gold/20 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-zinc-800 text-[10px] uppercase tracking-wider text-zinc-400">
            <tr>
              <th className="py-3 px-4">Product</th>
              <th className="py-3 px-4">SKU</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Base Price</th>
              <th className="py-3 px-4">Stock</th>
              <th className="py-3 px-4">Variants</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {products.map((p) => (
              <tr key={p._id} className="hover:bg-white/5 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={p.images?.[0]?.url || 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=100'}
                      alt=""
                      className="w-10 h-10 object-cover border border-zinc-800 flex-shrink-0"
                    />
                    <div>
                      <p className="font-semibold text-zinc-200">{p.name}</p>
                      <p className="text-[10px] text-zinc-500">{p.brand}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 font-mono text-zinc-400">{p.sku}</td>
                <td className="py-3 px-4 text-gold/80">{p.category?.name || 'General'}</td>
                <td className="py-3 px-4 font-bold text-zinc-200">
                  ₹{p.price} {p.salePrice && <span className="text-[10px] text-zinc-500 line-through">₹{p.salePrice}</span>}
                </td>
                <td className="py-3 px-4">
                  <span className={`font-bold ${p.stock <= 5 ? 'text-red-400' : 'text-emerald-400'}`}>
                    {p.stock}
                  </span>
                </td>
                <td className="py-3 px-4 text-zinc-400">
                  {p.variants?.length > 0 ? `${p.variants.length} options` : 'Standard'}
                </td>
                <td className="py-3 px-4">
                  <Badge variant={p.status === 'ACTIVE' ? 'gold' : 'noir'}>
                    {p.status}
                  </Badge>
                </td>
                <td className="py-3 px-4 text-right space-x-2">
                  <button
                    onClick={() => handleOpenEditModal(p)}
                    className="p-1 text-zinc-400 hover:text-gold"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4 inline" />
                  </button>
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="p-1 text-zinc-400 hover:text-red-400"
                    title="Archive"
                  >
                    <Trash2 className="w-4 h-4 inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Product Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-noir-card border border-gold/40 p-6 sm:p-8 max-w-3xl w-full my-8 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-serif text-lg text-gold uppercase tracking-wider font-semibold">
                {editingId ? 'Edit Product' : 'Create New Product'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-noir border border-zinc-800 p-2.5 text-zinc-100 focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1">Brand Name</label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full bg-noir border border-zinc-800 p-2.5 text-zinc-100 focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1">Category *</label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-noir border border-zinc-800 p-2.5 text-zinc-100 focus:outline-none focus:border-gold"
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1">SKU *</label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full bg-noir border border-zinc-800 p-2.5 text-zinc-100 focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1">Base Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-noir border border-zinc-800 p-2.5 text-zinc-100 focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1">Sale Price (₹)</label>
                  <input
                    type="number"
                    value={formData.salePrice}
                    onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                    className="w-full bg-noir border border-zinc-800 p-2.5 text-zinc-100 focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1">Total Stock *</label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full bg-noir border border-zinc-800 p-2.5 text-zinc-100 focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <ImageDropzone
                value={formData.imageUrl}
                onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                folder="products"
                label="Product Primary Flacon Photograph"
                hint="Drag & drop high-res bottle photo (PNG, JPG, WebP up to 10MB)"
              />

              <div>
                <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full bg-noir border border-zinc-800 p-2.5 text-zinc-100 focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1">Detailed Description (HTML supported)</label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-noir border border-zinc-800 p-2.5 text-zinc-100 focus:outline-none focus:border-gold"
                />
              </div>

              {/* Dynamic Specifications Editor */}
              <div className="p-3 bg-noir border border-zinc-800 space-y-2">
                <span className="font-serif text-[11px] uppercase tracking-wider text-gold font-semibold block">
                  Product Specifications / Fragrance Notes
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={formData.specKey1}
                    onChange={(e) => setFormData({ ...formData, specKey1: e.target.value })}
                    placeholder="Spec Name (e.g. Top Notes or Skin Type)"
                    className="bg-noir-card border border-zinc-850 p-2 text-zinc-100"
                  />
                  <input
                    type="text"
                    value={formData.specVal1}
                    onChange={(e) => setFormData({ ...formData, specVal1: e.target.value })}
                    placeholder="Value (e.g. Bergamot, Saffron or Acne Prone)"
                    className="bg-noir-card border border-zinc-850 p-2 text-zinc-100"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={formData.specKey2}
                    onChange={(e) => setFormData({ ...formData, specKey2: e.target.value })}
                    placeholder="Spec Name (e.g. Heart Notes or Botanicals)"
                    className="bg-noir-card border border-zinc-850 p-2 text-zinc-100"
                  />
                  <input
                    type="text"
                    value={formData.specVal2}
                    onChange={(e) => setFormData({ ...formData, specVal2: e.target.value })}
                    placeholder="Value"
                    className="bg-noir-card border border-zinc-850 p-2 text-zinc-100"
                  />
                </div>
              </div>

              {/* Variants Setup */}
              <div className="p-3 bg-noir border border-zinc-800 space-y-2">
                <span className="font-serif text-[11px] uppercase tracking-wider text-gold font-semibold block">
                  Configurable Variants (Sizes / Volumes)
                </span>
                <div className="grid grid-cols-4 gap-2">
                  <input
                    type="text"
                    value={formData.variant1Title}
                    onChange={(e) => setFormData({ ...formData, variant1Title: e.target.value })}
                    placeholder="Variant 1 (50ml)"
                    className="bg-noir-card border border-zinc-850 p-2 text-zinc-100"
                  />
                  <input
                    type="number"
                    value={formData.variant1Price}
                    onChange={(e) => setFormData({ ...formData, variant1Price: e.target.value })}
                    placeholder="Price (₹)"
                    className="bg-noir-card border border-zinc-850 p-2 text-zinc-100"
                  />
                  <input
                    type="text"
                    value={formData.variant2Title}
                    onChange={(e) => setFormData({ ...formData, variant2Title: e.target.value })}
                    placeholder="Variant 2 (100ml)"
                    className="bg-noir-card border border-zinc-850 p-2 text-zinc-100"
                  />
                  <input
                    type="number"
                    value={formData.variant2Price}
                    onChange={(e) => setFormData({ ...formData, variant2Price: e.target.value })}
                    placeholder="Price (₹)"
                    className="bg-noir-card border border-zinc-850 p-2 text-zinc-100"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="accent-gold w-4 h-4"
                  />
                  <span>Mark as Featured Creation</span>
                </label>

                <div className="flex items-center gap-2">
                  <span className="text-zinc-400">Status:</span>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="bg-noir border border-zinc-800 p-1.5 text-zinc-200"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="DRAFT">DRAFT</option>
                    <option value="ARCHIVED">ARCHIVED</option>
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
                  {editingId ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
