import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield, ArrowLeft, Eye, EyeOff, Globe, Lock, QrCode, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import plezyyLogo from "@/assets/plezyy-logo.jpeg";
import categoriesData from "@/data/categories.json";

// Flatten categories for the picker
const allCategories: string[] = [];
categoriesData.forEach((section) => {
  section.groups.forEach((group) => {
    group.items.forEach((item) => {
      if (item.name && !allCategories.includes(item.name)) {
        allCategories.push(item.name);
      }
    });
  });
});

// Curated popular categories for quick selection
const popularCategories = [
  "MILF", "Ebony", "Latina", "Asian", "BBW", "Teen 18+", "Mature",
  "BDSM", "Dominatrix", "Foot Fetish", "Cosplay", "Squirt",
  "Big Tits", "Big Ass", "Anal", "Blonde", "Brunette", "Redhead",
  "Athletic", "Curvy", "Skinny", "Mistress", "Role Play", "Striptease",
];

const genderOptions = ["Female", "Male", "Non-binary", "Trans", "Prefer not to say"];
const sexualPreferences = ["Straight", "Bisexual", "Lesbian", "Gay", "Pansexual", "Other"];
const nationalities = [
  "American", "Argentine", "Australian", "Brazilian", "British", "Canadian",
  "Chilean", "Chinese", "Colombian", "Dutch", "Ecuadorian", "French",
  "German", "Indian", "Irish", "Italian", "Japanese", "Kenyan",
  "Mexican", "Peruvian", "Polish", "Romanian", "South African", "Spanish",
  "Sri Lankan", "Thai", "Turkish", "Ukrainian", "Uruguayan", "Venezuelan",
  "Vietnamese", "Other",
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [nationality, setNationality] = useState("");
  const [country, setCountry] = useState("");
  const [sexPref, setSexPref] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [bio, setBio] = useState("");
  const [tagline, setTagline] = useState("");
  const [visibility, setVisibility] = useState<"public" | "members">("public");
  const [categorySearch, setCategorySearch] = useState("");

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const filteredCategories = categorySearch
    ? allCategories.filter((c) => c.toLowerCase().includes(categorySearch.toLowerCase())).slice(0, 40)
    : popularCategories;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-primary/5 to-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border glass-effect">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <Link to="/">
              <img alt="Plezyy Logo" className="h-8 w-auto dark:invert" src={plezyyLogo} />
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
              Need help?
            </a>
            <Button variant="outline" size="sm" className="rounded-lg font-semibold">
              Save & Exit
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-8 sm:py-12">
        {/* Title & Progress */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Set Up Your Profile</h1>
          <p className="text-sm text-muted-foreground mt-1">Complete your creator profile to go live</p>
          <Progress value={50} className="mt-4 h-2 max-w-md mx-auto" />
        </div>

        {/* Security Notice */}
        <div className="flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-xl p-4 mb-8 max-w-2xl mx-auto">
          <Shield className="h-5 w-5 text-primary shrink-0" />
          <p className="text-sm text-muted-foreground">
            Your date of birth remains private and is never displayed publicly.
          </p>
        </div>

        {/* Form */}
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Basic Info Card */}
          <section className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-bold text-foreground">Basic Information</h2>
              <p className="text-sm text-muted-foreground mt-1">How you'll appear on Plezyy</p>
            </div>

            {/* Display Name */}
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your stage or display name"
                className="h-12 rounded-xl"
                maxLength={30}
              />
              <p className="text-xs text-muted-foreground">{displayName.length}/30 characters</p>
            </div>

            {/* Age / DOB */}
            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                id="dob"
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="h-12 rounded-xl"
              />
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <EyeOff className="h-3 w-3" /> Your DOB is private — only your age will be shown.
              </p>
            </div>

            {/* Gender */}
            <div className="space-y-3">
              <Label>Gender</Label>
              <div className="flex flex-wrap gap-2">
                {genderOptions.map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGender(g)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors border ${
                      gender === g
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card text-foreground border-border hover:border-primary/50"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Nationality */}
            <div className="space-y-2">
              <Label htmlFor="nationality">Nationality</Label>
              <select
                id="nationality"
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
                className="flex h-12 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Select nationality</option>
                {nationalities.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>

            {/* Country / Region */}
            <div className="space-y-2">
              <Label htmlFor="country">Country / Region</Label>
              <Input
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Where you're based"
                className="h-12 rounded-xl"
              />
            </div>

            {/* Sexual Preferences */}
            <div className="space-y-3">
              <Label>Sexual Preferences</Label>
              <div className="flex flex-wrap gap-2">
                {sexualPreferences.map((sp) => (
                  <button
                    key={sp}
                    type="button"
                    onClick={() => setSexPref(sp)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors border ${
                      sexPref === sp
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card text-foreground border-border hover:border-primary/50"
                    }`}
                  >
                    {sp}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Categories Card */}
          <section className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-bold text-foreground">Categories</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Select categories that describe your content (pick at least 3)
              </p>
            </div>

            {/* Search */}
            <Input
              placeholder="Search categories..."
              value={categorySearch}
              onChange={(e) => setCategorySearch(e.target.value)}
              className="h-10 rounded-xl"
            />

            {/* Category Tags */}
            <div className="flex flex-wrap gap-2">
              {filteredCategories.map((cat) => {
                const isSelected = selectedCategories.includes(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-muted text-muted-foreground border-transparent hover:border-primary/40 hover:text-foreground"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {selectedCategories.length > 0 && (
              <div className="pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground mb-2">
                  Selected ({selectedCategories.length}):
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCategories.map((cat) => (
                    <span
                      key={cat}
                      onClick={() => toggleCategory(cat)}
                      className="px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary cursor-pointer hover:bg-primary/20 transition-colors"
                    >
                      {cat} ×
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Bio & Tagline Card */}
          <section className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-bold text-foreground">Bio & Tagline</h2>
              <p className="text-sm text-muted-foreground mt-1">Tell visitors what you're all about</p>
            </div>

            {/* Short Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">Short Bio</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Write a few lines about yourself..."
                className="rounded-xl min-h-[100px] resize-none"
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground text-right">{bio.length}/500</p>
            </div>

            {/* Tagline */}
            <div className="space-y-2">
              <Label htmlFor="tagline">Tagline</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-primary whitespace-nowrap">I WILL</span>
                <Input
                  id="tagline"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="make your fantasies come true..."
                  className="h-12 rounded-xl flex-1"
                  maxLength={80}
                />
              </div>
              <p className="text-xs text-muted-foreground">{tagline.length}/80 characters</p>
            </div>
          </section>

          {/* Visibility & URL Card */}
          <section className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-bold text-foreground">Profile Visibility</h2>
              <p className="text-sm text-muted-foreground mt-1">Control who can discover your profile</p>
            </div>

            <RadioGroup value={visibility} onValueChange={(v) => setVisibility(v as "public" | "members")}>
              <label className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${
                visibility === "public" ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
              }`}>
                <RadioGroupItem value="public" className="mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-foreground">Public</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Anyone can find and view your profile. Best for growing your audience.
                  </p>
                </div>
              </label>
              <label className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${
                visibility === "members" ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
              }`}>
                <RadioGroupItem value="members" className="mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-foreground">Members Only</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Only registered members can view your profile. More exclusive feel.
                  </p>
                </div>
              </label>
            </RadioGroup>

            {/* Profile URL Preview */}
            <div className="bg-muted rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <LinkIcon className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">Your Profile URL</span>
              </div>
              <div className="flex items-center gap-2 bg-background rounded-lg px-3 py-2 border border-border">
                <span className="text-sm text-muted-foreground">plezyy.com/</span>
                <span className="text-sm font-medium text-foreground">
                  {displayName ? displayName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") : "your-name"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" className="rounded-lg gap-1.5 text-xs">
                  <QrCode className="h-3.5 w-3.5" />
                  Generate QR Code
                </Button>
                <p className="text-xs text-muted-foreground">Share on social media, billboards & promotions</p>
              </div>
            </div>
          </section>

          {/* Actions */}
          <div className="flex justify-between items-center pb-8">
            <Button variant="ghost" className="gap-2 text-muted-foreground" asChild>
              <Link to="/sign-up">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Link>
            </Button>
            <Button
              className="rounded-xl font-semibold px-8"
              onClick={() => navigate("/onboarding-identity")}
            >
              Continue to Verification
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 mt-8">
        <p className="text-center text-xs text-muted-foreground">
          © 2024 Plezyy Inc. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
