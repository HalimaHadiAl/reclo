import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const sizeRanges = [
  { size: "S", min: 40, max: 50, label: "S-Curve", desc: "Untuk berat 40–50 kg" },
  { size: "M", min: 50, max: 60, label: "M-Silhouette", desc: "Untuk berat 50–60 kg" },
  { size: "L", min: 60, max: 75, label: "L-Grace", desc: "Untuk berat 60–75 kg" },
  { size: "XL", min: 75, max: 90, label: "XL-Majesty", desc: "Untuk berat 75–90 kg" },
];

export function getRecommendedSize(weightKg) {
  if (weightKg < 40) return null;
  const match = sizeRanges.find((r) => weightKg >= r.min && weightKg < r.max);
  if (!match && weightKg >= 90) return sizeRanges[3];
  return match || null;
}

export default function SizeRecommender({ onSizeSelect, compact = false }) {
  const [weight, setWeight] = useState("");
  const recommended = weight ? getRecommendedSize(Number(weight)) : null;

  return (
    <div className={compact ? "" : "bg-secondary/30 p-8 md:p-12"}>
      {!compact && (
        <div className="text-center mb-8">
          <h3 className="font-display text-3xl font-light tracking-wider text-foreground">
            Temukan Ukuran Sempurna Anda
          </h3>
          <p className="font-body text-sm text-muted-foreground mt-2">
            Masukkan berat badan Anda untuk rekomendasi ukuran yang tepat
          </p>
        </div>
      )}

      <div className={`max-w-md ${compact ? "" : "mx-auto"}`}>
        <div className="relative">
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Masukkan berat badan (kg)"
            className="w-full bg-background border border-border px-5 py-4 font-body text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
            min="30"
            max="120"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 font-body text-sm text-muted-foreground">
            kg
          </span>
        </div>

        <AnimatePresence mode="wait">
          {recommended && (
            <motion.div
              key={recommended.size}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="mt-6 border border-primary/30 bg-primary/5 p-6"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary text-primary-foreground flex items-center justify-center">
                  <span className="font-display text-2xl font-semibold">{recommended.size}</span>
                </div>
                <div>
                  <p className="font-display text-xl font-medium tracking-wider text-foreground">
                    {recommended.label}
                  </p>
                  <p className="font-body text-sm text-muted-foreground mt-1">
                    Rekomendasi untuk {weight} kg — {recommended.desc}
                  </p>
                </div>
              </div>
              {onSizeSelect && (
                <button
                  onClick={() => onSizeSelect(recommended.size)}
                  className="mt-4 w-full bg-primary text-primary-foreground py-3 font-body text-sm font-semibold tracking-widest uppercase hover:opacity-90 transition-opacity"
                >
                  Pilih Ukuran {recommended.size}
                </button>
              )}
            </motion.div>
          )}
          {weight && Number(weight) > 0 && !recommended && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 font-body text-sm text-muted-foreground"
            >
              {Number(weight) < 40
                ? "Berat minimum 40 kg. Silakan hubungi kami untuk custom fitting."
                : "Berat di atas 90 kg. Silakan hubungi kami untuk custom fitting."}
            </motion.p>
          )}
        </AnimatePresence>

        {!compact && (
          <div className="mt-8 grid grid-cols-4 gap-3">
            {sizeRanges.map((r) => (
              <div
                key={r.size}
                className={`text-center p-3 border transition-colors ${
                  recommended?.size === r.size
                    ? "border-primary bg-primary/10"
                    : "border-border"
                }`}
              >
                <span className="font-display text-lg font-semibold text-foreground block">{r.size}</span>
                <span className="font-body text-xs text-muted-foreground">{r.min}–{r.max} kg</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}