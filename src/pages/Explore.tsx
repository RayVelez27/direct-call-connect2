import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  Star,
  Play,
  Phone,
  Clock,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Home,
  Video,
  Camera,
  MessageSquareHeart,
  Drama,
  Sparkles,
  Users,
  Flame,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";

const categories = [
  { icon: Video, label: "Custom Videos" },
  { icon: Phone, label: "Live Calls" },
  { icon: MessageSquareHeart, label: "Sexting" },
  { icon: Drama, label: "Roleplay" },
  { icon: Camera, label: "Photos & Content" },
  { icon: Users, label: "Girlfriend Experience" },
  { icon: Sparkles, label: "Fantasy & Fetish" },
];

const serviceTypes = [
  { icon: Video, label: "Custom Videos" },
  { icon: Phone, label: "Video Calls" },
  { icon: MessageSquareHeart, label: "Sexting" },
  { icon: Drama, label: "Roleplay" },
  { icon: Flame, label: "Exclusive 1-on-1" },
];

const consultants = [
  {
    name: "Bella V.",
    badge: "TOP RATED",
    badgeColor: "bg-amber-100 text-amber-800",
    description: "I will create a custom fantasy video tailored to your deepest desires",
    rating: 5.0,
    reviews: "1.2k",
    tag: "OFFERS CALLS",
    tagIcon: Phone,
    price: "$8.50/min",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=300&fit=crop",
    hasIntro: true,
  },
  {
    name: "Luna S.",
    badge: "PRO VETTED",
    badgeColor: "bg-blue-100 text-blue-800",
    description: "I will provide an intimate girlfriend experience with personalized attention",
    rating: 4.9,
    reviews: "438",
    tag: "ONLINE NOW",
    tagIcon: null,
    price: "$12.00/min",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
    hasIntro: false,
  },
  {
    name: "Jade M.",
    badge: "LEVEL 2",
    badgeColor: "bg-emerald-100 text-emerald-800",
    description: "I will bring your wildest roleplay scenarios to life with creative storytelling",
    rating: 4.8,
    reviews: "2.1k",
    tag: "FAST RESPONSE",
    tagIcon: Clock,
    price: "$5.50/min",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=300&fit=crop",
    hasIntro: false,
  },
  {
    name: "Scarlett R.",
    badge: "TOP RATED",
    badgeColor: "bg-amber-100 text-amber-800",
    description: "I will offer exclusive live sessions with full personalization and privacy",
    rating: 5.0,
    reviews: "89",
    tag: "ONLINE NOW",
    tagIcon: null,
    price: "$15.00/min",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=300&fit=crop",
    isAd: true,
  },
];

export default function Explore() {
  const [activeCategory, setActiveCategory] = useState("Custom Videos");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const toggleFavorite = (name: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Categories Bar */}
      <div className="border-b border-border bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6 overflow-x-auto py-3" style={{ scrollbarWidth: "none" }}>
            {categories.map((cat) => (
              <button
                key={cat.label}
                onClick={() => setActiveCategory(cat.label)}
                className={`flex items-center gap-2 text-sm whitespace-nowrap pb-1 border-b-2 transition-colors ${
                  activeCategory === cat.label
                    ? "border-primary text-primary font-semibold"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <cat.icon className="h-4 w-4" />
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-foreground transition-colors"><Home className="h-4 w-4" /></Link>
          <ChevronRight className="h-3 w-3" />
          <span>Services</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">Custom Videos</span>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Custom Videos</h1>
          <p className="text-muted-foreground max-w-2xl">
            Connect with verified creators for personalized, made-to-order video experiences. Private, safe, and tailored to your desires.
          </p>
          <button className="mt-4 flex items-center gap-2 text-primary font-medium text-sm hover:underline">
            <Play className="h-4 w-4" /> How Plezyy Works
          </button>
        </div>

        {/* Service Types Slider */}
        <div className="mb-8">
          <p className="text-sm font-medium text-muted-foreground mb-3">Select service type</p>
          <div className="flex items-center gap-3">
            <div className="flex gap-3 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
              {serviceTypes.map((s) => (
                <button
                  key={s.label}
                  className="flex flex-col items-center gap-2 px-6 py-4 rounded-xl border border-border hover:border-primary hover:bg-accent transition-all min-w-[100px] group"
                >
                  <s.icon className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                  <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground whitespace-nowrap">
                    {s.label}
                  </span>
                </button>
              ))}
            </div>
            <div className="flex gap-1 ml-2">
              <button className="p-1.5 rounded-full border border-border hover:bg-accent transition-colors">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button className="p-1.5 rounded-full border border-border hover:bg-accent transition-colors">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-6 text-sm">
          {["Service options", "Creator details", "Budget", "Response time"].map((filter) => (
            <button
              key={filter}
              className="flex items-center gap-1 px-4 py-2 rounded-full border border-border hover:bg-accent transition-colors"
            >
              {filter} <ChevronDown className="h-3 w-3" />
            </button>
          ))}
        </div>

        {/* Toggle Bar */}
        <div className="flex items-center gap-4 mb-6">
          <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium">
            Pro creators
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-border text-sm text-muted-foreground hover:bg-accent transition-colors">
            Available now
          </button>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">12,430+</span> creators available
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            Sort by:
            <button className="flex items-center gap-1 font-medium text-foreground">
              Best selling <ChevronDown className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Creator Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {consultants.map((c) => (
            <div
              key={c.name}
              className="group rounded-2xl border border-border bg-card overflow-hidden hover:shadow-lg transition-shadow cursor-pointer relative"
            >
              {/* Favorite */}
              <button
                onClick={() => toggleFavorite(c.name)}
                className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-background/80 hover:bg-background transition-colors"
              >
                <Heart
                  className={`h-4 w-4 ${favorites.has(c.name) ? "fill-red-500 text-red-500" : "text-muted-foreground"}`}
                />
              </button>

              {/* Image */}
              <div className="relative overflow-hidden">
                <img
                  src={c.image}
                  alt={c.name}
                  className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {c.hasIntro && (
                  <button className="absolute bottom-3 left-3 flex items-center gap-1 px-3 py-1 rounded-full bg-background/90 text-xs font-medium">
                    <Play className="h-3 w-3" /> Intro
                  </button>
                )}
                {c.isAd && (
                  <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-muted/80 text-[10px] text-muted-foreground">
                    Sponsored
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-sm">{c.name}</span>
                  <Badge variant="secondary" className={`text-[10px] px-1.5 py-0 ${c.badgeColor}`}>
                    {c.badge}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground leading-snug mb-3 line-clamp-2">
                  {c.description}
                </p>
                <div className="flex items-center gap-1 text-sm mb-3">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-semibold">{c.rating}</span>
                  <span className="text-muted-foreground">({c.reviews})</span>
                </div>
                <div className="flex items-center justify-between border-t border-border pt-3">
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    {c.tagIcon && <c.tagIcon className="h-3 w-3" />}
                    {!c.tagIcon && <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />}
                    {c.tag}
                  </span>
                  <div className="text-right">
                    <span className="text-[10px] text-muted-foreground">From</span>
                    <p className="font-bold text-sm">{c.price}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 mb-12">
          <button className="p-2 rounded-full border border-border hover:bg-accent transition-colors">
            <ChevronLeft className="h-4 w-4" />
          </button>
          {[1, 2, 3].map((p) => (
            <button
              key={p}
              className={`w-9 h-9 rounded-full text-sm font-medium transition-colors ${
                p === 1 ? "bg-primary text-primary-foreground" : "hover:bg-accent"
              }`}
            >
              {p}
            </button>
          ))}
          <span className="text-muted-foreground">...</span>
          <button className="w-9 h-9 rounded-full text-sm font-medium hover:bg-accent transition-colors">10</button>
          <button className="p-2 rounded-full border border-border hover:bg-accent transition-colors">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="h-4 w-4 text-primary" />
            <span className="font-semibold text-foreground">Plezyy</span>
            <span>© Plezyy Ltd. 2024</span>
          </div>
          <div className="flex items-center gap-4 text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors" aria-label="TikTok">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.75a8.18 8.18 0 004.76 1.52V6.84a4.84 4.84 0 01-1-.15z"/></svg>
            </a>
            <a href="#" className="hover:text-foreground transition-colors" aria-label="Facebook">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="#" className="hover:text-foreground transition-colors" aria-label="Instagram">
              <Camera className="h-4 w-4" />
            </a>
            <a href="#" className="hover:text-foreground transition-colors" aria-label="LinkedIn">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
