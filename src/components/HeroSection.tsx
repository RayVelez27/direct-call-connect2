import { useState } from "react";
import { Search } from "lucide-react";
import SearchOverlay from "./SearchOverlay";
import heroBg from "@/assets/hero-bg.jpg";
import categoriesData from "@/data/categories.json";

const popularSection = categoriesData.find((s) => s.heading === "Popular");
const popularTags = popularSection
  ? popularSection.groups.flatMap((g) => g.items).slice(0, 5).map((i) => i.name)
  : [];

export default function HeroSection() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <header className="relative min-h-[600px] flex items-center">
        <div className="absolute inset-0 z-0">
          <img alt="Hero Background" className="w-full h-full object-cover" src={heroBg} />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-20">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-8 text-white">
              The Online Marketplace for Virtual Adult Services
            </h1>
            <div className="relative max-w-2xl mb-8">
              <div
                className="bg-white rounded-lg p-1 flex items-center shadow-2xl cursor-pointer"
                onClick={() => setSearchOpen(true)}
              >
                <div className="flex-1 flex items-center px-4 gap-3">
                  <input
                    className="w-full border-none focus:ring-0 bg-transparent text-slate-900 placeholder-slate-400 text-lg py-3 outline-none pointer-events-none"
                    placeholder="Search creators, services, fantasies..."
                    type="text"
                    readOnly
                  />
                </div>
                <button className="bg-slate-900 hover:bg-black text-white p-3 rounded-lg transition-all flex items-center justify-center">
                  <Search className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
              <span className="text-white font-semibold whitespace-nowrap mr-2">Popular:</span>
              {popularTags.map((tag) => (
                <button
                  key={tag}
                  className="px-5 py-2 rounded-full border border-white text-white text-sm font-medium hover:bg-white hover:text-black transition-all whitespace-nowrap shrink-0"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
