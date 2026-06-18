import React from "react";
import { motion } from "framer-motion";
import { Ruler, Sparkles, ShieldCheck, Heart } from "lucide-react";

const features = [
  {
    icon: Ruler,
    title: "Precision Fit",
    desc: "Sistem rekomendasi ukuran berdasarkan berat badan. Tidak perlu coba-coba — langsung pas di tubuh Anda.",
  },
  {
    icon: Sparkles,
    title: "Virtual Preview",
    desc: "Lihat preview kebaya dengan filter warna sebelum menyewa. Pastikan warna yang sempurna untuk Anda.",
  },
  {
    icon: ShieldCheck,
    title: "Pembayaran Aman",
    desc: "Pilih pembayaran escrow yang aman atau booking langsung melalui contact person kami.",
  },
  {
    icon: Heart,
    title: "Koleksi Premium",
    desc: "Setiap kebaya dipilih dengan cermat — bahan berkualitas, detail renda halus, dan desain terkini.",
  },
];

export default function WhyRecloSection() {
  return (
    <section className="py-24 px-6 bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="font-body text-xs tracking-[0.3em] uppercase text-primary font-semibold mb-4">
            Mengapa RECLO
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-light tracking-wider text-foreground">
            Pengalaman Sewa Premium
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center p-6"
            >
              <div className="w-14 h-14 mx-auto mb-6 border border-primary/30 flex items-center justify-center">
                <f.icon size={22} className="text-primary" />
              </div>
              <h3 className="font-display text-xl font-medium tracking-wider text-foreground mb-3">
                {f.title}
              </h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}