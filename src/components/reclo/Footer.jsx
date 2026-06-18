import React from "react";
import { Link } from "react-router-dom";
import { Instagram, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-1">
            <span className="font-display text-3xl font-semibold tracking-wider">RECLO</span>
            <p className="font-body text-sm text-background/60 mt-4 leading-relaxed">
              Elegant Traditional Wear Rental dengan nuansa modern premium. Kami hadir untuk melengkapi momen spesial Anda.
            </p>
          </div>

          <div>
            <h4 className="font-display text-lg font-semibold tracking-wider mb-6">Navigasi</h4>
            <div className="flex flex-col gap-3">
              <Link to="/koleksi" className="font-body text-sm text-background/60 hover:text-background transition-colors">Koleksi</Link>
              <Link to="/ukuran" className="font-body text-sm text-background/60 hover:text-background transition-colors">Panduan Ukuran</Link>
              <Link to="/tentang" className="font-body text-sm text-background/60 hover:text-background transition-colors">Tentang Kami</Link>
              <Link to="/kontak" className="font-body text-sm text-background/60 hover:text-background transition-colors">Kontak</Link>
            </div>
          </div>

          <div>
            <h4 className="font-display text-lg font-semibold tracking-wider mb-6">Layanan</h4>
            <div className="flex flex-col gap-3">
              <span className="font-body text-sm text-background/60">Sewa Kebaya Wisuda</span>
              <span className="font-body text-sm text-background/60">Sewa Kebaya Lamaran</span>
              <span className="font-body text-sm text-background/60">Sewa Kebaya Pernikahan</span>
              <span className="font-body text-sm text-background/60">Sewa Kebaya Kondangan</span>
            </div>
          </div>

          <div>
            <h4 className="font-display text-lg font-semibold tracking-wider mb-6">Hubungi Kami</h4>
            <div className="flex flex-col gap-4">
              <a href="https://instagram.com/reclo.id" target="_blank" rel="noreferrer" className="flex items-center gap-3 font-body text-sm text-background/60 hover:text-background transition-colors">
                <Instagram size={16} /> @reclo.id
              </a>
              <a href="mailto:reclo@gmail.com" className="flex items-center gap-3 font-body text-sm text-background/60 hover:text-background transition-colors">
                <Mail size={16} /> reclo@gmail.com
              </a>
              <a href="tel:+6285649370795" className="flex items-center gap-3 font-body text-sm text-background/60 hover:text-background transition-colors">
                <Phone size={16} /> +62 856-4937-0795
              </a>
              <span className="flex items-start gap-3 font-body text-sm text-background/60">
                <MapPin size={16} className="mt-0.5 shrink-0" /> Semarang, Indonesia
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-background/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs text-background/40">
            © {new Date().getFullYear()} RECLO. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/tentang" className="font-body text-xs text-background/40 hover:text-background/70 transition-colors">Kebijakan Privasi</Link>
            <Link to="/tentang" className="font-body text-xs text-background/40 hover:text-background/70 transition-colors">Syarat & Ketentuan</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}