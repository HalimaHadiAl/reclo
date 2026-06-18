import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Anisa Rahma",
    event: "Wisuda S2 UI",
    text: "Kebaya dari RECLO sangat pas di badan dan kualitasnya luar biasa. Sistem ukurannya akurat banget, tinggal input berat badan langsung dapat rekomendasi!",
    rating: 5,
  },
  {
    name: "Dian Sari",
    event: "Lamaran",
    text: "Proses sewa sangat mudah dan pelayanannya ramah sekali. Kebayanya cantik dan detail renda-nya halus. Semua tamu memuji penampilan saya.",
    rating: 5,
  },
  {
    name: "Putri Maharani",
    event: "Pernikahan Adat Jawa",
    text: "RECLO benar-benar membuat hari spesial saya sempurna. Koleksinya premium dan harganya sangat reasonable untuk kualitas sebagus ini.",
    rating: 5,
  },
];

export default function TestimonialSection() {
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
            Testimoni
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-light tracking-wider text-foreground">
            Cerita Pelanggan Kami
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="border border-border p-8 hover:border-primary/30 transition-colors"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, idx) => (
                  <Star key={idx} size={14} className="fill-primary text-primary" />
                ))}
              </div>
              <p className="font-body text-sm text-foreground/80 leading-relaxed italic mb-6">
                "{t.text}"
              </p>
              <div>
                <p className="font-display text-base font-medium text-foreground">{t.name}</p>
                <p className="font-body text-xs text-muted-foreground mt-1">{t.event}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}