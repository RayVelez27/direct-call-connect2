import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, Landmark, ChevronDown, Infinity, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import serviceCategories from "@/data/serviceCategories";
import { RichTextEditor } from "@/components/ui/rich-text-editor";

const durationPresets = [
  { value: "15 min", label: "15 minutes" },
  { value: "30 min", label: "30 minutes" },
  { value: "45 min", label: "45 minutes" },
  { value: "1 hour", label: "1 hour" },
  { value: "1.5 hours", label: "1.5 hours" },
  { value: "2 hours", label: "2 hours" },
  { value: "3 hours", label: "3 hours" },
];

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
  const [durationMode, setDurationMode] = useState<"preset" | "custom" | "unlimited">("preset");
  const [duration, setDuration] = useState("");
  const [customDurationValue, setCustomDurationValue] = useState("");
  const [customDurationUnit, setCustomDurationUnit] = useState("min");
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
                <Label>Description *</Label>
                <RichTextEditor
                  value={description}
                  onChange={setDescription}
                  placeholder="Describe what clients get with this service..."
                  maxLength={1000}
                  minHeight="120px"
                />
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

              <div className="space-y-3">
                <Label>Duration</Label>
                {/* Mode selector */}
                <div className="grid grid-cols-3 gap-2">
                  {([
                    { mode: "preset" as const, label: "Preset", icon: Clock },
                    { mode: "custom" as const, label: "Custom", icon: Clock },
                    { mode: "unlimited" as const, label: "Unlimited", icon: Infinity },
                  ]).map(({ mode, label, icon: Icon }) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => {
                        setDurationMode(mode);
                        if (mode === "unlimited") setDuration("Unlimited");
                        else if (mode === "preset") setDuration("");
                        else setDuration("");
                      }}
                      className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors border ${
                        durationMode === mode
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-card text-foreground border-border hover:border-primary/50"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </button>
                  ))}
                </div>

                {/* Preset dropdown */}
                {durationMode === "preset" && (
                  <div className="relative">
                    <select
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full h-12 rounded-xl border border-border bg-card text-foreground px-4 pr-10 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    >
                      <option value="">Select duration...</option>
                      {durationPresets.map((p) => (
                        <option key={p.value} value={p.value}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                )}

                {/* Custom time input */}
                {durationMode === "custom" && (
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      min="1"
                      value={customDurationValue}
                      onChange={(e) => {
                        setCustomDurationValue(e.target.value);
                        if (e.target.value) setDuration(`${e.target.value} ${customDurationUnit}`);
                        else setDuration("");
                      }}
                      placeholder="Enter amount"
                      className="h-12 rounded-xl flex-1"
                    />
                    <div className="relative">
                      <select
                        value={customDurationUnit}
                        onChange={(e) => {
                          setCustomDurationUnit(e.target.value);
                          if (customDurationValue) setDuration(`${customDurationValue} ${e.target.value}`);
                        }}
                        className="h-12 rounded-xl border border-border bg-card text-foreground px-4 pr-9 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                      >
                        <option value="min">Minutes</option>
                        <option value="hours">Hours</option>
                        <option value="days">Days</option>
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>
                )}

                {/* Unlimited indicator */}
                {durationMode === "unlimited" && (
                  <div className="flex items-center gap-2 h-12 px-4 rounded-xl border border-border bg-muted/50 text-sm text-muted-foreground">
                    <Infinity className="h-4 w-4" />
                    No time limit — session runs until complete
                  </div>
                )}
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
                    <RichTextEditor
                      value={tier.description}
                      onChange={(val) => updateTier(index, "description", val)}
                      placeholder="Describe what this tier includes..."
                      maxLength={500}
                      minHeight="80px"
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
