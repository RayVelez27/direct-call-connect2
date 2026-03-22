import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";

import CtaBanner from "@/components/CtaBanner";
import ExpertMatching from "@/components/ExpertMatching";

import MakeItHappen from "@/components/MakeItHappen";
import PlezyyPro from "@/components/PlezyyPro";
import FaqSection from "@/components/FaqSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar />
      <main>
        <Hero />

        <CtaBanner />
        <ExpertMatching />

        <MakeItHappen />
        <PlezyyPro />
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
