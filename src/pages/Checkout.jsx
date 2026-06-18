import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import Navbar from "@/components/reclo/Navbar";
import Footer from "@/components/reclo/Footer";
import { Loader2, ShieldCheck, MessageCircle, ArrowLeft, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";

const formatPrice = (n) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

export default function Checkout() {
  const { kebayaId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const urlParams = new URLSearchParams(window.location.search);
  const checkoutType = urlParams.get("type") || "escrow";
  const preselectedSize = urlParams.get("size") || "";

  const [kebaya, setKebaya] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    customer_address: "",
    size: preselectedSize,
    weight_kg: "",
    rental_date: "",
    return_date: "",
    notes: "",
  });

  useEffect(() => {
    base44.entities.Kebaya.filter({ id: kebayaId })
      .then((res) => { if (res.length > 0) setKebaya(res[0]); })
      .finally(() => setLoading(false));
  }, [kebayaId]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const calculateDays = () => {
    if (!form.rental_date || !form.return_date) return 1;
    const diff = new Date(form.return_date) - new Date(form.rental_date);
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.customer_name || !form.customer_email || !form.size || !form.rental_date || !form.return_date) {
      toast({ title: "Mohon lengkapi semua field yang diperlukan", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    const days = calculateDays();
    const totalPrice = (kebaya.price_per_day || 0) * days;
    const orderNumber = "RECLO-" + Date.now().toString(36).toUpperCase();

    const orderData = {
      order_number: orderNumber,
      customer_name: form.customer_name,
      customer_email: form.customer_email,
      customer_phone: form.customer_phone,
      customer_address: form.customer_address,
      kebaya_id: kebayaId,
      kebaya_name: kebaya.name,
      size: form.size,
      weight_kg: form.weight_kg ? Number(form.weight_kg) : undefined,
      rental_date: form.rental_date,
      return_date: form.return_date,
      total_price: totalPrice,
      deposit_amount: kebaya.deposit || 0,
      checkout_type: checkoutType,
      status: "pending",
      payment_status: checkoutType === "escrow" ? "held" : "unpaid",
      notes: form.notes,
    };

    await base44.entities.Order.create(orderData);
    setSubmitting(false);
    setSuccess(true);

    if (checkoutType === "booking") {
      setTimeout(() => {
        const message = encodeURIComponent(
          `Halo RECLO! Saya ingin booking kebaya:\n\nNomor Order: ${orderNumber}\nKebaya: ${kebaya.name}\nUkuran: ${form.size}\nTanggal Sewa: ${form.rental_date} s/d ${form.return_date}\nTotal: ${formatPrice(totalPrice)}\n\nNama: ${form.customer_name}\nEmail: ${form.customer_email}\nTelp: ${form.customer_phone}`
        );
        window.open(`https://wa.me/6281234567890?text=${message}`, "_blank");
      }, 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!kebaya) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <p className="font-display text-2xl text-foreground mb-4">Kebaya tidak ditemukan</p>
        <button onClick={() => navigate("/koleksi")} className="font-body text-sm text-primary hover:underline">
          Kembali ke Koleksi
        </button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="bg-background min-h-screen">
        <Navbar />
        <section className="pt-28 pb-24 px-6">
          <div className="max-w-lg mx-auto text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
              <CheckCircle className="w-20 h-20 text-primary mx-auto mb-6" />
            </motion.div>
            <h2 className="font-display text-3xl font-light tracking-wider text-foreground mb-4">
              {checkoutType === "escrow" ? "Pesanan Berhasil!" : "Booking Berhasil!"}
            </h2>
            <p className="font-body text-sm text-muted-foreground mb-8">
              {checkoutType === "escrow"
                ? "Pembayaran Anda aman ditahan hingga barang diterima. Kami akan segera memproses pesanan Anda."
                : "Booking Anda telah tercatat. Anda akan diarahkan ke WhatsApp untuk konfirmasi pembayaran."}
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-primary text-primary-foreground px-8 py-3 font-body text-xs font-semibold tracking-widest uppercase"
            >
              Kembali ke Beranda
            </button>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  const days = calculateDays();
  const totalPrice = (kebaya.price_per_day || 0) * days;

  return (
    <div className="bg-background min-h-screen">
      <Navbar />

      <section className="pt-28 pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft size={14} /> Kembali
          </button>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              {checkoutType === "escrow" ? (
                <ShieldCheck className="text-primary" size={20} />
              ) : (
                <MessageCircle className="text-primary" size={20} />
              )}
              <span className="font-body text-xs tracking-widest uppercase text-primary font-semibold">
                {checkoutType === "escrow" ? "RECLO Protection Pay" : "Personal Stylist Booking"}
              </span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-light tracking-wider text-foreground">
              {checkoutType === "escrow" ? "Checkout Aman" : "Booking Kebaya"}
            </h1>
            <p className="font-body text-sm text-muted-foreground mt-2">
              {checkoutType === "escrow"
                ? "Pembayaran ditahan hingga barang sampai di tangan Anda — aman dan terpercaya."
                : "Booking kebaya Anda, lalu kami akan menghubungi Anda untuk konfirmasi pembayaran."}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Form */}
            <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="font-body text-xs tracking-widest uppercase text-muted-foreground block mb-2">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.customer_name}
                    onChange={(e) => handleChange("customer_name", e.target.value)}
                    className="w-full border border-border bg-background px-4 py-3 font-body text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="font-body text-xs tracking-widest uppercase text-muted-foreground block mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={form.customer_email}
                    onChange={(e) => handleChange("customer_email", e.target.value)}
                    className="w-full border border-border bg-background px-4 py-3 font-body text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="font-body text-xs tracking-widest uppercase text-muted-foreground block mb-2">
                    No. Telepon
                  </label>
                  <input
                    type="tel"
                    value={form.customer_phone}
                    onChange={(e) => handleChange("customer_phone", e.target.value)}
                    className="w-full border border-border bg-background px-4 py-3 font-body text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="font-body text-xs tracking-widest uppercase text-muted-foreground block mb-2">
                    Berat Badan (kg)
                  </label>
                  <input
                    type="number"
                    value={form.weight_kg}
                    onChange={(e) => handleChange("weight_kg", e.target.value)}
                    className="w-full border border-border bg-background px-4 py-3 font-body text-sm focus:outline-none focus:border-primary transition-colors"
                    placeholder="Untuk rekomendasi ukuran"
                  />
                </div>
              </div>

              <div>
                <label className="font-body text-xs tracking-widest uppercase text-muted-foreground block mb-2">
                  Alamat Pengiriman
                </label>
                <textarea
                  value={form.customer_address}
                  onChange={(e) => handleChange("customer_address", e.target.value)}
                  rows={3}
                  className="w-full border border-border bg-background px-4 py-3 font-body text-sm focus:outline-none focus:border-primary transition-colors resize-none"
                />
              </div>

              <div>
                <label className="font-body text-xs tracking-widest uppercase text-muted-foreground block mb-2">
                  Ukuran *
                </label>
                <div className="flex gap-3">
                  {(kebaya.sizes_available || ["S", "M", "L", "XL"]).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handleChange("size", s)}
                      className={`w-14 h-14 border flex items-center justify-center font-display text-lg transition-colors ${
                        form.size === s
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border text-foreground hover:border-primary"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="font-body text-xs tracking-widest uppercase text-muted-foreground block mb-2">
                    Tanggal Sewa *
                  </label>
                  <input
                    type="date"
                    required
                    value={form.rental_date}
                    onChange={(e) => handleChange("rental_date", e.target.value)}
                    className="w-full border border-border bg-background px-4 py-3 font-body text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="font-body text-xs tracking-widest uppercase text-muted-foreground block mb-2">
                    Tanggal Kembali *
                  </label>
                  <input
                    type="date"
                    required
                    value={form.return_date}
                    onChange={(e) => handleChange("return_date", e.target.value)}
                    className="w-full border border-border bg-background px-4 py-3 font-body text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="font-body text-xs tracking-widest uppercase text-muted-foreground block mb-2">
                  Catatan
                </label>
                <textarea
                  value={form.notes}
                  onChange={(e) => handleChange("notes", e.target.value)}
                  rows={2}
                  placeholder="Catatan khusus untuk pesanan Anda..."
                  className="w-full border border-border bg-background px-4 py-3 font-body text-sm focus:outline-none focus:border-primary transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary text-primary-foreground py-4 font-body text-xs font-semibold tracking-[0.2em] uppercase hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : checkoutType === "escrow" ? (
                  <>
                    <ShieldCheck size={14} />
                    Bayar {formatPrice(totalPrice + (kebaya.deposit || 0))}
                  </>
                ) : (
                  <>
                    <MessageCircle size={14} />
                    Kirim Booking
                  </>
                )}
              </button>
            </form>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="border border-border p-6 sticky top-28">
                <h3 className="font-display text-xl font-medium tracking-wider text-foreground mb-6">
                  Ringkasan
                </h3>
                {kebaya.main_image && (
                  <div className="aspect-[3/4] overflow-hidden bg-secondary/20 mb-4">
                    <img src={kebaya.main_image} alt={kebaya.name} className="w-full h-full object-cover" />
                  </div>
                )}
                <p className="font-display text-lg font-medium text-foreground">{kebaya.name}</p>
                <p className="font-body text-xs text-muted-foreground mt-1">{kebaya.category}</p>

                <div className="mt-6 space-y-3">
                  <div className="flex justify-between">
                    <span className="font-body text-sm text-muted-foreground">Harga /hari</span>
                    <span className="font-body text-sm text-foreground">{formatPrice(kebaya.price_per_day)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-body text-sm text-muted-foreground">Durasi</span>
                    <span className="font-body text-sm text-foreground">{days} hari</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-body text-sm text-muted-foreground">Subtotal</span>
                    <span className="font-body text-sm text-foreground">{formatPrice(totalPrice)}</span>
                  </div>
                  {kebaya.deposit > 0 && (
                    <div className="flex justify-between">
                      <span className="font-body text-sm text-muted-foreground">Deposit</span>
                      <span className="font-body text-sm text-foreground">{formatPrice(kebaya.deposit)}</span>
                    </div>
                  )}
                  <div className="border-t border-border pt-3 flex justify-between">
                    <span className="font-body text-sm font-semibold text-foreground">Total</span>
                    <span className="font-display text-lg font-semibold text-primary">
                      {formatPrice(totalPrice + (kebaya.deposit || 0))}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}