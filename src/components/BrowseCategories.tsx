import { useState } from "react";
import { Link } from "react-router-dom";

import creator1 from "@/assets/home-hero-pics/Gemini_Generated_Image_b4z5vyb4z5vyb4z5.png";
import creator2 from "@/assets/home-hero-pics/Gemini_Generated_Image_bfdhwebfdhwebfdh.png";
import creator3 from "@/assets/home-hero-pics/Gemini_Generated_Image_gtj0uygtj0uygtj0.png";
import creator4 from "@/assets/home-hero-pics/Gemini_Generated_Image_hmpux8hmpux8hmpu.png";
import creator5 from "@/assets/home-hero-pics/Gemini_Generated_Image_lxpjvclxpjvclxpj.png";
import creator6 from "@/assets/home-hero-pics/Gemini_Generated_Image_my91wmy91wmy91wm.png";
import creator7 from "@/assets/home-hero-pics/Gemini_Generated_Image_xf03d4xf03d4xf03.png";
import creator8 from "@/assets/home-hero-pics/unnamed (1) (1).jpg";
import creator9 from "@/assets/home-hero-pics/unnamed (3) (1).jpg";
import creator10 from "@/assets/home-hero-pics/unnamed (2) (1).jpg";
import creator11 from "@/assets/home-hero-pics/Screen Shot 2026-03-26 at 3.46.51 PM.png";
import creator12 from "@/assets/home-hero-pics/Screen Shot 2026-03-26 at 3.48.25 PM (1).png";

const categories = [
  "All",
  "Custom videos",
  "Live chat",
  "Shoutouts",
  "Coaching",
  "Photo sets",
  "Advice",
];

const creators = [
  { name: "Alexis R.", tag: "Custom Videos", rating: "★★★★★", reviews: 312, price: "From $25", image: creator1 },
  { name: "Jordan M.", tag: "Live Chat", rating: "★★★★★", reviews: 198, price: "From $15 / 15 min", image: creator2 },
  { name: "Taylor K.", tag: "Photo Sets", rating: "★★★★☆", reviews: 87, price: "From $40", image: creator3 },
  { name: "Mia S.", tag: "Shoutouts", rating: "★★★★★", reviews: 421, price: "From $20", image: creator4 },
  { name: "Riley B.", tag: "Coaching", rating: "★★★★★", reviews: 156, price: "From $60 / hr", image: creator5 },
  { name: "Sienna L.", tag: "Advice", rating: "★★★★☆", reviews: 73, price: "From $30", image: creator6 },
  { name: "Camila V.", tag: "Custom Videos", rating: "★★★★★", reviews: 264, price: "From $35", image: creator7 },
  { name: "Harper J.", tag: "Live Chat", rating: "★★★★★", reviews: 519, price: "From $12 / 15 min", image: creator8 },
  { name: "Nova P.", tag: "Photo Sets", rating: "★★★★★", reviews: 142, price: "From $45", image: creator9 },
  { name: "Avery T.", tag: "Coaching", rating: "★★★★★", reviews: 211, price: "From $50 / hr", image: creator10 },
  { name: "Quinn D.", tag: "Shoutouts", rating: "★★★★☆", reviews: 96, price: "From $18", image: creator11 },
  { name: "Eden W.", tag: "Custom Videos", rating: "★★★★★", reviews: 378, price: "From $30", image: creator12 },
];

export default function BrowseCategories() {
  const [active, setActive] = useState("All");

  return (
    <section className="bg-white dark:bg-gray-900 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            Browse by category
          </h2>
          <Link
            to="/discovery"
            className="text-sm font-semibold text-[#4180FB] dark:text-[#7AAFFD] hover:underline"
          >
            See all
          </Link>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`text-sm px-4 py-1.5 rounded-full border transition-colors ${
                active === cat
                  ? "bg-[#4180FB] dark:bg-[#5A96FC] text-white border-[#4180FB] dark:border-[#5A96FC]"
                  : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-[#4180FB] hover:text-[#4180FB] dark:hover:border-[#7AAFFD] dark:hover:text-[#7AAFFD]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {creators.map((c) => (
            <Link
              key={c.name}
              to="/discovery"
              className="border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden bg-white dark:bg-gray-900 hover:shadow-lg transition-shadow group"
            >
              <div className="aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-800">
                <img
                  src={c.image}
                  alt={c.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4">
                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                  {c.name}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 mb-2">
                  {c.tag}
                </div>
                <div className="flex items-center gap-1 text-xs text-amber-500 mb-1">
                  <span>{c.rating}</span>
                  <span className="text-gray-400 dark:text-gray-500">({c.reviews})</span>
                </div>
                <div className="text-sm font-semibold text-[#1E4FBF] dark:text-[#A8C4FF]">
                  {c.price}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
