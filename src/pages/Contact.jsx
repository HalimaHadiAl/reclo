import React, { useState } from "react";
import Navbar from "@/components/reclo/Navbar";
import Footer from "@/components/reclo/Footer";
import { motion } from "framer-motion";
import { Instagram, Mail, Phone, MapPin, Send, MessageCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function Contact() {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);
    const message = encodeURIComponent(
      `Halo RECLO!\n\nNama: ${form.name}\nEmail: ${form.email}\n\nPesan:\n${form.message}`
    );
    window.open(`https://wa.me/6285805615543?text=${message}`, "_blank");
    setSending(false);
    toast({ title: "Pesan dikirim ke WhatsApp!" });
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="bg-background min-h-screen">
      <Navbar />

      <section className="pt-28 pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <p className="font-body text-xs tracking-[0.3em] uppercase text-primary font-semibold mb-4">
              Hubungi Kami
            </p>
            <h1 className="font-display text-4xl md:text-6xl font-light tracking-wider text-foreground">
              Kontak
            </h1>
            <p className="font-body text-base text-muted-foreground mt-6 max-w-lg mx-auto">
              Ada pertanyaan tentang koleksi, ukuran, atau proses sewa? Kami siap membantu.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-2xl font-light tracking-wider text-foreground mb-8">
                Kirim Pesan
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="font-body text-xs tracking-widest uppercase text-muted-foreground block mb-2">
                    Nama
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full border border-border bg-background px-4 py-3 font-body text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="font-body text-xs tracking-widest uppercase text-muted-foreground block mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full border border-border bg-background px-4 py-3 font-body text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="font-body text-xs tracking-widest uppercase text-muted-foreground block mb-2">
                    Pesan
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full border border-border bg-background px-4 py-3 font-body text-sm focus:outline-none focus:border-primary transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  className="flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 font-body text-xs font-semibold tracking-[0.2em] uppercase hover:opacity-90 transition-opacity"
                >
                  <Send size={14} />
                  Kirim via WhatsApp
                </button>
              </form>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-2xl font-light tracking-wider text-foreground mb-8">
                Informasi Kontak
              </h2>
              <div className="space-y-6">
                <a
                  href="https://wa.me/6285805615543"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-4 p-5 border border-border hover:border-primary/30 transition-colors group"
                >
                  <MessageCircle size={20} className="text-primary shrink-0" />
                  <div>
                    <p className="font-body text-xs text-muted-foreground tracking-wider uppercase">WhatsApp</p>
                    <p className="font-body text-sm text-foreground group-hover:text-primary transition-colors">+62 858-0561-5543</p>
                  </div>
                </a>
                <a
                  href="https://instagram.com/reclo.id"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-4 p-5 border border-border hover:border-primary/30 transition-colors group"
                >
                  <Instagram size={20} className="text-primary shrink-0" />
                  <div>
                    <p className="font-body text-xs text-muted-foreground tracking-wider uppercase">Instagram</p>
                    <p className="font-body text-sm text-foreground group-hover:text-primary transition-colors">@reclo.id</p>
                  </div>
                </a>
                <a
                  href="mailto:reclo@gmail.com"
                  className="flex items-center gap-4 p-5 border border-border hover:border-primary/30 transition-colors group"
                >
                  <Mail size={20} className="text-primary shrink-0" />
                  <div>
                    <p className="font-body text-xs text-muted-foreground tracking-wider uppercase">Email</p>
                    <p className="font-body text-sm text-foreground group-hover:text-primary transition-colors">reclo@gmail.com</p>
                  </div>
                </a>
                <a
                  href="tel:+6285805615543"
                  className="flex items-center gap-4 p-5 border border-border hover:border-primary/30 transition-colors group"
                >
                  <Phone size={20} className="text-primary shrink-0" />
                  <div>
                    <p className="font-body text-xs text-muted-foreground tracking-wider uppercase">Telepon</p>
                    <p className="font-body text-sm text-foreground group-hover:text-primary transition-colors">+62 858-0561-5543</p>
                  </div>
                </a>
                <div className="flex items-start gap-4 p-5 border border-border">
                  <MapPin size={20} className="text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-body text-xs text-muted-foreground tracking-wider uppercase">Alamat</p>
                    <p className="font-body text-sm text-foreground">Jakarta, Indonesia</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}