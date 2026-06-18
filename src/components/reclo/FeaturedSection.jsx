import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import KebayaCard from "./KebayaCard";
import { ArrowRight } from "lucide-react";

export default function FeaturedSection({ kebayaList }) {
  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="font-body text-xs tracking-[0.3em] uppercase text-primary font-semibold mb-4">
            Pilihan Terbaik
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-light tracking-wider text-foreground">
            Koleksi Unggulan
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {kebayaList.slice(0, 6).map((k, i) => (
            <KebayaCard key={k.id} kebaya={k} index={i} />
          ))}
        </div>

        <div className="text-center mt-14">
          <Link
            to="/koleksi"
            className="inline-flex items-center gap-3 font-body text-sm font-semibold tracking-widest uppercase text-foreground hover:text-primary transition-colors"
          >
            Lihat Semua Koleksi
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}