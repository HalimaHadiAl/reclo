import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import Navbar from "@/components/reclo/Navbar";
import Footer from "@/components/reclo/Footer";
import KebayaCard from "@/components/reclo/KebayaCard";
import { Loader2, SlidersHorizontal, X } from "lucide-react";
import { motion } from "framer-motion";

const categories = ["Semua", "Wisuda", "Lamaran", "Pernikahan", "Akad", "Kondangan", "Photoshoot"];
const colorOptions = [
  { name: "Semua", hex: null },
  { name: "Putih", hex: "#FFFFFF" },
  { name: "Pink", hex: "#E8B4B8" },
  { name: "Maroon", hex: "#722F37" },
  { name: "Hijau", hex: "#87AE73" },
  { name: "Navy", hex: "#2C3E6B" },
  { name: "Gold", hex: "#D4A853" },
  { name: "Hitam", hex: "#1A1A1A" },
];

export default function Collection() {
  const [kebayaList, setKebayaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [selectedColor, setSelectedColor] = useState("Semua");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    base44.entities.Kebaya.list("-created_date", 100)
      .then(setKebayaList)
      .finally(() => setLoading(false));
  }, []);

  const filtered = kebayaList.filter((k) => {
    const catMatch = selectedCategory === "Semua" || k.category === selectedCategory;
    const colorMatch =
      selectedColor === "Semua" ||
      (k.color && k.color.toLowerCase().includes(selectedColor.toLowerCase()));
    return catMatch && colorMatch;
  });

  return (
    <div className="bg-background min-h-screen">
      <Navbar />

      <section className="pt-28 pb-8 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <p className="font-body text-xs tracking-[0.3em] uppercase text-primary font-semibold mb-4">
              Koleksi Kami
            </p>
            <h1 className="font-display text-4xl md:text-6xl font-light tracking-wider text-foreground">
              Semua Kebaya
            </h1>
          </motion.div>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 font-body text-xs tracking-widest uppercase transition-colors ${
                  selectedCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "border border-border text-muted-foreground hover:border-primary hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Filter Toggle */}
          <div className="flex justify-center mb-8">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 font-body text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
            >
              {showFilters ? <X size={14} /> : <SlidersHorizontal size={14} />}
              {showFilters ? "Tutup Filter" : "Filter Warna"}
            </button>
          </div>

          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="flex flex-wrap justify-center gap-3 mb-8"
            >
              {colorOptions.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColor(c.name)}
                  className={`flex items-center gap-2 px-4 py-2 border transition-colors font-body text-xs ${
                    selectedColor === c.name
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  {c.hex && (
                    <div
                      className="w-3 h-3 rounded-full border border-border"
                      style={{ backgroundColor: c.hex }}
                    />
                  )}
                  {c.name}
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      <section className="pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-display text-2xl text-foreground mb-2">Belum ada koleksi</p>
              <p className="font-body text-sm text-muted-foreground">
                Koleksi kebaya akan segera hadir.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((k, i) => (
                <KebayaCard key={k.id} kebaya={k} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}