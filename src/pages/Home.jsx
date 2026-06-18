import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import Navbar from "@/components/reclo/Navbar";
import Footer from "@/components/reclo/Footer";
import HeroSection from "@/components/reclo/HeroSection";
import FeaturedSection from "@/components/reclo/FeaturedSection";
import WhyRecloSection from "@/components/reclo/WhyRecloSection";
import TestimonialSection from "@/components/reclo/TestimonialSection";
import SizeRecommender from "@/components/reclo/SizeRecommender";
import { Loader2 } from "lucide-react";

const HERO_IMAGE = "https://media.base44.com/images/public/6a3275e1ba274d08cab626cd/bc7d01dcb_generated_c3990f5e.png";

export default function Home() {
  const [kebayaList, setKebayaList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Kebaya.filter({ is_featured: true })
      .then(setKebayaList)
      .catch(() => base44.entities.Kebaya.list("-created_date", 6).then(setKebayaList))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <HeroSection heroImage={HERO_IMAGE} />
      {kebayaList.length > 0 && <FeaturedSection kebayaList={kebayaList} />}
      <WhyRecloSection />
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <SizeRecommender />
        </div>
      </section>
      <TestimonialSection />
      <Footer />
    </div>
  );
}