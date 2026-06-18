import React from "react";
import Navbar from "@/components/reclo/Navbar";
import Footer from "../components/reclo/Footer.jsx";
import SizeRecommender from "@/components/reclo/SizeRecommender";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function SizeGuide() {
  const navigate = useNavigate();

  return (
    <div className="bg-background min-h-screen">
      <Navbar />

      <section className="pt-28 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <p className="font-body text-xs tracking-[0.3em] uppercase text-primary font-semibold mb-4">
              Precision Fit
            </p>
            <h1 className="font-display text-4xl md:text-6xl font-light tracking-wider text-foreground">
              Panduan Ukuran
            </h1>
            <p className="font-body text-base text-muted-foreground mt-6 max-w-lg mx-auto leading-relaxed">
              Kami percaya setiap tubuh itu unik. Masukkan berat badan Anda dan biarkan 
              sistem kami merekomendasikan ukuran yang sempurna untuk Anda.
            </p>
          </motion.div>

          <SizeRecommender onSizeSelect={(size) => navigate(`/koleksi`)} />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20"
          >
            <h2 className="font-display text-2xl font-light tracking-wider text-foreground text-center mb-10">
              Detail Ukuran
            </h2>
            <div className="border border-border overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-secondary/30">
                    <th className="px-6 py-4 font-body text-xs tracking-widest uppercase text-muted-foreground text-left">Ukuran</th>
                    <th className="px-6 py-4 font-body text-xs tracking-widest uppercase text-muted-foreground text-left">Berat Badan</th>
                    <th className="px-6 py-4 font-body text-xs tracking-widest uppercase text-muted-foreground text-left">Lingkar Dada</th>
                    <th className="px-6 py-4 font-body text-xs tracking-widest uppercase text-muted-foreground text-left">Lingkar Pinggang</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-border">
                    <td className="px-6 py-4 font-display text-lg font-semibold text-foreground">S</td>
                    <td className="px-6 py-4 font-body text-sm text-foreground">40 – 50 kg</td>
                    <td className="px-6 py-4 font-body text-sm text-foreground">80 – 86 cm</td>
                    <td className="px-6 py-4 font-body text-sm text-foreground">62 – 68 cm</td>
                  </tr>
                  <tr className="border-t border-border bg-secondary/10">
                    <td className="px-6 py-4 font-display text-lg font-semibold text-foreground">M</td>
                    <td className="px-6 py-4 font-body text-sm text-foreground">50 – 60 kg</td>
                    <td className="px-6 py-4 font-body text-sm text-foreground">86 – 92 cm</td>
                    <td className="px-6 py-4 font-body text-sm text-foreground">68 – 74 cm</td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="px-6 py-4 font-display text-lg font-semibold text-foreground">L</td>
                    <td className="px-6 py-4 font-body text-sm text-foreground">60 – 75 kg</td>
                    <td className="px-6 py-4 font-body text-sm text-foreground">92 – 100 cm</td>
                    <td className="px-6 py-4 font-body text-sm text-foreground">74 – 82 cm</td>
                  </tr>
                  <tr className="border-t border-border bg-secondary/10">
                    <td className="px-6 py-4 font-display text-lg font-semibold text-foreground">XL</td>
                    <td className="px-6 py-4 font-body text-sm text-foreground">75 – 90 kg</td>
                    <td className="px-6 py-4 font-body text-sm text-foreground">100 – 110 cm</td>
                    <td className="px-6 py-4 font-body text-sm text-foreground">82 – 92 cm</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="font-body text-xs text-muted-foreground/60 mt-6 text-center italic">
              * Ukuran dapat bervariasi tergantung model kebaya. Hubungi kami jika Anda membutuhkan bantuan lebih lanjut.
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}