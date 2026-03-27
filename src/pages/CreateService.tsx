import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ArrowLeft, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import serviceCategories from "@/data/serviceCategories";

export default function CreateService() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const filtered = search.trim()
    ? serviceCategories
        .map((cat) => ({
          ...cat,
          services: cat.services.filter(
            (s) =>
              s.name.toLowerCase().includes(search.toLowerCase()) ||
              s.description.toLowerCase().includes(search.toLowerCase())
          ),
        }))
        .filter((cat) => cat.services.length > 0)
    : serviceCategories;

  const selectedService = serviceCategories
    .flatMap((c) => c.services)
    .find((s) => s.id === selectedId);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8 sm:py-12">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Create a Service</h1>
          <p className="text-sm text-muted-foreground mt-2 max-w-lg mx-auto">
            Pick a service template to get started. You'll customize the details, pricing, and rules next.
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-md mx-auto mb-10">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search services..."
            className="pl-10 h-11 rounded-xl"
          />
        </div>

        {/* Categories */}
        <div className="space-y-10">
          {filtered.map((category) => (
            <section key={category.heading}>
              <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <span>{category.emoji}</span>
                {category.heading}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {category.services.map((service) => {
                  const isSelected = selectedId === service.id;
                  return (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => setSelectedId(isSelected ? null : service.id)}
                      className={`relative text-left p-4 rounded-xl border transition-all duration-150 group ${
                        isSelected
                          ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                          : "border-border bg-card hover:border-primary/40 hover:shadow-sm"
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-3 right-3 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                          <Check className="h-3 w-3 text-primary-foreground" />
                        </div>
                      )}
                      <h3 className="font-semibold text-foreground text-sm pr-6">{service.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed line-clamp-2">
                        {service.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </section>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No services match your search.</p>
            </div>
          )}
        </div>

        {/* Sticky bottom bar */}
        <div className="sticky bottom-0 bg-background/90 backdrop-blur-sm border-t border-border mt-10 -mx-4 px-4 py-4 flex justify-between items-center">
          <Button variant="ghost" className="gap-2 text-muted-foreground" asChild>
            <Link to="/onboarding">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            {selectedService && (
              <span className="text-sm text-muted-foreground hidden sm:block">
                Selected: <span className="font-medium text-foreground">{selectedService.name}</span>
              </span>
            )}
            <Button
              className="rounded-xl font-semibold px-6 gap-2"
              disabled={!selectedId}
              onClick={() => navigate(`/configure-service?templateId=${selectedId}`)}
            >
              <Sparkles className="h-4 w-4" />
              Configure Service
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
