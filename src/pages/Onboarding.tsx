import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield, ArrowLeft, Eye, EyeOff, Globe, Lock, Link as LinkIcon, Camera, X, ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import categoriesData from "@/data/categories.json";
import { applyWatermark } from "@/lib/watermark";

// Sections/groups to exclude from the category picker (not content-descriptive)
const excludedSections = ["Main", "Countries & Languages"];
const excludedGroups = ["Private show", "Broadcast", "Languages"];
const excludedItems = new Set([
  "My Favorites", "Recommended", "Watch History", "Gallery", "Best for Privates",
  "8-12 tk", "16-24 tk", "32-60 tk", "90+ tk", "Video Call (Cam2Cam)",
  "Recordable Privates", "Spy on Shows", "HD", "Mobile", "Recordable", "VR Cams",
  "New Models", "Kiiroo", "Lovense", "Interactive Toy",
]);

// Build grouped categories for display
const categoryGroups: { heading: string; title: string; items: string[] }[] = [];
const allCategories: string[] = [];
categoriesData.forEach((section) => {
  if (excludedSections.includes(section.heading)) return;
  section.groups.forEach((group) => {
    if (excludedGroups.includes(group.title)) return;
    const items: string[] = [];
    group.items.forEach((item) => {
      if (item.name && !excludedItems.has(item.name) && !allCategories.includes(item.name)) {
        items.push(item.name);
        allCategories.push(item.name);
      }
    });
    if (items.length > 0) {
      categoryGroups.push({
        heading: section.heading,
        title: group.title,
        items,
      });
    }
  });
});

const genderOptions = ["Female", "Male", "Non-binary", "Trans", "Prefer not to say"];
const sexualPreferences = ["Straight", "Bisexual", "Lesbian", "Gay", "Pansexual", "Other"];
const countries = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda",
  "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain",
  "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan",
  "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria",
  "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada",
  "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros",
  "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic",
  "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt",
  "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia",
  "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana",
  "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti",
  "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland",
  "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati",
  "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia",
  "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi",
  "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania",
  "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro",
  "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands",
  "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia",
  "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea",
  "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania",
  "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia",
  "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe",
  "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore",
  "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea",
  "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland",
  "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo",
  "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
  "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States",
  "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam",
  "Yemen", "Zambia", "Zimbabwe",
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [nationality, setNationality] = useState("");
  const [location, setLocation] = useState("");
  const [nationalitySearch, setNationalitySearch] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [nationalityOpen, setNationalityOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [sexPref, setSexPref] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [bio, setBio] = useState("");
  const [tagline, setTagline] = useState("");
  const [visibility, setVisibility] = useState<"public" | "members">("public");
  const [categorySearch, setCategorySearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [photos, setPhotos] = useState<{ file: File; preview: string }[]>([]);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const MIN_PHOTOS = 3;
  const MAX_PHOTOS = 10;

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remaining = MAX_PHOTOS - photos.length;
    const toAdd = files.slice(0, remaining);
    const newPhotos = toAdd.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setPhotos((prev) => [...prev, ...newPhotos]);
    if (photoInputRef.current) photoInputRef.current.value = "";
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  // Map frontend labels to DB enum values
  const genderMap: Record<string, string> = {
    "Female": "female",
    "Male": "male",
    "Non-binary": "non_binary",
    "Trans": "trans",
    "Prefer not to say": "prefer_not_to_say",
  };
  const sexPrefMap: Record<string, string> = {
    "Straight": "straight",
    "Bisexual": "bisexual",
    "Lesbian": "lesbian",
    "Gay": "gay",
    "Pansexual": "pansexual",
    "Other": "other",
  };

  const generateSlug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const saveProfile = async () => {
    // Validation
    if (!displayName.trim()) {
      toast.error("Please enter a display name.");
      return;
    }
    if (!dob) {
      toast.error("Please enter your date of birth.");
      return;
    }
    if (selectedCategories.length < 3) {
      toast.error("Please select at least 3 categories.");
      return;
    }
    if (photos.length < MIN_PHOTOS) {
      toast.error(`Please upload at least ${MIN_PHOTOS} photos.`);
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

      const slug = generateSlug(displayName) + "-" + user.id.slice(0, 6);

      // Upload photos to Supabase storage (with watermark)
      const photoUrls: string[] = [];
      for (let i = 0; i < photos.length; i++) {
        const photo = photos[i];
        const watermarked = await applyWatermark(photo.file);
        const ext = photo.file.name.split(".").pop() || "jpg";
        const path = `${user.id}/${Date.now()}-${i}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("creator-photos")
          .upload(path, watermarked, { upsert: true });
        if (uploadError) {
          console.error("Photo upload error:", uploadError);
          toast.error(`Failed to upload photo ${i + 1}. Please try again.`);
          setSaving(false);
          return;
        }
        const { data: urlData } = supabase.storage
          .from("creator-photos")
          .getPublicUrl(path);
        photoUrls.push(urlData.publicUrl);
      }

      const { error } = await supabase.from("creator_profiles").upsert(
        {
          user_id: user.id,
          display_name: displayName.trim(),
          date_of_birth: dob,
          gender: genderMap[gender] || null,
          nationality: nationality || null,
          country_region: location || null,
          sexual_preference: sexPrefMap[sexPref] || null,
          categories: selectedCategories,
          bio: bio.trim() || null,
          tagline: tagline.trim() || null,
          visibility: visibility === "members" ? "members_only" : "public",
          slug,
          photos: photoUrls,
        },
        { onConflict: "user_id" }
      );

      if (error) {
        console.error("Profile save error:", error);
        toast.error("Failed to save profile. Please try again.");
        setSaving(false);
        return;
      }

      toast.success("Profile saved!");
      navigate("/onboarding-identity");
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("Something went wrong.");
      setSaving(false);
    }
  };

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const searchLower = categorySearch.toLowerCase();
  const filteredGroups = categorySearch
    ? [{ heading: "Search Results", title: "", items: allCategories.filter((c) => c.toLowerCase().includes(searchLower)) }]
    : categoryGroups;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-primary/5 to-background flex flex-col">
      <Navbar />

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
          {/* Photos Card */}
          <section className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-bold text-foreground">Profile Photos</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Upload at least {MIN_PHOTOS} photos (max {MAX_PHOTOS}). These will be displayed on your profile.
              </p>
            </div>

            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoSelect}
              className="hidden"
            />

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {photos.map((photo, index) => (
                <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-border group">
                  <img
                    src={photo.preview}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute top-1.5 right-1.5 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}

              {photos.length < MAX_PHOTOS && (
                <button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  className="aspect-square rounded-xl border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  <ImagePlus className="h-6 w-6" />
                  <span className="text-xs font-medium">Add Photo</span>
                </button>
              )}
            </div>

            <p className={`text-sm font-medium ${photos.length < MIN_PHOTOS ? "text-destructive" : "text-green-600"}`}>
              {photos.length} / {MIN_PHOTOS} minimum uploaded
              {photos.length >= MIN_PHOTOS && " ✓"}
            </p>
          </section>

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

            {/* Location */}
            <div className="space-y-2 relative">
              <Label>Location</Label>
              <div
                className="flex h-12 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background cursor-pointer items-center justify-between focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
                onClick={() => setLocationOpen(!locationOpen)}
              >
                <span className={location ? "text-foreground" : "text-muted-foreground"}>
                  {location || "Where you're based"}
                </span>
                <svg className={`h-4 w-4 text-muted-foreground transition-transform ${locationOpen ? "rotate-180" : ""}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </div>
              {locationOpen && (
                <div className="absolute z-50 mt-1 w-full bg-card border border-border rounded-xl shadow-lg max-h-60 overflow-hidden">
                  <div className="p-2 border-b border-border">
                    <Input
                      placeholder="Search countries..."
                      value={locationSearch}
                      onChange={(e) => setLocationSearch(e.target.value)}
                      className="h-9 rounded-lg"
                      autoFocus
                    />
                  </div>
                  <div className="overflow-y-auto max-h-48">
                    {countries
                      .filter((c) => c.toLowerCase().includes(locationSearch.toLowerCase()))
                      .map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => { setLocation(c); setLocationOpen(false); setLocationSearch(""); }}
                          className={`w-full text-left px-3 py-2 text-sm hover:bg-primary/10 transition-colors ${
                            location === c ? "bg-primary/5 text-primary font-medium" : "text-foreground"
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Nationality */}
            <div className="space-y-2">
              <Label>Nationality</Label>
              <Input
                placeholder="Ex. Canadian"
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
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

            {/* Category Groups */}
            <div className="space-y-5 max-h-[400px] overflow-y-auto pr-1">
              {filteredGroups.map((group) => (
                <div key={`${group.heading}-${group.title}`}>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    {group.title || group.heading}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((cat) => {
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
                </div>
              ))}
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
              <Label>Short Bio</Label>
              <RichTextEditor
                value={bio}
                onChange={setBio}
                placeholder="Write a few lines about yourself..."
                maxLength={500}
                minHeight="100px"
              />
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
              onClick={saveProfile}
              disabled={saving}
            >
              {saving ? "Saving..." : "Continue to Verification"}
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 mt-8">
        <p className="text-center text-xs text-muted-foreground">
          © 2026 Plezyy Inc. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
