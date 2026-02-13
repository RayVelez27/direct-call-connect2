import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const popularServices = [
  { name: "Custom Fantasy Videos", accent: "bg-rose-800", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=300&fit=crop" },
  { name: "Intimate Live Calls", accent: "bg-pink-400", image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=300&fit=crop" },
  { name: "Sexting Sessions", accent: "bg-violet-400", image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=300&fit=crop" },
  { name: "Girlfriend Experience", accent: "bg-rose-400", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=300&fit=crop" },
  { name: "Roleplay Adventures", accent: "bg-purple-400", image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=300&fit=crop" },
  { name: "Custom Photo Sets", accent: "bg-amber-300", image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=300&fit=crop" },
  { name: "Companionship Chats", accent: "bg-sky-300", image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=300&fit=crop" },
  { name: "Fetish & Fantasy", accent: "bg-red-400", image: "https://images.unsplash.com/photo-1514315384763-ba401779410f?w=400&h=300&fit=crop" },
  { name: "Exclusive 1-on-1", accent: "bg-emerald-300", image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=300&fit=crop&q=80" },
  { name: "Audio Experiences", accent: "bg-teal-300", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=300&fit=crop" },
];

export default function ProvidersSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 300;
    scrollRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <section className="py-20 pb-8 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl md:text-4xl font-bold">Popular services</h2>
          <div className="flex gap-2">
            <button
              onClick={() => scroll("left")}
              className="p-2 rounded-full border border-border hover:bg-accent transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="p-2 rounded-full border border-border hover:bg-accent transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-4"
          style={{ scrollbarWidth: "none" }}
        >
          {popularServices.map((service) => (
            <div
              key={service.name}
              className="flex-shrink-0 w-[220px] md:w-[250px] rounded-2xl overflow-hidden cursor-pointer group bg-primary"
            >
              <div className="p-5 pb-3">
                <h3 className="text-white font-bold text-base leading-snug min-h-[48px]">
                  {service.name}
                </h3>
              </div>
              <div className="px-3 pb-3">
                <div className={`${service.accent} rounded-xl overflow-hidden`}>
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-[140px] object-cover rounded-lg group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
