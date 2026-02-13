import { useState, useRef, useEffect, useMemo } from "react";
import { X } from "lucide-react";
import categoriesData from "@/data/categories.json";

// Flatten all category items for search suggestions and tags
const allCategoryItems = categoriesData.flatMap((section) =>
  section.groups.flatMap((group) =>
    group.items.map((item) => ({
      name: item.name,
      count: item.count,
      section: section.heading,
      group: group.title,
    }))
  )
);

// Deduplicate by name
const uniqueItems = Array.from(
  new Map(allCategoryItems.map((i) => [i.name, i])).values()
);

// Pick a curated set of tags to display
const tagCategories = uniqueItems.slice(0, 24).map((i) => i.name);

const arcImages = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1502767089025-6572583495f9?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop',
];

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

function ArcGallery() {
  const [dims, setDims] = useState({ radius: 480, cardSize: 120 });

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 640) setDims({ radius: 260, cardSize: 70 });
      else if (w < 1024) setDims({ radius: 360, cardSize: 90 });
      else setDims({ radius: 480, cardSize: 120 });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const count = Math.max(arcImages.length, 2);
  const startAngle = 20;
  const endAngle = 160;
  const step = (endAngle - startAngle) / (count - 1);

  return (
    <div className="absolute bottom-[30%] left-1/2 -translate-x-1/2 pointer-events-none" style={{ width: dims.radius * 2 + dims.cardSize, height: dims.radius + dims.cardSize }}>
      <div className="absolute bottom-0 left-1/2" style={{ width: 0, height: 0 }}>
        {arcImages.map((src, i) => {
          const angle = startAngle + step * i;
          const rad = (angle * Math.PI) / 180;
          const x = Math.cos(rad) * dims.radius;
          const y = Math.sin(rad) * dims.radius;
          return (
            <div
              key={i}
              className="absolute rounded-xl overflow-hidden shadow-lg"
              style={{
                width: dims.cardSize,
                height: dims.cardSize,
                left: x - dims.cardSize / 2,
                top: -y - dims.cardSize / 2,
                transform: `rotate(${90 - angle}deg)`,
                opacity: 0,
                animation: `arcCardIn 0.5s ease-out ${i * 0.06}s forwards`,
              }}
            >
              <img src={src} alt="" className="w-full h-full object-cover" />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [isFocus, setIsFocus] = useState(false);
  const [isType, setIsType] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        inputRef.current?.focus();
        setIsFocus(true);
      }, 100);
    } else {
      setIsFocus(false);
      setIsType(false);
      setQuery("");
    }
  }, [open]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  if (!open) return null;

  const stateClass = `${isFocus ? "is-focus" : ""} ${isType ? "is-type" : ""}`;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center transition-colors duration-700 overflow-hidden ${
        isFocus ? "bg-[#6078EA]" : "bg-[#EDEBEB]"
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Arc gallery behind content */}
      {isFocus && query.length === 0 && <ArcGallery />}

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-2 rounded-full text-white/80 hover:bg-white/10 transition-colors z-10"
      >
        <X className="h-6 w-6" />
      </button>

      <div className={`relative w-full max-w-md px-6 z-10 ${stateClass}`}>
        {/* Title container */}
        <div className="relative text-center overflow-hidden mb-10 h-20 flex flex-col items-center justify-center">
          <h1
            className="text-2xl md:text-3xl font-bold text-white transition-transform duration-300 absolute"
            style={{
              transform: isFocus ? "translateY(0)" : "translateY(-100%)",
              transitionDelay: "0.25s",
            }}
          >
            What are you looking for?
          </h1>
        </div>

        {/* Search field */}
        <div className="relative w-full h-12">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search services, consultants..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsType(e.target.value.length > 0);
            }}
            onFocus={() => setIsFocus(true)}
            className="w-full h-full px-5 pr-14 rounded-md border-0 bg-white text-[#4B4848] text-base shadow-[0px_8px_15px_rgba(75,72,72,0.1)] focus:shadow-[0px_9px_20px_rgba(75,72,72,0.3)] focus:outline-none transition-shadow duration-400"
          />

          {/* Icons container */}
          <div className="absolute top-3 right-3 w-8 h-8 overflow-hidden">
            {/* Search icon */}
            <div
              className="absolute top-1 left-1 w-[50%] h-[50%] rounded-full border-[3px] transition-all duration-400"
              style={{
                borderColor: "rgba(96,120,234,0.55)",
                opacity: query ? 0 : 1,
                transform: query ? "translateX(200%)" : "translateX(0)",
                transitionTimingFunction: "cubic-bezier(0.694, 0.048, 0.335, 1)",
              }}
            >
              <div
                className="absolute -bottom-[9px] -right-[2px] w-1 h-[10px] rounded-sm"
                style={{
                  backgroundColor: "rgba(96,120,234,0.55)",
                  transform: "rotate(-45deg)",
                }}
              />
            </div>

            {/* Close/loading icon */}
            <div
              className="absolute top-0.5 left-0.5 w-[75%] h-[75%] cursor-pointer transition-all duration-400"
              style={{
                opacity: query ? 1 : 0,
                transform: query ? "translateX(0)" : "translateX(-200%)",
                transitionTimingFunction: "cubic-bezier(0.694, 0.048, 0.335, 1)",
              }}
              onClick={() => {
                setQuery("");
                setIsType(false);
                inputRef.current?.focus();
              }}
            >
              <div
                className="absolute inset-0 rounded-full border-2 border-transparent"
                style={{
                  borderTopColor: isType ? "#6078EA" : "transparent",
                  borderLeftColor: isType ? "#6078EA" : "transparent",
                  borderBottomColor: isType ? "#6078EA" : "transparent",
                  animation: isType ? "spin 0.85s infinite linear" : "none",
                }}
              />
              <div className="relative w-full h-full flex items-center justify-center">
                <div
                  className="absolute w-3 h-0.5 rounded-sm"
                  style={{
                    backgroundColor: "#6078EA",
                    transform: "rotate(45deg)",
                    animation: isType ? "searchColorShift 0.85s infinite" : "none",
                  }}
                />
                <div
                  className="absolute w-3 h-0.5 rounded-sm"
                  style={{
                    backgroundColor: "#6078EA",
                    transform: "rotate(-45deg)",
                    animation: isType ? "searchColorShift 0.85s infinite" : "none",
                    animationDelay: "0.2s",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Category tags */}
        {query.length === 0 && (
          <div className="mt-5 flex flex-wrap gap-2 justify-center max-w-lg mx-auto">
            {tagCategories.map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  setQuery(tag);
                  setIsType(true);
                }}
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/15 text-white/90 hover:bg-white/25 transition-colors backdrop-blur-sm border border-white/10"
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        {/* Category dropdown */}
        {query.length > 0 && (
          <div className="mt-2 bg-white rounded-lg shadow-xl overflow-hidden max-h-[320px] overflow-y-auto">
            {uniqueItems
              .filter((item) =>
                item.name.toLowerCase().includes(query.toLowerCase())
              )
              .slice(0, 12)
              .map((item) => (
                <button
                  key={item.name}
                  className="w-full flex items-center justify-between px-5 py-3 hover:bg-slate-100 transition-colors text-left"
                  onClick={() => {
                    setQuery(item.name);
                    setIsType(true);
                  }}
                >
                  <span className="text-[#4B4848] text-sm font-medium">{item.name}</span>
                  {item.count !== undefined && (
                    <span className="text-xs text-slate-400">{item.count.toLocaleString()}</span>
                  )}
                </button>
              ))}
            {uniqueItems.filter((item) =>
              item.name.toLowerCase().includes(query.toLowerCase())
            ).length === 0 && (
              <div className="px-5 py-4 text-sm text-slate-400 text-center">
                No categories found
              </div>
            )}
          </div>
        )}
      </div>

      {/* Arc gallery animation keyframes */}
      <style>{`
        @keyframes arcCardIn {
          from {
            opacity: 0;
            transform: rotate(0deg) scale(0.5);
          }
          to {
            opacity: 1;
            transform: rotate(var(--final-rotate, 0deg)) scale(1);
          }
        }
      `}</style>
    </div>
  );
}
