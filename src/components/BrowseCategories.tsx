import { useState } from "react";
import { Link } from "react-router-dom";
import { Film, MessageSquare, Camera } from "lucide-react";

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
  {
    name: "Alexis R.",
    tag: "Custom Videos",
    rating: "★★★★★",
    reviews: 312,
    price: "From $25",
    icon: Film,
    bg: "bg-[#EBF1FF] dark:bg-[#4180FB]/20",
    color: "text-[#4180FB] dark:text-[#7AAFFD]",
  },
  {
    name: "Jordan M.",
    tag: "Live Chat",
    rating: "★★★★★",
    reviews: 198,
    price: "From $15 / 15 min",
    icon: MessageSquare,
    bg: "bg-[#D6E2FF] dark:bg-[#4180FB]/30",
    color: "text-[#1E4FBF] dark:text-[#A8C4FF]",
  },
  {
    name: "Taylor K.",
    tag: "Photo Sets",
    rating: "★★★★☆",
    reviews: 87,
    price: "From $40",
    icon: Camera,
    bg: "bg-[#F0F5FF] dark:bg-[#4180FB]/15",
    color: "text-[#4180FB] dark:text-[#7AAFFD]",
  },
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
          {creators.map((c) => {
            const Icon = c.icon;
            return (
              <Link
                key={c.name}
                to="/discovery"
                className="border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden bg-white dark:bg-gray-900 hover:shadow-lg transition-shadow"
              >
                <div className={`h-28 flex items-center justify-center ${c.bg}`}>
                  <Icon className={`w-12 h-12 ${c.color}`} />
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
            );
          })}
        </div>
      </div>
    </section>
  );
}
