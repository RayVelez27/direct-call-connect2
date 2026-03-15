import Navbar from "@/components/Navbar";
import SignInHero from "@/components/SignInHero";
import { DiscoveryContent } from "@/pages/Discovery";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <SignInHero />
        <DiscoveryContent />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
