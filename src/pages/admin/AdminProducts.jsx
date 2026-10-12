import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Plus,
  Edit2,
  Archive,
  Search,
  X,
  Star,
  Trash2,
  ArrowUp,
  ArrowDown,
  Copy,
  ExternalLink,
  Loader2,
  Save,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { adminService } from '../../services/adminService.js';
import { ImageDropzone } from '../../components/common/ImageDropzone.jsx';
import { RichTextEditor } from '../../components/common/RichTextEditor.jsx';
import { SeoFormFields } from '../../components/admin/SeoFormFields.jsx';
import { Input, Select, Textarea, Alert } from '../../components/ui/Field.jsx';
import { Pill } from '../../components/ui/StatusBadge.jsx';

const SKIN_TYPES = ['All skin types', 'Oily', 'Combination', 'Normal', 'Dry', 'Sensitive', 'Acne-prone'];
const CONCERNS = ['Pimples', 'Acne marks', 'Dark spots', 'Oil control', 'Open pores', 'Dullness', 'Uneven tone', 'Long-lasting fragrance', 'Daily wear', 'Gifting'];
const GST_RATES = [0, 5, 12, 18, 28];
const HSN_PRESETS = [
  ['3304', 'Skin care / creams (3304)'],
  ['3303', 'Perfumes / EDP (3303)'],
  ['3401', 'Soaps (3401)'],
  ['3305', 'Hair care (3305)'],
  ['3307', 'Deodorants / shaving (3307)'],
];

const TABS = [
  ['basic', 'Basics'],
  ['media', 'Images & Video'],
  ['pricing', 'Price, Stock & GST'],
  ['content', 'Description'],
  ['details', 'Details & Legal'],
  ['faqs', 'FAQs'],
  ['seo', 'SEO'],
];

const slugify = (v = '') =>
  v
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .slice(0, 120);

const emptyProduct = (categoryId = '') => ({
  name: '',
  slug: '',
  category: categoryId,
  subCategory: '',
  brand: 'Jayrup',
  shortDescription: '',
  description: '',
  price: '',
  salePrice: '',
  sku: `JR-${Date.now().toString().slice(-5)}`,
  stock: 0,
  lowStockThreshold: 5,
  maxPerOrder: 10,
  hsnCode: '3304',
  gstRate: 18,
  images: [],
  videos: [],
  variants: [],
  specs: [],
  fragranceNotes: { topNotes: '', heartNotes: '', baseNotes: '' },
  highlights: [],
  benefits: '',
  ingredients: '',
  howToUse: '',
  precautions: '',
  skinTypes: [],
  concerns: [],
  gender: 'UNISEX',
  faqs: [],
  netQuantity: '',
  weight: '',
  dimensions: { length: '', width: '', height: '' },
  barcode: '',
  countryOfOrigin: 'India',
  shelfLife: '',
  manufacturerDetails: '',
  marketedBy: 'FITJAYESH (Jayrup), G-28, Metropolis Complex, Gambhoi–Bhiloda Road, Gambhoi, Himatnagar, Sabarkantha, Gujarat – 383030',
  packerDetails: '',
  importerDetails: '',
  licenseNumber: '',
  customerCareDetails: 'care@jayrup.in · +91 94081 33100',
  tags: '',
  featured: false,
  status: 'DRAFT',
  seo: { metaTitle: '', metaDescription: '', metaKeywords: '', focusKeyword: '', canonicalUrl: '', ogImage: '', searchIndexing: 'INDEX_FOLLOW' },
});

const fromProduct = (p) => {
  const specsObj = p.specifications ? (p.specifications instanceof Map ? Object.fromEntries(p.specifications) : p.specifications) : {};
  return {
    ...emptyProduct(),
    ...p,
    category: p.category?._id || p.category || '',
    subCategory: p.subCategory?._id || p.subCategory || '',
    salePrice: p.salePrice ?? '',
    gstRate: p.gstRate ?? 18,
    hsnCode: p.hsnCode || '3304',
    weight: p.weight ?? '',
    dimensions: { length: p.dimensions?.length ?? '', width: p.dimensions?.width ?? '', height: p.dimensions?.height ?? '' },
    specs: Object.entries(specsObj)
      .filter(([k]) => !['Top Notes', 'Heart Notes', 'Base Notes'].includes(k))
      .map(([key, value]) => ({ key, value })),
    fragranceNotes: { topNotes: p.fragranceNotes?.topNotes || '', heartNotes: p.fragranceNotes?.heartNotes || '', baseNotes: p.fragranceNotes?.baseNotes || '' },
    variants: (p.variants || []).map((v) => ({ ...v, salePrice: v.salePrice ?? '', weight: v.weight ?? '', barcode: v.barcode || '' })),
    tags: (p.tags || []).join(', '),
    highlights: p.highlights || [],
    faqs: p.faqs || [],
    seo: { ...emptyProduct().seo, ...(p.seo || {}) },
  };
};

const toPayload = (f) => ({
  name: f.name.trim(),
  slug: slugify(f.slug || f.name),
  category: f.category,
  subCategory: f.subCategory || '',
  brand: f.brand,
  shortDescription: f.shortDescription,
  description: f.description,
  price: Number(f.price),
  salePrice: f.salePrice === '' ? null : Number(f.salePrice),
  sku: f.sku.trim(),
  stock: f.variants.length ? f.variants.reduce((s, v) => s + Number(v.stock || 0), 0) : Number(f.stock || 0),
  lowStockThreshold: Number(f.lowStockThreshold || 0),
  maxPerOrder: Number(f.maxPerOrder || 10),
  hsnCode: f.hsnCode,
  gstRate: Number(f.gstRate),
  images: f.images.filter((i) => i.url),
  videos: f.videos.filter((v) => v.url),
  variants: f.variants.map((v) => ({
    ...v,
    price: Number(v.price),
    salePrice: v.salePrice === '' ? null : Number(v.salePrice),
    stock: Number(v.stock || 0),
    weight: v.weight === '' ? null : Number(v.weight),
  })),
  specifications: Object.fromEntries(f.specs.filter((s) => s.key && s.value).map((s) => [s.key.trim(), s.value.trim()])),
  fragranceNotes: f.fragranceNotes,
  highlights: f.highlights.filter(Boolean),
  benefits: f.benefits,
  ingredients: f.ingredients,
  howToUse: f.howToUse,
  precautions: f.precautions,
  skinTypes: f.skinTypes,
  concerns: f.concerns,
  gender: f.gender,
  faqs: f.faqs.filter((q) => q.question && q.answer),
  netQuantity: f.netQuantity,
  weight: f.weight === '' ? null : Number(f.weight),
  dimensions: {
    length: f.dimensions.length === '' ? null : Number(f.dimensions.length),
    width: f.dimensions.width === '' ? null : Number(f.dimensions.width),
    height: f.dimensions.height === '' ? null : Number(f.dimensions.height),
  },
  barcode: f.barcode,
  countryOfOrigin: f.countryOfOrigin,
  shelfLife: f.shelfLife,
  manufacturerDetails: f.manufacturerDetails,
  marketedBy: f.marketedBy,
  packerDetails: f.packerDetails,
  importerDetails: f.importerDetails,
  licenseNumber: f.licenseNumber,
  customerCareDetails: f.customerCareDetails,
  tags: String(f.tags || '')
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean),
  featured: Boolean(f.featured),
  status: f.status,
  seo: f.seo,
});

const ChipToggle = ({ options, value = [], onChange }) => (
  <div className="flex flex-wrap gap-2">
    {options.map((o) => {
      const on = value.includes(o);
      return (
        <button
          key={o}
          type="button"
          onClick={() => onChange(on ? value.filter((v) => v !== o) : [...value, o])}
          className={`px-3 py-1.5 rounded-full text-xs border ${on ? 'bg-gold/15 border-gold text-gold' : 'border-zinc-800 text-zinc-400 hover:border-zinc-600'}`}
        >
          {o}
        </button>
      );
    })}
  </div>
);

export const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1 });
  const [editing, setEditing] = useState(null); // { id, form }
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [prodRes, cats] = await Promise.all([
        adminService.getProducts({ search: search || undefined, status: statusFilter || undefined, page, limit: 25 }),
        categories.length ? Promise.resolve(categories) : adminService.getCategories(),
      ]);
      setProducts(prodRes?.data || []);
      setMeta({ total: prodRes?.total || 0, totalPages: prodRes?.totalPages || 1 });
      if (Array.isArray(cats)) setCategories(cats);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, statusFilter, page]);

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [load]);

  const openNew = () => setEditing({ id: null, form: emptyProduct(categories[0]?._id || '') });
  const openEdit = async (p) => {
    try {
      const full = await adminService.getProduct(p._id);
      setEditing({ id: p._id, form: fromProduct(full) });
    } catch (err) {
      setError(err.message);
    }
  };
  const duplicate = async (p) => {
    const full = await adminService.getProduct(p._id);
    const f = fromProduct(full);
    setEditing({
      id: null,
      form: { ...f, _id: undefined, name: `${f.name} (Copy)`, slug: '', sku: `${f.sku}-COPY`, status: 'DRAFT', variants: f.variants.map((v) => ({ ...v, _id: undefined, sku: `${v.sku}-COPY` })) },
    });
  };

  const archive = async (p) => {
    if (!window.confirm(`Archive “${p.name}”? It will be hidden from the store (orders history is kept).`)) return;
    await adminService.deleteProduct(p._id);
    load();
  };

  const toggleFeatured = async (p) => {
    await adminService.updateProduct(p._id, { featured: !p.featured });
    setProducts((prev) => prev.map((x) => (x._id === p._id ? { ...x, featured: !p.featured } : x)));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl uppercase tracking-wider text-zinc-100 font-bold">Products</h1>
          <p className="text-xs text-zinc-400 mt-1">Catalogue, variants, GST/HSN, rich descriptions, FAQs and SEO.</p>
        </div>
        <button onClick={openNew} className="btn-gold rounded-lg">
          <Plus className="w-4 h-4 mr-2" /> Add product
        </button>
      </div>

      <div className="bg-noir-card border border-zinc-800 rounded-xl p-3 flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search name, SKU or tag…" className="w-full bg-noir border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-gold" />
        </div>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="bg-noir border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200">
          <option value="">Active + Drafts</option>
          <option value="ACTIVE">Active</option>
          <option value="DRAFT">Drafts</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </div>

      {error && <Alert>{error}</Alert>}

      <div className="bg-noir-card border border-zinc-800 rounded-xl overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-zinc-800 text-[10px] uppercase tracking-wider text-zinc-400">
            <tr>
              <th className="py-3 px-4">Product</th>
              <th className="py-3 px-4">SKU</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4">Stock</th>
              <th className="py-3 px-4">GST</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {loading && <tr><td colSpan={7} className="py-10 text-center"><Loader2 className="w-5 h-5 animate-spin text-gold inline" /></td></tr>}
            {!loading && products.length === 0 && <tr><td colSpan={7} className="py-10 text-center text-zinc-500">No products found.</td></tr>}
            {!loading &&
              products.map((p) => {
                const sell = p.salePrice && p.salePrice < p.price ? p.salePrice : p.price;
                return (
                  <tr key={p._id} className="hover:bg-white/[0.03]">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {p.images?.[0]?.url ? <img src={p.images[0].url} alt="" className="w-11 h-11 rounded-lg object-cover border border-zinc-800" /> : <div className="w-11 h-11 rounded-lg bg-zinc-900 border border-zinc-800" />}
                        <div className="min-w-0">
                          <button onClick={() => openEdit(p)} className="font-semibold text-zinc-100 hover:text-gold text-left line-clamp-1">{p.name}</button>
                          <p className="text-[10px] text-zinc-500">{p.category?.name || '—'} · {p.variants?.length ? `${p.variants.length} variants` : 'single'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-zinc-400">{p.sku}</td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-zinc-100">₹{sell}</span>
                      {sell < p.price && <span className="ml-1 text-[10px] text-zinc-500 line-through">₹{p.price}</span>}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`font-bold ${p.stock <= (p.lowStockThreshold ?? 5) ? 'text-red-400' : 'text-emerald-400'}`}>{p.stock}</span>
                      {p.totalSold > 0 && <span className="block text-[10px] text-zinc-500">{p.totalSold} sold</span>}
                    </td>
                    <td className="py-3 px-4 text-zinc-400">{p.gstRate ?? 18}% · {p.hsnCode || '—'}</td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col gap-1 items-start">
                        <Pill tone={p.status === 'ACTIVE' ? 'emerald' : p.status === 'DRAFT' ? 'amber' : 'noir'}>{p.status}</Pill>
                        <button onClick={() => toggleFeatured(p)} className={`inline-flex items-center gap-1 text-[10px] ${p.featured ? 'text-gold' : 'text-zinc-600 hover:text-zinc-300'}`}>
                          <Star className={`w-3 h-3 ${p.featured ? 'fill-gold' : ''}`} /> {p.featured ? 'Featured' : 'Feature'}
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <a href={`/products/${p.slug}`} target="_blank" rel="noopener noreferrer" className="p-1.5 text-zinc-500 hover:text-gold inline-block" title="View on store"><ExternalLink className="w-4 h-4" /></a>
                      <button onClick={() => duplicate(p)} className="p-1.5 text-zinc-500 hover:text-gold" title="Duplicate"><Copy className="w-4 h-4" /></button>
                      <button onClick={() => openEdit(p)} className="p-1.5 text-zinc-500 hover:text-gold" title="Edit"><Edit2 className="w-4 h-4" /></button>
                      {p.status !== 'ARCHIVED' && <button onClick={() => archive(p)} className="p-1.5 text-zinc-500 hover:text-red-400" title="Archive"><Archive className="w-4 h-4" /></button>}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {meta.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((n) => (
            <button key={n} onClick={() => setPage(n)} className={`w-8 h-8 rounded-lg text-xs ${n === page ? 'bg-gold text-black font-bold' : 'border border-zinc-800 text-zinc-400'}`}>{n}</button>
          ))}
        </div>
      )}

      {editing && (
        <ProductEditor
          id={editing.id}
          initial={editing.form}
          categories={categories}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            load();
          }}
        />
      )}
    </div>
  );
};

const ProductEditor = ({ id, initial, categories, onClose, onSaved }) => {
  const [f, setF] = useState(initial);
  const [tab, setTab] = useState('basic');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [slugTouched, setSlugTouched] = useState(Boolean(id));

  const set = (patch) => setF((prev) => ({ ...prev, ...patch }));
  const parents = categories.filter((c) => !c.parent);
  const subs = categories.filter((c) => (c.parent?._id || c.parent) === f.category);

  const checks = useMemo(() => {
    const plain = (f.description || '').replace(/<[^>]+>/g, ' ').trim();
    return [
      [f.name.length >= 10, 'Descriptive product name (10+ chars)'],
      [f.images.length >= 3, 'At least 3 images'],
      [f.images.every((i) => i.altText), 'Alt text on every image'],
      [(f.shortDescription || '').length >= 80, 'Short description 80+ chars'],
      [plain.split(/\s+/).filter(Boolean).length >= 250, 'Long description 250+ words'],
      [f.highlights.length >= 3, '3+ key highlights'],
      [f.faqs.length >= 3, '3+ FAQs (rich results)'],
      [Boolean(f.seo.focusKeyword), 'Focus keyword set'],
      [f.seo.focusKeyword && f.name.toLowerCase().includes(f.seo.focusKeyword.toLowerCase()), 'Focus keyword in name'],
      [Boolean(f.netQuantity), 'Net quantity (legal metrology)'],
      [Boolean(f.manufacturerDetails), 'Manufacturer details (legal metrology)'],
      [Boolean(f.barcode), 'GTIN / barcode (Google Shopping)'],
    ];
  }, [f]);
  const score = Math.round((checks.filter(([ok]) => ok).length / checks.length) * 100);

  const save = async (status) => {
    setError(null);
    const payload = toPayload({ ...f, status: status || f.status });
    if (!payload.name || !payload.sku || !payload.category || !payload.price || !payload.description) {
      setError('Name, SKU, category, MRP and long description are required.');
      setTab(!payload.description ? 'content' : !payload.price ? 'pricing' : 'basic');
      return;
    }
    if (payload.salePrice !== null && payload.salePrice >= payload.price) {
      setError('Selling price must be lower than MRP (leave it empty if there is no discount).');
      setTab('pricing');
      return;
    }
    try {
      setSaving(true);
      if (id) await adminService.updateProduct(id, payload);
      else await adminService.createProduct(payload);
      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const moveImage = (i, d) => {
    const imgs = [...f.images];
    const j = i + d;
    if (j < 0 || j >= imgs.length) return;
    [imgs[i], imgs[j]] = [imgs[j], imgs[i]];
    set({ images: imgs });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm overflow-y-auto" role="dialog" aria-modal="true">
      <div className="max-w-6xl mx-auto my-6 bg-noir border border-gold/30 rounded-2xl shadow-2xl">
        <div className="sticky top-0 z-20 bg-noir/95 backdrop-blur rounded-t-2xl border-b border-zinc-800 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-serif text-lg uppercase tracking-wider text-gold">{id ? 'Edit product' : 'New product'}</h2>
            <p className="text-[11px] text-zinc-500">{f.name || 'Untitled'} · <span className={score >= 80 ? 'text-emerald-300' : score >= 50 ? 'text-amber-300' : 'text-red-300'}>SEO & completeness {score}%</span></p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="px-4 py-2 rounded-lg border border-zinc-700 text-xs text-zinc-300">Cancel</button>
            <button onClick={() => save('DRAFT')} disabled={saving} className="btn-outline-gold rounded-lg !py-2">Save draft</button>
            <button onClick={() => save('ACTIVE')} disabled={saving} className="btn-gold rounded-lg !py-2">
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />} {f.status === 'ACTIVE' || !id ? 'Publish' : 'Save & publish'}
            </button>
            <button onClick={onClose} aria-label="Close" className="p-2 text-zinc-400 hover:text-white"><X className="w-5 h-5" /></button>
          </div>
          <nav className="w-full flex gap-1 overflow-x-auto -mb-4 pt-2">
            {TABS.map(([k, l]) => (
              <button key={k} onClick={() => setTab(k)} className={`px-4 py-2 text-xs whitespace-nowrap border-b-2 ${tab === k ? 'border-gold text-gold' : 'border-transparent text-zinc-500 hover:text-zinc-200'}`}>{l}</button>
            ))}
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-6 p-6">
          <div className="space-y-5 min-w-0">
            {error && <Alert>{error}</Alert>}

            {tab === 'basic' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input className="md:col-span-2" label="Product name" required value={f.name} onChange={(e) => set({ name: e.target.value, ...(slugTouched ? {} : { slug: slugify(e.target.value) }) })} placeholder="e.g. Jayrup Pimples Cream – Ayurvedic Anti-Acne Cream 15 g" />
                  <Input label="URL slug" hint={`/products/${f.slug || slugify(f.name) || '…'}`} value={f.slug} onChange={(e) => { setSlugTouched(true); set({ slug: slugify(e.target.value) }); }} />
                  <Input label="Brand" value={f.brand} onChange={(e) => set({ brand: e.target.value })} />
                  <Select label="Category" required value={f.category} onChange={(e) => set({ category: e.target.value, subCategory: '' })}>
                    <option value="">Select…</option>
                    {parents.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </Select>
                  <Select label="Sub-category" value={f.subCategory} onChange={(e) => set({ subCategory: e.target.value })}>
                    <option value="">None</option>
                    {subs.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </Select>
                </div>
                <Textarea label="Short description" hint={`${(f.shortDescription || '').length}/500 · shown near the price`} rows={3} maxLength={500} value={f.shortDescription} onChange={(e) => set({ shortDescription: e.target.value })} />
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-zinc-400 mb-1.5">Key highlights <span className="normal-case text-zinc-500">(bullets above the fold – e.g. “Reduces pimples in 7 days”)</span></p>
                  <div className="space-y-2">
                    {f.highlights.map((h, i) => (
                      <div key={i} className="flex gap-2">
                        <input value={h} maxLength={200} onChange={(e) => set({ highlights: f.highlights.map((x, j) => (j === i ? e.target.value : x)) })} className="flex-1 bg-noir border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-gold" />
                        <button type="button" onClick={() => set({ highlights: f.highlights.filter((_, j) => j !== i) })} className="p-2 text-zinc-500 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    ))}
                    {f.highlights.length < 12 && <button type="button" onClick={() => set({ highlights: [...f.highlights, ''] })} className="text-xs text-gold inline-flex items-center gap-1"><Plus className="w-3.5 h-3.5" />Add highlight</button>}
                  </div>
                </div>
                <Input label="Search tags" hint="comma separated" value={f.tags} onChange={(e) => set({ tags: e.target.value })} placeholder="pimple cream, acne, ayurvedic, oily skin" />
                <div className="flex flex-wrap gap-6">
                  <Select label="Status" value={f.status} onChange={(e) => set({ status: e.target.value })}>
                    <option value="ACTIVE">Active (visible)</option>
                    <option value="DRAFT">Draft (hidden)</option>
                    <option value="ARCHIVED">Archived</option>
                  </Select>
                  <label className="flex items-center gap-2 text-sm text-zinc-300 mt-6">
                    <input type="checkbox" className="accent-[#D4AF37]" checked={f.featured} onChange={(e) => set({ featured: e.target.checked })} /> Feature on homepage
                  </label>
                </div>
              </>
            )}

            {tab === 'media' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {f.images.map((img, i) => (
                    <div key={`${img.url}-${i}`} className="border border-zinc-800 rounded-xl overflow-hidden bg-noir-card">
                      <div className="relative aspect-square bg-black">
                        <img src={img.url} alt={img.altText} className="w-full h-full object-cover" />
                        {i === 0 && <span className="absolute top-2 left-2 text-[10px] bg-gold text-black font-bold px-2 py-0.5 rounded-full">PRIMARY</span>}
                      </div>
                      <div className="p-2 space-y-2">
                        <input value={img.altText} onChange={(e) => set({ images: f.images.map((x, j) => (j === i ? { ...x, altText: e.target.value } : x)) })} placeholder="Alt text (SEO)" className="w-full bg-noir border border-zinc-800 rounded-md px-2 py-1.5 text-xs text-zinc-100" />
                        <div className="flex justify-between">
                          <div className="flex gap-1">
                            <button type="button" onClick={() => moveImage(i, -1)} className="p-1 text-zinc-500 hover:text-gold" aria-label="Move left"><ArrowUp className="w-3.5 h-3.5 -rotate-90" /></button>
                            <button type="button" onClick={() => moveImage(i, 1)} className="p-1 text-zinc-500 hover:text-gold" aria-label="Move right"><ArrowDown className="w-3.5 h-3.5 -rotate-90" /></button>
                          </div>
                          <button type="button" onClick={() => set({ images: f.images.filter((_, j) => j !== i) })} className="p-1 text-zinc-500 hover:text-red-400" aria-label="Remove"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {f.images.length < 12 && (
                  <ImageDropzone
                    value=""
                    folder="products"
                    label="Add image"
                    hint="1:1 square, min 1000×1000 px, white or dark studio background · PNG/JPG/WebP"
                    onChange={(url, publicId) => url && set({ images: [...f.images, { url, publicId, altText: `${f.name}${f.images.length ? ` – view ${f.images.length + 1}` : ''}` }] })}
                  />
                )}
                <div className="pt-4 border-t border-zinc-800 space-y-2">
                  <p className="text-[11px] uppercase tracking-wider text-zinc-400">Product videos (YouTube or MP4 URLs)</p>
                  {f.videos.map((v, i) => (
                    <div key={i} className="flex gap-2">
                      <input value={v.url} onChange={(e) => set({ videos: f.videos.map((x, j) => (j === i ? { ...x, url: e.target.value } : x)) })} placeholder="https://…" className="flex-1 bg-noir border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100" />
                      <input value={v.title} onChange={(e) => set({ videos: f.videos.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)) })} placeholder="Title" className="w-48 bg-noir border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100" />
                      <button type="button" onClick={() => set({ videos: f.videos.filter((_, j) => j !== i) })} className="p-2 text-zinc-500 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                  <button type="button" onClick={() => set({ videos: [...f.videos, { url: '', title: '' }] })} className="text-xs text-gold inline-flex items-center gap-1"><Plus className="w-3.5 h-3.5" />Add video</button>
                </div>
              </>
            )}

            {tab === 'pricing' && (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Input label="MRP (₹, incl. GST)" required type="number" min="0" step="0.01" value={f.price} onChange={(e) => set({ price: e.target.value })} />
                  <Input label="Selling price (₹)" hint="optional" type="number" min="0" step="0.01" value={f.salePrice} onChange={(e) => set({ salePrice: e.target.value })} />
                  <Input label="SKU" required value={f.sku} onChange={(e) => set({ sku: e.target.value.toUpperCase() })} />
                  <Input label={f.variants.length ? 'Stock (sum of variants)' : 'Stock'} type="number" min="0" disabled={f.variants.length > 0} value={f.variants.length ? f.variants.reduce((s, v) => s + Number(v.stock || 0), 0) : f.stock} onChange={(e) => set({ stock: e.target.value })} />
                  <Input label="Low-stock alert at" type="number" min="0" value={f.lowStockThreshold} onChange={(e) => set({ lowStockThreshold: e.target.value })} />
                  <Input label="Max qty per order" type="number" min="1" value={f.maxPerOrder} onChange={(e) => set({ maxPerOrder: e.target.value })} />
                  <Select label="HSN code" value={HSN_PRESETS.some(([c]) => c === f.hsnCode) ? f.hsnCode : 'custom'} onChange={(e) => e.target.value !== 'custom' && set({ hsnCode: e.target.value })}>
                    {HSN_PRESETS.map(([c, l]) => <option key={c} value={c}>{l}</option>)}
                    <option value="custom">Custom…</option>
                  </Select>
                  <Input label="HSN (custom)" value={f.hsnCode} onChange={(e) => set({ hsnCode: e.target.value.replace(/\D/g, '').slice(0, 8) })} />
                  <Select label="GST rate" value={f.gstRate} onChange={(e) => set({ gstRate: Number(e.target.value) })}>
                    {GST_RATES.map((r) => <option key={r} value={r}>{r}%</option>)}
                  </Select>
                </div>
                {Number(f.price) > 0 && (
                  <p className="text-xs text-zinc-500">
                    Customer pays ₹{f.salePrice || f.price}
                    {f.salePrice && Number(f.salePrice) < Number(f.price) ? ` (${Math.round((1 - f.salePrice / f.price) * 100)}% off)` : ''} · taxable value ₹
                    {((Number(f.salePrice || f.price) || 0) / (1 + f.gstRate / 100)).toFixed(2)} + GST ₹
                    {((Number(f.salePrice || f.price) || 0) - (Number(f.salePrice || f.price) || 0) / (1 + f.gstRate / 100)).toFixed(2)}
                  </p>
                )}

                <div className="pt-5 border-t border-zinc-800">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[11px] uppercase tracking-wider text-zinc-400">Variants (sizes / packs)</p>
                    <button type="button" onClick={() => set({ variants: [...f.variants, { title: '', sku: `${f.sku}-${f.variants.length + 1}`, price: f.price, salePrice: f.salePrice, stock: 0, weight: '', barcode: '' }] })} className="text-xs text-gold inline-flex items-center gap-1">
                      <Plus className="w-3.5 h-3.5" /> Add variant
                    </button>
                  </div>
                  {f.variants.length === 0 ? (
                    <p className="text-xs text-zinc-500">No variants – the product is sold as a single item using the price & stock above.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead className="text-[10px] uppercase text-zinc-500">
                          <tr>
                            {['Title', 'SKU', 'MRP', 'Sale price', 'Stock', 'Weight (g)', 'Barcode', ''].map((h) => <th key={h} className="text-left py-1.5 pr-2 font-medium">{h}</th>)}
                          </tr>
                        </thead>
                        <tbody>
                          {f.variants.map((v, i) => {
                            const upd = (patch) => set({ variants: f.variants.map((x, j) => (j === i ? { ...x, ...patch } : x)) });
                            const cls = 'w-full bg-noir border border-zinc-800 rounded-md px-2 py-1.5 text-xs text-zinc-100';
                            return (
                              <tr key={i}>
                                <td className="pr-2 py-1"><input className={cls} value={v.title} onChange={(e) => upd({ title: e.target.value })} placeholder="15 g" /></td>
                                <td className="pr-2 py-1"><input className={`${cls} font-mono`} value={v.sku} onChange={(e) => upd({ sku: e.target.value.toUpperCase() })} /></td>
                                <td className="pr-2 py-1 w-24"><input className={cls} type="number" value={v.price} onChange={(e) => upd({ price: e.target.value })} /></td>
                                <td className="pr-2 py-1 w-24"><input className={cls} type="number" value={v.salePrice} onChange={(e) => upd({ salePrice: e.target.value })} /></td>
                                <td className="pr-2 py-1 w-20"><input className={cls} type="number" value={v.stock} onChange={(e) => upd({ stock: e.target.value })} /></td>
                                <td className="pr-2 py-1 w-20"><input className={cls} type="number" value={v.weight} onChange={(e) => upd({ weight: e.target.value })} /></td>
                                <td className="pr-2 py-1"><input className={cls} value={v.barcode} onChange={(e) => upd({ barcode: e.target.value.replace(/\D/g, '') })} /></td>
                                <td className="py-1"><button type="button" onClick={() => set({ variants: f.variants.filter((_, j) => j !== i) })} className="p-1.5 text-zinc-500 hover:text-red-400"><Trash2 className="w-4 h-4" /></button></td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            )}

            {tab === 'content' && (
              <>
                <RichTextEditor label="Long description" required value={f.description} onChange={(v) => set({ description: v })} minHeight="380px" uploadFolder="products" />
                <RichTextEditor label="Key benefits" value={f.benefits} onChange={(v) => set({ benefits: v })} minHeight="160px" uploadFolder="products" placeholder="Bullet the main benefits… type / for blocks" />
                <RichTextEditor label="Ingredients" value={f.ingredients} onChange={(v) => set({ ingredients: v })} minHeight="140px" uploadFolder="products" placeholder="Full ingredient list (INCI) and hero ingredients" />
                <RichTextEditor label="How to use" value={f.howToUse} onChange={(v) => set({ howToUse: v })} minHeight="140px" uploadFolder="products" placeholder="Step-by-step usage – try “/” → Numbered list" />
                <RichTextEditor label="Precautions & safety" value={f.precautions} onChange={(v) => set({ precautions: v })} minHeight="120px" uploadFolder="products" placeholder="For external use only. Patch test before use…" />
              </>
            )}

            {tab === 'details' && (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Input label="Net quantity" placeholder="15 g / 50 ml" value={f.netQuantity} onChange={(e) => set({ netQuantity: e.target.value })} />
                  <Input label="Shipping weight (g)" type="number" value={f.weight} onChange={(e) => set({ weight: e.target.value })} />
                  <Input label="Barcode / GTIN (EAN-13)" value={f.barcode} onChange={(e) => set({ barcode: e.target.value.replace(/\D/g, '').slice(0, 14) })} />
                  <Input label="Country of origin" value={f.countryOfOrigin} onChange={(e) => set({ countryOfOrigin: e.target.value })} />
                  <Input label="Length (cm)" type="number" value={f.dimensions.length} onChange={(e) => set({ dimensions: { ...f.dimensions, length: e.target.value } })} />
                  <Input label="Width (cm)" type="number" value={f.dimensions.width} onChange={(e) => set({ dimensions: { ...f.dimensions, width: e.target.value } })} />
                  <Input label="Height (cm)" type="number" value={f.dimensions.height} onChange={(e) => set({ dimensions: { ...f.dimensions, height: e.target.value } })} />
                  <Input label="Shelf life" placeholder="24 months from mfg." value={f.shelfLife} onChange={(e) => set({ shelfLife: e.target.value })} />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-zinc-400 mb-2">Suitable skin types</p>
                  <ChipToggle options={SKIN_TYPES} value={f.skinTypes} onChange={(v) => set({ skinTypes: v })} />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-zinc-400 mb-2">Concerns addressed</p>
                  <ChipToggle options={CONCERNS} value={f.concerns} onChange={(v) => set({ concerns: v })} />
                </div>
                <Select label="For" value={f.gender} onChange={(e) => set({ gender: e.target.value })} className="max-w-xs">
                  <option value="UNISEX">Everyone (unisex)</option>
                  <option value="WOMEN">Women</option>
                  <option value="MEN">Men</option>
                </Select>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Textarea label="Manufactured by (name & address)" rows={2} value={f.manufacturerDetails} onChange={(e) => set({ manufacturerDetails: e.target.value })} />
                  <Textarea label="Marketed by" rows={2} value={f.marketedBy} onChange={(e) => set({ marketedBy: e.target.value })} />
                  <Textarea label="Packed by" rows={2} value={f.packerDetails} onChange={(e) => set({ packerDetails: e.target.value })} />
                  <Textarea label="Imported by (if imported)" rows={2} value={f.importerDetails} onChange={(e) => set({ importerDetails: e.target.value })} />
                  <Input label="Cosmetic manufacturing licence no." value={f.licenseNumber} onChange={(e) => set({ licenseNumber: e.target.value })} />
                  <Input label="Customer care" value={f.customerCareDetails} onChange={(e) => set({ customerCareDetails: e.target.value })} />
                </div>

                <div className="pt-4 border-t border-zinc-800">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[11px] uppercase tracking-wider text-zinc-400">Specifications table</p>
                    <button type="button" onClick={() => set({ specs: [...f.specs, { key: '', value: '' }] })} className="text-xs text-gold inline-flex items-center gap-1"><Plus className="w-3.5 h-3.5" />Add row</button>
                  </div>
                  <div className="space-y-2">
                    {f.specs.map((s, i) => (
                      <div key={i} className="grid grid-cols-[1fr_2fr_auto] gap-2">
                        <input value={s.key} onChange={(e) => set({ specs: f.specs.map((x, j) => (j === i ? { ...x, key: e.target.value } : x)) })} placeholder="Texture" className="bg-noir border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100" />
                        <input value={s.value} onChange={(e) => set({ specs: f.specs.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)) })} placeholder="Light, non-greasy cream" className="bg-noir border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100" />
                        <button type="button" onClick={() => set({ specs: f.specs.filter((_, j) => j !== i) })} className="p-2 text-zinc-500 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-800">
                  <p className="text-[11px] uppercase tracking-wider text-zinc-400 mb-2">Fragrance notes (perfumes only)</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Input label="Top notes" value={f.fragranceNotes.topNotes} onChange={(e) => set({ fragranceNotes: { ...f.fragranceNotes, topNotes: e.target.value } })} />
                    <Input label="Heart notes" value={f.fragranceNotes.heartNotes} onChange={(e) => set({ fragranceNotes: { ...f.fragranceNotes, heartNotes: e.target.value } })} />
                    <Input label="Base notes" value={f.fragranceNotes.baseNotes} onChange={(e) => set({ fragranceNotes: { ...f.fragranceNotes, baseNotes: e.target.value } })} />
                  </div>
                </div>
              </>
            )}

            {tab === 'faqs' && (
              <>
                <p className="text-xs text-zinc-500">FAQs appear on the product page and are published as FAQ structured data – they help win more space on Google and answer buyer doubts.</p>
                {f.faqs.map((q, i) => (
                  <div key={i} className="border border-zinc-800 rounded-xl p-4 space-y-2">
                    <div className="flex gap-2">
                      <input value={q.question} onChange={(e) => set({ faqs: f.faqs.map((x, j) => (j === i ? { ...x, question: e.target.value } : x)) })} placeholder="Question – e.g. How many days to see results?" className="flex-1 bg-noir border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 font-medium" />
                      <button type="button" onClick={() => set({ faqs: f.faqs.filter((_, j) => j !== i) })} className="p-2 text-zinc-500 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    <textarea value={q.answer} rows={3} onChange={(e) => set({ faqs: f.faqs.map((x, j) => (j === i ? { ...x, answer: e.target.value } : x)) })} placeholder="Answer" className="w-full bg-noir border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-300" />
                  </div>
                ))}
                <button type="button" onClick={() => set({ faqs: [...f.faqs, { question: '', answer: '' }] })} className="btn-outline-gold rounded-lg !py-2"><Plus className="w-4 h-4 mr-1" /> Add FAQ</button>
              </>
            )}

            {tab === 'seo' && (
              <SeoFormFields
                seoData={f.seo}
                onChange={(seo) => set({ seo })}
                fallbackTitle={f.name}
                fallbackDescription={f.shortDescription || f.description}
                fallbackSlug={f.slug || f.name}
                fallbackImage={f.images[0]?.url}
                itemType="products"
                showImageAlt={false}
              />
            )}
          </div>

          <aside className="space-y-4 lg:sticky lg:top-40 h-fit">
            <div className="border border-zinc-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] uppercase tracking-wider text-zinc-400">Listing quality</p>
                <span className={`text-sm font-bold ${score >= 80 ? 'text-emerald-300' : score >= 50 ? 'text-amber-300' : 'text-red-300'}`}>{score}%</span>
              </div>
              <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden mb-3">
                <div className={`h-full ${score >= 80 ? 'bg-emerald-400' : score >= 50 ? 'bg-amber-400' : 'bg-red-400'}`} style={{ width: `${score}%` }} />
              </div>
              <ul className="space-y-1.5">
                {checks.map(([ok, label]) => (
                  <li key={label} className={`flex items-start gap-2 text-[11px] ${ok ? 'text-zinc-400' : 'text-zinc-300'}`}>
                    {ok ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" /> : <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />}
                    {label}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
