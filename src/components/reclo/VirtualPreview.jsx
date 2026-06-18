import React, { useState } from "react";
import { motion } from "framer-motion";
import { Palette, Sparkles } from "lucide-react";

const colorFilters = [
  { name: "Original", filter: "none", hex: null },
  { name: "Warm Gold", filter: "sepia(30%) saturate(140%) brightness(105%)", hex: "#D4A853" },
  { name: "Rose", filter: "hue-rotate(330deg) saturate(120%) brightness(105%)", hex: "#C48B9F" },
  { name: "Cool Silver", filter: "saturate(60%) brightness(110%)", hex: "#A0A0A0" },
  { name: "Deep Burgundy", filter: "hue-rotate(340deg) saturate(150%) brightness(90%)", hex: "#722F37" },
  { name: "Sage Green", filter: "hue-rotate(90deg) saturate(80%) brightness(105%)", hex: "#87AE73" },
  { name: "Royal Blue", filter: "hue-rotate(200deg) saturate(140%) brightness(95%)", hex: "#3B5998" },
];

export default function VirtualPreview({ image, kebayaName }) {
  const [selectedFilter, setSelectedFilter] = useState(colorFilters[0]);
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div>
      <button
        onClick={() => setShowPreview(!showPreview)}
        className="flex items-center gap-2 border border-primary text-primary px-5 py-3 font-body text-xs font-semibold tracking-widest uppercase hover:bg-primary hover:text-primary-foreground transition-colors"
      >
        <Sparkles size={14} />
        {showPreview ? "Tutup Preview" : "Virtual Preview"}
      </button>

      {showPreview && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-6"
        >
          <div className="border-2 border-primary/20 p-2">
            <div className="relative aspect-[3/4] overflow-hidden bg-secondary/20">
              <img
                src={image}
                alt={`Virtual preview of ${kebayaName}`}
                className="w-full h-full object-cover transition-all duration-500"
                style={{ filter: selectedFilter.filter }}
              />
              <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm px-3 py-1.5 flex items-center gap-2">
                <Palette size={12} className="text-primary" />
                <span className="font-body text-xs font-medium text-foreground">
                  {selectedFilter.name}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <p className="font-body text-xs text-muted-foreground mb-3 tracking-wider uppercase">
              Pilih Filter Warna
            </p>
            <div className="flex flex-wrap gap-3">
              {colorFilters.map((cf) => (
                <button
                  key={cf.name}
                  onClick={() => setSelectedFilter(cf)}
                  className={`flex items-center gap-2 px-3 py-2 border transition-colors text-xs font-body ${
                    selectedFilter.name === cf.name
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  {cf.hex && (
                    <div
                      className="w-3 h-3 rounded-full border border-border"
                      style={{ backgroundColor: cf.hex }}
                    />
                  )}
                  {cf.name}
                </button>
              ))}
            </div>
          </div>

          <p className="font-body text-xs text-muted-foreground/60 mt-4 italic">
            * Preview ini memberikan gambaran visual warna kebaya. Warna asli mungkin sedikit berbeda.
          </p>
        </motion.div>
      )}
    </div>
  );
}