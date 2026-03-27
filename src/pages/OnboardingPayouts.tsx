import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Landmark, ShieldCheck, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";

const usStates = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
  "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
  "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
  "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
  "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
  "New Hampshire", "New Jersey", "New Mexico", "New York",
  "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon",
  "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
  "West Virginia", "Wisconsin", "Wyoming",
];

const steps = [
  { label: "Identity" },
  { label: "Address & Payouts" },
  { label: "Review" },
];

export default function OnboardingPayouts() {
  const navigate = useNavigate();
  const [street, setStreet] = useState("");
  const [aptUnit, setAptUnit] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("United States");
  const [stateSearch, setStateSearch] = useState("");
  const [stateOpen, setStateOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!street.trim() || !city.trim() || !state || !zip.trim()) {
      toast.error("Please fill in all required address fields.");
      return;
    }

    setSaving(true);
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        toast.error("You must be signed in.");
        setSaving(false);
        return;
      }

      const { error } = await supabase.from("creator_profiles").update({
        street_address: street.trim(),
        apt_unit: aptUnit.trim() || null,
        city: city.trim(),
        state,
        zip_code: zip.trim(),
        country,
      }).eq("user_id", user.id);

      if (error) {
        console.error("Address save error:", error);
        toast.error("Failed to save address. Please try again.");
        setSaving(false);
        return;
      }

      toast.success("Address saved!");
      navigate("/dashboard/creator");
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("Something went wrong.");
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8 sm:py-12">
        {/* Title & Progress */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Creator Onboarding</h1>
          <p className="text-sm text-muted-foreground mt-1">Step 2 of 3</p>
          <Progress value={66} className="mt-4 h-2 max-w-md mx-auto" />
        </div>

        {/* Steps */}
        <div className="flex justify-center gap-2 sm:gap-4 mb-8 flex-wrap">
          {steps.map((step, i) => (
            <div
              key={step.label}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                i === 1
                  ? "bg-primary text-primary-foreground"
                  : i < 1
                  ? "bg-primary/20 text-primary"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <span className="hidden sm:inline">{step.label}</span>
              <span className="sm:hidden">{step.label.slice(0, 3)}</span>
            </div>
          ))}
        </div>

        {/* Security Notice */}
        <div className="flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-xl p-4 mb-8 max-w-2xl mx-auto">
          <Shield className="h-5 w-5 text-primary shrink-0" />
          <p className="text-sm text-muted-foreground">
            Your address is kept private and used only for payout verification and compliance.
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-8">
          {/* Residential Address Card */}
          <section className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold text-foreground">Residential Address</h2>
              </div>
              <p className="text-sm text-muted-foreground">
                Your legal residential address for payout and tax purposes.
              </p>
            </div>

            <div className="space-y-4">
              {/* Country */}
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={country}
                  className="h-12 rounded-xl bg-muted"
                  disabled
                />
                <p className="text-xs text-muted-foreground">
                  Only US addresses are supported at this time.
                </p>
              </div>

              {/* Street Address */}
              <div className="space-y-2">
                <Label htmlFor="street">Street Address *</Label>
                <Input
                  id="street"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="123 Main St"
                  className="h-12 rounded-xl"
                  required
                />
              </div>

              {/* Apt / Unit */}
              <div className="space-y-2">
                <Label htmlFor="aptUnit">Apt / Suite / Unit</Label>
                <Input
                  id="aptUnit"
                  value={aptUnit}
                  onChange={(e) => setAptUnit(e.target.value)}
                  placeholder="Apt 4B (optional)"
                  className="h-12 rounded-xl"
                />
              </div>

              {/* City */}
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Los Angeles"
                  className="h-12 rounded-xl"
                  required
                />
              </div>

              {/* State + Zip */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* State - searchable dropdown */}
                <div className="space-y-2 relative">
                  <Label>State *</Label>
                  <div
                    className="flex h-12 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm cursor-pointer items-center justify-between focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
                    onClick={() => setStateOpen(!stateOpen)}
                  >
                    <span className={state ? "text-foreground" : "text-muted-foreground"}>
                      {state || "Select state"}
                    </span>
                    <svg className={`h-4 w-4 text-muted-foreground transition-transform ${stateOpen ? "rotate-180" : ""}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                  </div>
                  {stateOpen && (
                    <div className="absolute z-50 mt-1 w-full bg-card border border-border rounded-xl shadow-lg max-h-60 overflow-hidden">
                      <div className="p-2 border-b border-border">
                        <Input
                          placeholder="Search states..."
                          value={stateSearch}
                          onChange={(e) => setStateSearch(e.target.value)}
                          className="h-9 rounded-lg"
                          autoFocus
                        />
                      </div>
                      <div className="overflow-y-auto max-h-48">
                        {usStates
                          .filter((s) => s.toLowerCase().includes(stateSearch.toLowerCase()))
                          .map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => { setState(s); setStateOpen(false); setStateSearch(""); }}
                              className={`w-full text-left px-3 py-2 text-sm hover:bg-primary/10 transition-colors ${
                                state === s ? "bg-primary/5 text-primary font-medium" : "text-foreground"
                              }`}
                            >
                              {s}
                            </button>
                          ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Zip Code */}
                <div className="space-y-2">
                  <Label htmlFor="zip">Zip Code *</Label>
                  <Input
                    id="zip"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    placeholder="90001"
                    className="h-12 rounded-xl"
                    maxLength={10}
                    required
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Bank Account Card */}
          <section className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Landmark className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold text-foreground">Bank Account</h2>
              </div>
              <p className="text-sm text-muted-foreground">
                Connect your bank account to receive payouts. Your details are encrypted and securely stored.
              </p>
            </div>

            <Button
              disabled
              className="w-full h-12 rounded-xl font-semibold text-base gap-2"
            >
              <Landmark className="h-4 w-4" />
              Setup Bank Account Details
            </Button>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
              Bank account setup will be available soon. You can complete this step later.
            </div>
          </section>

          {/* Actions */}
          <div className="flex justify-between items-center pb-8">
            <Button variant="ghost" className="gap-2 text-muted-foreground" asChild>
              <Link to="/onboarding-identity">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Link>
            </Button>
            <Button
              className="rounded-xl font-semibold px-8"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save & Continue"}
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
