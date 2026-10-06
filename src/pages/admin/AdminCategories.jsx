import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Layers, X } from "lucide-react";
import { adminService } from "../../services/adminService.js";
import { Badge } from "../../components/common/Badge.jsx";
import { ImageDropzone } from "../../components/common/ImageDropzone.jsx";
import { SeoFormFields } from "../../components/admin/SeoFormFields.jsx";

export const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    parent: "",
    description: "",
    imageUrl: "",
    imageAlt: "",
    featured: false,
    status: "ACTIVE",
    seo: {
      metaTitle: "",
      metaDescription: "",
      metaKeywords: "",
      focusKeyword: "",
      canonicalUrl: "",
    },
  });

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await adminService.getCategories();
      if (Array.isArray(data)) setCategories(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormData({
      name: "",
      slug: "",
      parent: "",
      description: "",
      imageUrl: "",
      imageAlt: "",
      featured: false,
      status: "ACTIVE",
      seo: {
        metaTitle: "",
        metaDescription: "",
        metaKeywords: "",
        focusKeyword: "",
        canonicalUrl: "",
      },
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (cat) => {
    setEditingId(cat._id);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      parent: cat.parent?._id || cat.parent || "",
      description: cat.description || "",
      imageUrl: cat.image?.url || "",
      imageAlt: cat.image?.altText || "",
      featured: cat.featured,
      status: cat.status,
      seo: {
        metaTitle: cat.seo?.metaTitle || "",
        metaDescription: cat.seo?.metaDescription || "",
        metaKeywords: cat.seo?.metaKeywords || "",
        focusKeyword: cat.seo?.focusKeyword || "",
        canonicalUrl: cat.seo?.canonicalUrl || "",
      },
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, "-"),
        parent: formData.parent || null,
        description: formData.description,
        image: {
          url: formData.imageUrl,
          altText: formData.imageAlt || formData.name,
        },
        featured: formData.featured,
        status: formData.status,
        seo: formData.seo,
      };

      if (editingId) {
        await adminService.updateCategory(editingId, payload);
      } else {
        await adminService.createCategory(payload);
      }

      setShowModal(false);
      loadCategories();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (
      window.confirm("Delete category? (Ensure no products are assigned first)")
    ) {
      try {
        await adminService.deleteCategory(id);
        loadCategories();
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
            Dynamic Category Hierarchy
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Manage product categories and subcategories without hardcoded limits
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="btn-gold py-2.5 px-4 text-xs flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      <div className="bg-noir-card border border-gold/20 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-zinc-800 text-[10px] uppercase tracking-wider text-zinc-400">
            <tr>
              <th className="py-3 px-4">Category Name</th>
              <th className="py-3 px-4">Slug</th>
              <th className="py-3 px-4">Subcategories</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {categories.map((cat) => (
              <tr key={cat._id} className="hover:bg-white/5 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        cat.image?.url ||
                        "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=100"
                      }
                      alt=""
                      className="w-10 h-10 object-cover border border-zinc-800 flex-shrink-0"
                    />
                    <div>
                      <p className="font-semibold text-zinc-200">{cat.name}</p>
                      <p className="text-[10px] text-zinc-500 line-clamp-1">
                        {cat.description}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 font-mono text-gold/80">{cat.slug}</td>
                <td className="py-3 px-4">
                  {cat.subcategories?.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {cat.subcategories.map((s) => (
                        <span
                          key={s._id}
                          className="bg-zinc-800 text-[10px] px-2 py-0.5 rounded text-zinc-300"
                        >
                          {s.name}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-zinc-600 text-[11px]">—</span>
                  )}
                </td>
                <td className="py-3 px-4">
                  <Badge variant={cat.status === "ACTIVE" ? "gold" : "noir"}>
                    {cat.status}
                  </Badge>
                </td>
                <td className="py-3 px-4 text-right space-x-2">
                  <button
                    onClick={() => handleOpenEditModal(cat)}
                    className="p-1 text-zinc-400 hover:text-gold"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4 inline" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat._id)}
                    className="p-1 text-zinc-400 hover:text-red-400"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4 inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Category Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-noir-card border border-gold/40 p-6 sm:p-8 max-w-2xl w-full my-8 space-y-4 shadow-2xl text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3 top-0 bg-noir-card z-10">
              <h3 className="font-serif text-lg text-gold uppercase tracking-wider font-semibold">
                {editingId ? "Edit Category" : "Create Category"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full bg-noir border border-zinc-800 p-2.5 text-zinc-100 focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1">
                  Parent Category (Leave empty for root category)
                </label>
                <select
                  value={formData.parent}
                  onChange={(e) =>
                    setFormData({ ...formData, parent: e.target.value })
                  }
                  className="w-full bg-noir border border-zinc-800 p-2.5 text-zinc-100 focus:outline-none focus:border-gold"
                >
                  <option value="">None (Top-Level Root Category)</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <ImageDropzone
                value={formData.imageUrl}
                onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                folder="categories"
                label="Category Banner Image"
                hint="Upload high-res category aesthetic banner (PNG, JPG, WebP)"
              />

              <div>
                <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full bg-noir border border-zinc-800 p-2.5 text-zinc-100 focus:outline-none focus:border-gold"
                />
              </div>

              {/* Category Search Engine Optimization */}
              <SeoFormFields
                seoData={formData.seo}
                onChange={(newSeo) => setFormData({ ...formData, seo: newSeo })}
                fallbackTitle={
                  formData.name ? `${formData.name} Collection` : ""
                }
                fallbackDescription={formData.description}
                fallbackSlug={formData.slug || formData.name}
                fallbackImage={formData.imageUrl}
                itemType="category"
                showImageAlt={true}
                imageAlt={formData.imageAlt}
                onImageAltChange={(alt) =>
                  setFormData({ ...formData, imageAlt: alt })
                }
              />

              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800 bottom-0 bg-noir-card z-10 py-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-zinc-800 text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-gold py-2 px-6 text-xs">
                  {editingId ? "Save Category" : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
