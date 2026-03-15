import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProvidersSection from "@/components/ProvidersSection";
import CtaBanner from "@/components/CtaBanner";
import PlezyyPro from "@/components/PlezyyPro";
import FaqSection from "@/components/FaqSection";
import ExpertMatching from "@/components/ExpertMatching";

import GuidesSection from "@/components/GuidesSection";
import MakeItHappen from "@/components/MakeItHappen";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <ProvidersSection />
        <CtaBanner />
        <ExpertMatching />
        
        <GuidesSection />
        <MakeItHappen />
        <PlezyyPro />
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
