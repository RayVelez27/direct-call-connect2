import Navbar from "@/components/Navbar";
import FaqSection from "@/components/FaqSection";
import Footer from "@/components/Footer";

export default function Faq() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar />
      <main className="pt-12 pb-4">
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
}
