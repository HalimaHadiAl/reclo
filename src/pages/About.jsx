import React from "react";
import Navbar from "@/components/reclo/Navbar";
import Footer from "@/components/reclo/Footer";
import { motion } from "framer-motion";
import { Heart, Gem, Sparkles, Crown } from "lucide-react";

const ABOUT_IMAGE = "https://media.base44.com/images/public/6a3275e1ba274d08cab626cd/2cd8ace15_generated_898211fc.png";

const values = [
  {
    icon: Heart,
    title: "Kecantikan Tradisional",
    desc: "Setiap kebaya kami dipilih untuk menghormati keindahan tradisi Indonesia, dengan sentuhan modern yang elegan.",
  },
  {
    icon: Gem,
    title: "Kualitas Premium",
    desc: "Bahan berkualitas tinggi, detail renda yang halus, dan jahitan yang sempurna — hanya yang terbaik untuk Anda.",
  },
  {
    icon: Sparkles,
    title: "Momen Spesial",
    desc: "Wisuda, lamaran, pernikahan, atau kondangan — kami hadir untuk melengkapi setiap momen berharga Anda.",
  },
  {
    icon: Crown,
    title: "Eksklusif & Classy",
    desc: "Nuansa premium yang membuat Anda merasa istimewa. Elegant Traditional Wear dengan sentuhan modern.",
  },
];

export default function About() {
  return (
    <div className="bg-background min-h-screen">
      <Navbar />

      <section className="pt-28 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <p className="font-body text-xs tracking-[0.3em] uppercase text-primary font-semibold mb-4">
              Tentang Kami
            </p>
            <h1 className="font-display text-4xl md:text-6xl font-light tracking-wider text-foreground">
              Cerita RECLO
            </h1>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="aspect-[4/3] overflow-hidden"
            >
              <img
                src={ABOUT_IMAGE}
                alt="RECLO kebaya accessories and details"
                className="w-full h-full object-cover"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-3xl font-light tracking-wider text-foreground mb-6">
                Elegant Traditional Wear Rental dengan Nuansa Modern Premium
              </h2>
              <div className="space-y-4 font-body text-sm text-muted-foreground leading-relaxed">
                <p>
                  RECLO lahir dari kecintaan terhadap kebaya Indonesia — pakaian yang merepresentasikan 
                  keanggunan, kehalusan, dan kekuatan perempuan Indonesia. Kami percaya setiap perempuan 
                  berhak tampil memukau di momen spesialnya tanpa harus membeli kebaya mahal.
                </p>
                <p>
                  Logo RECLO menggambarkan siluet perempuan memakai kebaya — huruf "R" yang melengkung 
                  anggun, dihiasi elemen renda dan ornamen bunga yang melambangkan kecantikan dan kemewahan. 
                  Warna gold dan nuansa cream menciptakan kesan eksklusif yang timeless.
                </p>
                <p>
                  Dengan sistem Precision Fit berbasis berat badan dan Virtual Preview, kami menghilangkan 
                  keraguan dalam memilih kebaya. Anda bisa yakin bahwa kebaya yang Anda sewa akan pas 
                  dan sesuai dengan gaya Anda.
                </p>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="border border-border p-8 hover:border-primary/30 transition-colors"
              >
                <v.icon size={28} className="text-primary mb-4" />
                <h3 className="font-display text-xl font-medium tracking-wider text-foreground mb-3">
                  {v.title}
                </h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">
                  {v.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}