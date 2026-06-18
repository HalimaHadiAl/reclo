import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function KebayaCard({ kebaya, index = 0 }) {
  const formatPrice = (n) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <Link to={`/kebaya/${kebaya.id}`} className="group block">
        <div className="relative aspect-[3/4] overflow-hidden bg-secondary/30">
          {kebaya.main_image ? (
            <img
              src={kebaya.main_image}
              alt={kebaya.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground font-body text-sm">
              No Image
            </div>
          )}
          {!kebaya.is_available && (
            <div className="absolute inset-0 bg-foreground/40 flex items-center justify-center">
              <span className="bg-background px-4 py-2 font-body text-xs font-semibold tracking-widest uppercase">
                Tidak Tersedia
              </span>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-foreground/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <span className="font-body text-xs text-background tracking-widest uppercase font-semibold">
              Lihat Detail →
            </span>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-lg font-medium tracking-wider text-foreground line-clamp-1">
              {kebaya.name}
            </h3>
            {kebaya.color_hex && (
              <div
                className="w-4 h-4 rounded-full border border-border shrink-0 mt-1"
                style={{ backgroundColor: kebaya.color_hex }}
              />
            )}
          </div>
          <p className="font-body text-xs text-muted-foreground mt-1 tracking-wider uppercase">
            {kebaya.category} · {kebaya.fabric || "Brokat"}
          </p>
          <p className="font-display text-base font-semibold text-primary mt-2">
            {formatPrice(kebaya.price_per_day)}
            <span className="font-body text-xs font-normal text-muted-foreground"> /hari</span>
          </p>
        </div>
      </Link>
    </motion.div>
  );
}