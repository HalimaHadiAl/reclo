import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function HeroSection({ heroImage }) {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-foreground/5" />

      <div className="relative w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center py-32 lg:py-0">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="order-2 lg:order-1"
        >
          <p className="font-body text-xs tracking-[0.3em] uppercase text-primary font-semibold mb-6">
            Elegant Traditional Wear Rental
          </p>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-light leading-[0.95] tracking-wider text-foreground">
            Elegansi
            <br />
            <span className="font-semibold italic">Kebaya</span>
            <br />
            Modern
          </h1>
          <p className="font-body text-base text-muted-foreground mt-8 max-w-md leading-relaxed">
            Lengkapi momen istimewa Anda dengan koleksi kebaya premium dari RECLO. 
            Wisuda, lamaran, atau pernikahan — kami siap mewujudkan penampilan terbaik Anda.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-10">
            <Link
              to="/koleksi"
              className="inline-flex items-center justify-center gap-3 bg-primary text-primary-foreground px-8 py-4 font-body text-xs font-semibold tracking-[0.2em] uppercase hover:opacity-90 transition-opacity"
            >
              Jelajahi Koleksi
              <ArrowRight size={14} />
            </Link>
            <Link
              to="/ukuran"
              className="inline-flex items-center justify-center gap-3 border border-foreground text-foreground px-8 py-4 font-body text-xs font-semibold tracking-[0.2em] uppercase hover:bg-foreground hover:text-background transition-colors"
            >
              Cek Ukuran Anda
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="order-1 lg:order-2 relative"
        >
          <div className="relative aspect-[3/4] max-h-[80vh] mx-auto lg:mx-0 lg:ml-auto overflow-hidden">
            <img
              src={heroImage}
              alt="RECLO Kebaya koleksi premium, detail lace Indonesia"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 border border-primary/20 pointer-events-none" />
          </div>
          <div className="absolute -bottom-6 -left-6 w-24 h-24 border border-primary/20 -z-10" />
          <div className="absolute -top-6 -right-6 w-16 h-16 bg-primary/8 -z-10" />
        </motion.div>
      </div>
    </section>
  );
}