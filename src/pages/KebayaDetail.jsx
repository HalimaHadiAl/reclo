import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import Navbar from "@/components/reclo/Navbar";
import Footer from "@/components/reclo/Footer";
import SizeRecommender from "@/components/reclo/SizeRecommender";
import { Loader2, ArrowLeft, Check } from "lucide-react";
import AvailabilityCalendar from "@/components/reclo/AvailabilityCalendar";
import ReviewSection from "@/components/reclo/ReviewSection";
import VirtualTryOn from "@/components/reclo/VirtualTryOn";
import { motion } from "framer-motion";

const formatPrice = (n) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

export default function KebayaDetail() {
  const { id } = useParams();
  const [kebaya, setKebaya] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    base44.entities.Kebaya.filter({ id })
      .then((res) => { if (res.length > 0) setKebaya(res[0]); })
      .finally(() => setLoading(false));
  }, [id]);

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
        <Link to="/koleksi" className="font-body text-sm text-primary hover:underline">Kembali ke Koleksi</Link>
      </div>
    );
  }

  const allImages = [kebaya.main_image, ...(kebaya.images || [])].filter(Boolean);
  const currentImage = allImages[selectedImage] || allImages[0];

  return (
    <div className="bg-background min-h-screen">
      <Navbar />

      <section className="pt-28 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <Link to="/koleksi" className="inline-flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft size={14} /> Kembali ke Koleksi
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Images */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="aspect-[3/4] overflow-hidden bg-secondary/20">
                {currentImage ? (
                  <img
                    src={currentImage}
                    alt={kebaya.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    No Image
                  </div>
                )}
              </div>
              {allImages.length > 1 && (
                <div className="flex gap-3 mt-4 overflow-x-auto">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`w-20 h-20 shrink-0 overflow-hidden border-2 transition-colors ${
                        idx === selectedImage ? "border-primary" : "border-transparent"
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <p className="font-body text-xs tracking-[0.3em] uppercase text-primary font-semibold mb-3">
                {kebaya.category}
              </p>
              <h1 className="font-display text-4xl md:text-5xl font-light tracking-wider text-foreground">
                {kebaya.name}
              </h1>

              <div className="mt-6 flex items-baseline gap-3">
                <span className="font-display text-3xl font-semibold text-primary">
                  {formatPrice(kebaya.price_per_day)}
                </span>
                <span className="font-body text-sm text-muted-foreground">/hari</span>
              </div>

              {kebaya.deposit > 0 && (
                <p className="font-body text-xs text-muted-foreground mt-2">
                  Deposit: {formatPrice(kebaya.deposit)}
                </p>
              )}

              {kebaya.description && (
                <p className="font-body text-sm text-muted-foreground mt-6 leading-relaxed">
                  {kebaya.description}
                </p>
              )}

              <div className="mt-8 space-y-2">
                {kebaya.fabric && (
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="font-body text-xs text-muted-foreground uppercase tracking-wider">Bahan</span>
                    <span className="font-body text-sm text-foreground">{kebaya.fabric}</span>
                  </div>
                )}
                {kebaya.color && (
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="font-body text-xs text-muted-foreground uppercase tracking-wider">Warna</span>
                    <div className="flex items-center gap-2">
                      {kebaya.color_hex && (
                        <div className="w-4 h-4 rounded-full border border-border" style={{ backgroundColor: kebaya.color_hex }} />
                      )}
                      <span className="font-body text-sm text-foreground">{kebaya.color}</span>
                    </div>
                  </div>
                )}
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="font-body text-xs text-muted-foreground uppercase tracking-wider">Ukuran</span>
                  <span className="font-body text-sm text-foreground">{(kebaya.sizes_available || []).join(", ")}</span>
                </div>
              </div>

              {/* Size Selector */}
              <div className="mt-8">
                <p className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-3">
                  Pilih Ukuran
                </p>
                <div className="flex gap-3 mb-4">
                  {(kebaya.sizes_available || []).map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`w-14 h-14 border flex items-center justify-center font-display text-lg transition-colors ${
                        selectedSize === s
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border text-foreground hover:border-primary"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <SizeRecommender compact onSizeSelect={setSelectedSize} />
              </div>

              {/* Virtual Try-On AI */}
              <VirtualTryOn kebaya={kebaya} />

              {/* CTA Buttons */}
              <div className="mt-10 space-y-3">
                <Link
                  to={`/checkout/${kebaya.id}?type=escrow${selectedSize ? `&size=${selectedSize}` : ""}`}
                  className="flex items-center justify-center gap-2 w-full bg-primary text-primary-foreground py-4 font-body text-xs font-semibold tracking-[0.2em] uppercase hover:opacity-90 transition-opacity"
                >
                  <Check size={14} />
                  Sewa dengan Pembayaran Aman
                </Link>
                <Link
                  to={`/checkout/${kebaya.id}?type=booking${selectedSize ? `&size=${selectedSize}` : ""}`}
                  className="flex items-center justify-center gap-2 w-full border border-foreground text-foreground py-4 font-body text-xs font-semibold tracking-[0.2em] uppercase hover:bg-foreground hover:text-background transition-colors"
                >
                  Booking via Contact Person
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Availability Calendar + Reviews */}
      <section className="pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div>
              <h3 className="font-display text-2xl font-light tracking-wider text-foreground mb-6">
                Ketersediaan Tanggal
              </h3>
              <AvailabilityCalendar kebayaId={kebaya.id} />
            </div>
          </div>
          <ReviewSection kebayaId={kebaya.id} kebayaName={kebaya.name} />
        </div>
      </section>

      <Footer />
    </div>
  );
}