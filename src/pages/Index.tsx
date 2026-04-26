import Navbar from "@/components/Navbar";
import HomeHero from "@/components/HomeHero";
import StatsStrip from "@/components/StatsStrip";
import BrowseCategories from "@/components/BrowseCategories";
import HowItWorksSection from "@/components/HowItWorksSection";
import StartEarningCta from "@/components/StartEarningCta";
import TrustStrip from "@/components/TrustStrip";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar />
      <main>
        <HomeHero />
        <StatsStrip />
        <BrowseCategories />
        <HowItWorksSection />
        <StartEarningCta />
        <TrustStrip />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
