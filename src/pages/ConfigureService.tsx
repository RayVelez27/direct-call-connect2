import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import serviceCategories from "@/data/serviceCategories";

const deliveryMethods = [
  { value: "video_call", label: "Video Call" },
  { value: "phone_call", label: "Phone Call" },
  { value: "chat", label: "Chat / Messaging" },
  { value: "content_delivery", label: "Content Delivery" },
];

const defaultTierNames = ["Basic", "Standard", "Premium"];

interface ServiceTier {
  name: string;
  price: string;
  description: string;
  deliveryTime: string;
}

function emptyTier(index: number): ServiceTier {
  return {
    name: defaultTierNames[index] || `Tier ${index + 1}`,
    price: "",
    description: "",
    deliveryTime: "",
  };
}

export default function ConfigureService() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const templateId = Number(searchParams.get("templateId"));

  const template = serviceCategories
    .flatMap((c) => c.services)
    .find((s) => s.id === templateId);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("");
  const [duration, setDuration] = useState("");
  const [tiers, setTiers] = useState<ServiceTier[]>([emptyTier(0)]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!template) {
      toast.error("Invalid service template.");
      navigate("/create-service");
      return;
    }
    setTitle(template.name);
    setDescription(template.description);
  }, [template, navigate]);

  const updateTier = (index: number, field: keyof ServiceTier, value: string) => {
    setTiers((prev) =>
      prev.map((t, i) => (i === index ? { ...t, [field]: value } : t))
    );
  };

  const addTier = () => {
    if (tiers.length < 3) {
      setTiers((prev) => [...prev, emptyTier(prev.length)]);
    }
  };

  const removeTier = (index: number) => {
    if (tiers.length > 1) {
      setTiers((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Please enter a service title.");
      return;
    }
    if (!deliveryMethod) {
      toast.error("Please select a delivery method.");
      return;
    }
    const validTiers = tiers.filter((t) => t.name.trim() && t.price);
    if (validTiers.length === 0) {
      toast.error("Please add at least one tier with a name and price.");
      return;
    }

    setSaving(true);
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError || !user) {
        toast.error("You must be signed in.");
        setSaving(false);
        return;
      }

      const { error } = await supabase.from("creator_services").insert({
        creator_id: user.id,
        template_id: templateId,
        title: title.trim(),
        description: description.trim(),
        delivery_method: deliveryMethod,
        duration: duration.trim() || null,
        tiers: validTiers.map((t) => ({
          name: t.name.trim(),
          price: parseFloat(t.price),
          description: t.description.trim(),
          deliveryTime: t.deliveryTime.trim(),
        })),
      });

      if (error) {
        console.error("Service save error:", error);
        toast.error("Failed to save service. Please try again.");
        setSaving(false);
        return;
      }

      toast.success("Service created!");
      navigate("/dashboard/creator");
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("Something went wrong.");
      setSaving(false);
    }
  };

  if (!template) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-8 sm:py-12">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Configure Your Service
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Customize the details and set up your pricing tiers.
          </p>
        </div>

        <div className="space-y-8">
          {/* Service Details Card */}
          <section className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-bold text-foreground">Service Details</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Basic information about your service.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Service Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Virtual Date Night"
                  className="h-12 rounded-xl"
                  maxLength={80}
                />
                <p className="text-xs text-muted-foreground">{title.length}/80 characters</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what clients get with this service..."
                  className="rounded-xl min-h-[120px] resize-none"
                  maxLength={1000}
                />
                <p className="text-xs text-muted-foreground text-right">
                  {description.length}/1000
                </p>
              </div>

              <div className="space-y-2">
                <Label>Delivery Method *</Label>
                <div className="grid grid-cols-2 gap-3">
                  {deliveryMethods.map((m) => (
                    <button
                      key={m.value}
                      type="button"
                      onClick={() => setDeliveryMethod(m.value)}
                      className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors border ${
                        deliveryMethod === m.value
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-card text-foreground border-border hover:border-primary/50"
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="e.g. 30 min, 1 hour"
                  className="h-12 rounded-xl"
                />
              </div>
            </div>
          </section>

          {/* Pricing Tiers Card */}
          <section className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-foreground">Pricing Tiers</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Add up to 3 tiers with different pricing and inclusions.
                </p>
              </div>
              {tiers.length < 3 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-xl gap-1.5"
                  onClick={addTier}
                >
                  <Plus className="h-4 w-4" />
                  Add Tier
                </Button>
              )}
            </div>

            <div className="space-y-4">
              {tiers.map((tier, index) => (
                <div
                  key={index}
                  className="border border-border rounded-xl p-5 space-y-4 relative"
                >
                  {/* Tier header */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-primary">
                      Tier {index + 1}
                    </span>
                    {tiers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTier(index)}
                        className="text-muted-foreground hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Tier Name *</Label>
                      <Input
                        value={tier.name}
                        onChange={(e) => updateTier(index, "name", e.target.value)}
                        placeholder="e.g. Basic"
                        className="h-11 rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Price (USD) *</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                          $
                        </span>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={tier.price}
                          onChange={(e) => updateTier(index, "price", e.target.value)}
                          placeholder="0.00"
                          className="h-11 rounded-xl pl-7"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>What's Included</Label>
                    <Textarea
                      value={tier.description}
                      onChange={(e) =>
                        updateTier(index, "description", e.target.value)
                      }
                      placeholder="Describe what this tier includes..."
                      className="rounded-xl min-h-[80px] resize-none"
                      maxLength={500}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Delivery Time</Label>
                    <Input
                      value={tier.deliveryTime}
                      onChange={(e) =>
                        updateTier(index, "deliveryTime", e.target.value)
                      }
                      placeholder="e.g. 24 hours, 3 days"
                      className="h-11 rounded-xl"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Actions */}
          <div className="flex justify-between items-center pb-8">
            <Button variant="ghost" className="gap-2 text-muted-foreground" asChild>
              <Link to="/create-service">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Link>
            </Button>
            <Button
              className="rounded-xl font-semibold px-8"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Create Service"}
            </Button>
          </div>
        </div>
      </main>

      <footer className="border-t border-border py-6 mt-8">
        <p className="text-center text-xs text-muted-foreground">
          &copy; 2026 Plezyy Inc. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
