import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Loader2, Plus, Pencil, Trash2, X, Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const formatPrice = (n) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

const categories = ["Wisuda", "Lamaran", "Pernikahan", "Akad", "Kondangan", "Photoshoot"];
const sizes = ["S", "M", "L", "XL"];

const emptyForm = {
  name: "", description: "", category: "Wisuda", color: "", color_hex: "#92794F",
  price_per_day: "", deposit: "", fabric: "", is_available: true, is_featured: false,
  sizes_available: ["S", "M", "L", "XL"], main_image: "",
};

export default function AdminProducts() {
  const { toast } = useToast();
  const [kebayaList, setKebayaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const loadData = () => {
    setLoading(true);
    base44.entities.Kebaya.list("-created_date", 100)
      .then(setKebayaList)
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const handleEdit = (k) => {
    setEditingId(k.id);
    setForm({
      name: k.name || "",
      description: k.description || "",
      category: k.category || "Wisuda",
      color: k.color || "",
      color_hex: k.color_hex || "#92794F",
      price_per_day: k.price_per_day || "",
      deposit: k.deposit || "",
      fabric: k.fabric || "",
      is_available: k.is_available !== false,
      is_featured: k.is_featured === true,
      sizes_available: k.sizes_available || ["S", "M", "L", "XL"],
      main_image: k.main_image || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus kebaya ini?")) return;
    await base44.entities.Kebaya.delete(id);
    toast({ title: "Kebaya berhasil dihapus" });
    loadData();
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setForm((prev) => ({ ...prev, main_image: file_url }));
    setUploading(false);
  };

  const toggleSize = (s) => {
    setForm((prev) => ({
      ...prev,
      sizes_available: prev.sizes_available.includes(s)
        ? prev.sizes_available.filter((x) => x !== s)
        : [...prev.sizes_available, s],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.category || !form.price_per_day) {
      toast({ title: "Mohon lengkapi field yang diperlukan", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const data = {
      ...form,
      price_per_day: Number(form.price_per_day),
      deposit: form.deposit ? Number(form.deposit) : 0,
    };

    if (editingId) {
      await base44.entities.Kebaya.update(editingId, data);
      toast({ title: "Kebaya berhasil diupdate" });
    } else {
      await base44.entities.Kebaya.create(data);
      toast({ title: "Kebaya berhasil ditambahkan" });
    }

    setSubmitting(false);
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    loadData();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-light tracking-wider text-background">
          Kelola Produk
        </h1>
        <button
          onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyForm); }}
          className="flex items-center gap-2 bg-background/10 text-background px-5 py-2.5 font-body text-xs font-semibold tracking-widest uppercase hover:bg-background/20 transition-colors rounded"
        >
          <Plus size={14} /> Tambah Kebaya
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 overflow-y-auto pb-10">
          <div className="bg-foreground border border-background/10 rounded w-full max-w-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-light text-background tracking-wider">
                {editingId ? "Edit Kebaya" : "Tambah Kebaya Baru"}
              </h2>
              <button onClick={() => { setShowForm(false); setEditingId(null); }} className="text-background/50 hover:text-background">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-body text-xs text-background/50 tracking-wider uppercase block mb-1">Nama *</label>
                  <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-background/5 border border-background/10 text-background px-3 py-2 font-body text-sm rounded focus:outline-none focus:border-background/30" />
                </div>
                <div>
                  <label className="font-body text-xs text-background/50 tracking-wider uppercase block mb-1">Kategori *</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full bg-background/5 border border-background/10 text-background px-3 py-2 font-body text-sm rounded focus:outline-none focus:border-background/30">
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-body text-xs text-background/50 tracking-wider uppercase block mb-1">Harga /hari (Rp) *</label>
                  <input type="number" required value={form.price_per_day} onChange={(e) => setForm({ ...form, price_per_day: e.target.value })}
                    className="w-full bg-background/5 border border-background/10 text-background px-3 py-2 font-body text-sm rounded focus:outline-none focus:border-background/30" />
                </div>
                <div>
                  <label className="font-body text-xs text-background/50 tracking-wider uppercase block mb-1">Deposit (Rp)</label>
                  <input type="number" value={form.deposit} onChange={(e) => setForm({ ...form, deposit: e.target.value })}
                    className="w-full bg-background/5 border border-background/10 text-background px-3 py-2 font-body text-sm rounded focus:outline-none focus:border-background/30" />
                </div>
                <div>
                  <label className="font-body text-xs text-background/50 tracking-wider uppercase block mb-1">Warna</label>
                  <input type="text" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })}
                    className="w-full bg-background/5 border border-background/10 text-background px-3 py-2 font-body text-sm rounded focus:outline-none focus:border-background/30" />
                </div>
                <div>
                  <label className="font-body text-xs text-background/50 tracking-wider uppercase block mb-1">Kode Warna</label>
                  <div className="flex gap-2">
                    <input type="color" value={form.color_hex} onChange={(e) => setForm({ ...form, color_hex: e.target.value })}
                      className="w-10 h-10 border border-background/10 rounded cursor-pointer" />
                    <input type="text" value={form.color_hex} onChange={(e) => setForm({ ...form, color_hex: e.target.value })}
                      className="flex-1 bg-background/5 border border-background/10 text-background px-3 py-2 font-body text-sm rounded focus:outline-none" />
                  </div>
                </div>
                <div>
                  <label className="font-body text-xs text-background/50 tracking-wider uppercase block mb-1">Bahan</label>
                  <input type="text" value={form.fabric} onChange={(e) => setForm({ ...form, fabric: e.target.value })}
                    className="w-full bg-background/5 border border-background/10 text-background px-3 py-2 font-body text-sm rounded focus:outline-none focus:border-background/30" />
                </div>
              </div>

              <div>
                <label className="font-body text-xs text-background/50 tracking-wider uppercase block mb-1">Deskripsi</label>
                <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-background/5 border border-background/10 text-background px-3 py-2 font-body text-sm rounded focus:outline-none focus:border-background/30 resize-none" />
              </div>

              <div>
                <label className="font-body text-xs text-background/50 tracking-wider uppercase block mb-2">Ukuran Tersedia</label>
                <div className="flex gap-2">
                  {sizes.map((s) => (
                    <button key={s} type="button" onClick={() => toggleSize(s)}
                      className={`w-12 h-12 border flex items-center justify-center font-display text-sm rounded transition-colors ${
                        form.sizes_available.includes(s)
                          ? "border-background/50 bg-background/10 text-background"
                          : "border-background/10 text-background/30"
                      }`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-body text-xs text-background/50 tracking-wider uppercase block mb-2">Foto Utama</label>
                <div className="flex items-center gap-4">
                  {form.main_image && (
                    <div className="w-20 h-20 overflow-hidden rounded border border-background/10">
                      <img src={form.main_image} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <label className="flex items-center gap-2 px-4 py-2 bg-background/5 border border-background/10 text-background/70 font-body text-xs rounded cursor-pointer hover:bg-background/10 transition-colors">
                    {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                    {uploading ? "Mengupload..." : "Upload Foto"}
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                </div>
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2 font-body text-sm text-background/70 cursor-pointer">
                  <input type="checkbox" checked={form.is_available}
                    onChange={(e) => setForm({ ...form, is_available: e.target.checked })}
                    className="rounded border-background/20" />
                  Tersedia
                </label>
                <label className="flex items-center gap-2 font-body text-sm text-background/70 cursor-pointer">
                  <input type="checkbox" checked={form.is_featured}
                    onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                    className="rounded border-background/20" />
                  Tampilkan di Beranda
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" disabled={submitting}
                  className="flex-1 bg-background/10 text-background py-3 font-body text-xs font-semibold tracking-widest uppercase rounded hover:bg-background/20 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                  {submitting && <Loader2 size={14} className="animate-spin" />}
                  {editingId ? "Simpan Perubahan" : "Tambah Kebaya"}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }}
                  className="px-6 py-3 border border-background/10 text-background/50 font-body text-xs tracking-widest uppercase rounded hover:text-background transition-colors">
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Product List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-background/50" />
        </div>
      ) : kebayaList.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-display text-xl text-background/50">Belum ada produk</p>
          <p className="font-body text-sm text-background/30 mt-2">Klik "Tambah Kebaya" untuk menambahkan produk baru.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-background/10">
                <th className="pb-3 text-left font-body text-xs text-background/50 tracking-wider uppercase">Foto</th>
                <th className="pb-3 text-left font-body text-xs text-background/50 tracking-wider uppercase">Nama</th>
                <th className="pb-3 text-left font-body text-xs text-background/50 tracking-wider uppercase">Kategori</th>
                <th className="pb-3 text-left font-body text-xs text-background/50 tracking-wider uppercase">Harga</th>
                <th className="pb-3 text-left font-body text-xs text-background/50 tracking-wider uppercase">Status</th>
                <th className="pb-3 text-right font-body text-xs text-background/50 tracking-wider uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {kebayaList.map((k) => (
                <tr key={k.id} className="border-b border-background/5">
                  <td className="py-3">
                    <div className="w-12 h-12 overflow-hidden rounded bg-background/5">
                      {k.main_image ? (
                        <img src={k.main_image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-background/20 text-xs">—</div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 font-body text-sm text-background">{k.name}</td>
                  <td className="py-3 font-body text-xs text-background/50">{k.category}</td>
                  <td className="py-3 font-body text-sm text-background">{formatPrice(k.price_per_day)}</td>
                  <td className="py-3">
                    <span className={`text-xs px-2 py-1 rounded ${
                      k.is_available !== false ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                    }`}>
                      {k.is_available !== false ? "Tersedia" : "Tidak Tersedia"}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEdit(k)} className="p-2 text-background/40 hover:text-background transition-colors">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => handleDelete(k.id)} className="p-2 text-red-400/60 hover:text-red-400 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}