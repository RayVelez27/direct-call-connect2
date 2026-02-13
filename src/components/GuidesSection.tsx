import { ArrowRight } from "lucide-react";

const guides = [
  {
    title: "How to choose the right creator",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=400&fit=crop",
  },
  {
    title: "Getting the most from live sessions",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=400&fit=crop",
  },
  {
    title: "Your privacy & safety guide",
    image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=400&fit=crop",
  },
];

export default function GuidesSection() {
  return (
    <section className="py-20 bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground font-['Playfair_Display']">
            Guides to help you grow
          </h2>
          <button className="text-primary font-semibold hover:underline flex items-center gap-1">
            See more guides <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {guides.map((guide) => (
            <div
              key={guide.title}
              className="rounded-2xl bg-card border border-border p-6 hover:shadow-md transition-shadow cursor-pointer"
            >
              <img src={guide.image} alt={guide.title} className="h-40 w-full object-cover rounded-xl mb-4" />
              <h3 className="text-lg font-semibold text-foreground">{guide.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
