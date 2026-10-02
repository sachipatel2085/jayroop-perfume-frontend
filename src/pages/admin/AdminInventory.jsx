import React, { useState, useEffect } from 'react';
import { Boxes, AlertTriangle, Check, Save } from 'lucide-react';
import { adminService } from '../../services/adminService.js';
import { Badge } from '../../components/common/Badge.jsx';

export const AdminInventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingStock, setEditingStock] = useState({});

  const loadInventory = async () => {
    try {
      setLoading(true);
      const data = await adminService.getInventory();
      if (Array.isArray(data)) setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const handleStockChange = (productId, val) => {
    setEditingStock({
      ...editingStock,
      [productId]: val,
    });
  };

  const handleSaveStock = async (productId) => {
    const newStock = editingStock[productId];
    if (newStock === undefined) return;
    try {
      await adminService.updateInventoryStock(productId, { stock: Number(newStock) });
      const updated = { ...editingStock };
      delete updated[productId];
      setEditingStock(updated);
      loadInventory();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl uppercase tracking-wider text-zinc-100 font-bold">
          Inventory Reserves & Stock Telemetry
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Monitor real-time inventory levels, variant allocations, and reorder alerts
        </p>
      </div>

      <div className="bg-noir-card border border-gold/20 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-zinc-800 text-[10px] uppercase tracking-wider text-zinc-400">
            <tr>
              <th className="py-3 px-4">Creation Name</th>
              <th className="py-3 px-4">SKU</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Current Stock</th>
              <th className="py-3 px-4">Status Indicator</th>
              <th className="py-3 px-4">Adjust Stock Level</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {products.map((p) => {
              const isLow = p.stock <= 5;
              const isOut = p.stock <= 0;
              const hasDraftVal = editingStock[p._id] !== undefined;

              return (
                <tr key={p._id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 font-semibold text-zinc-200">
                    {p.name}
                  </td>
                  <td className="py-3 px-4 font-mono text-zinc-400">{p.sku}</td>
                  <td className="py-3 px-4 text-gold/80">{p.category?.name || 'General'}</td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-base font-sans">
                      {p.stock}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {isOut ? (
                      <span className="text-[10px] bg-red-500/15 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full font-bold">
                        OUT OF STOCK
                      </span>
                    ) : isLow ? (
                      <span className="text-[10px] bg-amber-500/15 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold flex items-center gap-1 w-fit">
                        <AlertTriangle className="w-3 h-3" />
                        LOW STOCK ALERT
                      </span>
                    ) : (
                      <span className="text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
                        AMPLE RESERVES
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        defaultValue={p.stock}
                        onChange={(e) => handleStockChange(p._id, e.target.value)}
                        className="w-20 bg-noir border border-zinc-800 p-1.5 text-xs text-zinc-100 text-center focus:outline-none focus:border-gold"
                      />
                      {hasDraftVal && (
                        <button
                          onClick={() => handleSaveStock(p._id)}
                          className="btn-gold py-1.5 px-3 text-[10px] flex items-center gap-1"
                        >
                          <Save className="w-3 h-3" />
                          <span>Save</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
