import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Star, Upload, Loader2, Camera } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";

function StarRating({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange(s)}
          onMouseEnter={() => setHovered(s)}
          onMouseLeave={() => setHovered(0)}
          className="transition-colors"
        >
          <Star
            size={22}
            className={s <= (hovered || value) ? "text-primary fill-primary" : "text-muted-foreground"}
          />
        </button>
      ))}
    </div>
  );
}

export default function ReviewSection({ kebayaId, kebayaName }) {
  const { toast } = useToast();
  const [reviews, setReviews] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    reviewer_name: "",
    reviewer_email: "",
    rating: 0,
    comment: "",
    event_type: "",
    photo_url: "",
  });

  const loadReviews = () => {
    base44.entities.Review.filter({ kebaya_id: kebayaId, is_approved: true })
      .then(setReviews);
  };

  useEffect(() => { loadReviews(); }, [kebayaId]);

  const handlePhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setForm((p) => ({ ...p, photo_url: file_url }));
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.reviewer_name || form.rating === 0) {
      toast({ title: "Mohon isi nama dan rating", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    await base44.entities.Review.create({
      ...form,
      kebaya_id: kebayaId,
      kebaya_name: kebayaName,
      is_approved: true,
    });
    toast({ title: "Review berhasil dikirim! Terima kasih 💛" });
    setForm({ reviewer_name: "", reviewer_email: "", rating: 0, comment: "", event_type: "", photo_url: "" });
    setShowForm(false);
    loadReviews();
    setSubmitting(false);
  };

  const avgRating = reviews.length
    ? (reviews.reduce((a, r) => a + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : null;

  return (
    <section className="mt-16 border-t border-border pt-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="font-display text-3xl font-light tracking-wider text-foreground">
            Ulasan Pelanggan
          </h3>
          {avgRating && (
            <div className="flex items-center gap-2 mt-2">
              <Star size={16} className="text-primary fill-primary" />
              <span className="font-display text-xl font-semibold text-foreground">{avgRating}</span>
              <span className="font-body text-sm text-muted-foreground">({reviews.length} ulasan)</span>
            </div>
          )}
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary text-primary-foreground px-5 py-2.5 font-body text-xs font-semibold tracking-widest uppercase hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <Camera size={14} />
          Tulis Ulasan
        </button>
      </div>

      {showForm && (
        <motion.form
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="border border-border p-6 mb-8 bg-secondary/20"
        >
          <h4 className="font-display text-xl font-medium tracking-wider text-foreground mb-6">
            Bagikan Pengalaman Anda
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="font-body text-xs uppercase tracking-wider text-muted-foreground block mb-2">Nama *</label>
              <input
                value={form.reviewer_name}
                onChange={(e) => setForm((p) => ({ ...p, reviewer_name: e.target.value }))}
                className="w-full border border-border bg-background px-4 py-3 font-body text-sm focus:outline-none focus:border-primary"
                required
              />
            </div>
            <div>
              <label className="font-body text-xs uppercase tracking-wider text-muted-foreground block mb-2">Email</label>
              <input
                type="email"
                value={form.reviewer_email}
                onChange={(e) => setForm((p) => ({ ...p, reviewer_email: e.target.value }))}
                className="w-full border border-border bg-background px-4 py-3 font-body text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="font-body text-xs uppercase tracking-wider text-muted-foreground block mb-2">Jenis Acara</label>
              <input
                value={form.event_type}
                onChange={(e) => setForm((p) => ({ ...p, event_type: e.target.value }))}
                placeholder="Wisuda, Lamaran, dll"
                className="w-full border border-border bg-background px-4 py-3 font-body text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="font-body text-xs uppercase tracking-wider text-muted-foreground block mb-2">Rating *</label>
              <StarRating value={form.rating} onChange={(v) => setForm((p) => ({ ...p, rating: v }))} />
            </div>
          </div>

          <div className="mb-4">
            <label className="font-body text-xs uppercase tracking-wider text-muted-foreground block mb-2">Komentar</label>
            <textarea
              value={form.comment}
              onChange={(e) => setForm((p) => ({ ...p, comment: e.target.value }))}
              rows={3}
              className="w-full border border-border bg-background px-4 py-3 font-body text-sm focus:outline-none focus:border-primary resize-none"
              placeholder="Ceritakan pengalaman Anda memakai kebaya ini..."
            />
          </div>

          <div className="mb-6">
            <label className="font-body text-xs uppercase tracking-wider text-muted-foreground block mb-2">
              Upload Foto (opsional)
            </label>
            {form.photo_url ? (
              <div className="relative w-32 h-40 overflow-hidden border border-border">
                <img src={form.photo_url} alt="preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, photo_url: "" }))}
                  className="absolute top-1 right-1 bg-destructive text-white text-xs w-5 h-5 flex items-center justify-center rounded-full"
                >×</button>
              </div>
            ) : (
              <label className="flex items-center gap-3 border border-dashed border-border px-4 py-3 cursor-pointer hover:border-primary transition-colors w-fit">
                {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                <span className="font-body text-sm text-muted-foreground">
                  {uploading ? "Mengupload..." : "Pilih foto Anda memakai kebaya ini"}
                </span>
                <input type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
              </label>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="bg-primary text-primary-foreground px-8 py-3 font-body text-xs font-semibold tracking-widest uppercase hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
          >
            {submitting ? <Loader2 size={14} className="animate-spin" /> : null}
            Kirim Ulasan
          </button>
        </motion.form>
      )}

      {reviews.length === 0 ? (
        <p className="font-body text-sm text-muted-foreground text-center py-10">
          Belum ada ulasan. Jadilah yang pertama!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="border border-border p-5"
            >
              <div className="flex items-start gap-4">
                {r.photo_url && (
                  <img
                    src={r.photo_url}
                    alt={r.reviewer_name}
                    className="w-16 h-20 object-cover shrink-0 border border-border"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={13}
                        className={s <= r.rating ? "text-primary fill-primary" : "text-muted-foreground"}
                      />
                    ))}
                  </div>
                  <p className="font-display text-base font-medium text-foreground">{r.reviewer_name}</p>
                  {r.event_type && (
                    <p className="font-body text-xs text-primary mt-0.5">{r.event_type}</p>
                  )}
                  {r.comment && (
                    <p className="font-body text-sm text-muted-foreground mt-2 leading-relaxed">
                      "{r.comment}"
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}