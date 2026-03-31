import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Search, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";

type UserRole = "consumer" | "creator" | null;

export default function SignUp() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedRole) {
      toast.error("Please select whether you're a Member or Creator.");
      return;
    }
    if (!agreedToTerms) {
      toast.error("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { role: selectedRole },
      },
    });
    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Account created!");
    navigate(selectedRole === "creator" ? "/onboarding" : "/dashboard/user");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-xl space-y-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
              Join the Plezyy marketplace
            </h1>
            <p className="mt-3 text-muted-foreground text-lg">
              Choose how you want to explore the world of adult freelancing
            </p>
          </div>

          {/* Role Selection */}
          <div className="grid sm:grid-cols-2 gap-4">
            <button
              onClick={() => setSelectedRole("consumer")}
              className={`selection-card rounded-xl p-6 text-left border-2 transition-all duration-300 cursor-pointer ${
                selectedRole === "consumer"
                  ? "border-primary bg-primary/5 shadow-lg"
                  : "border-border hover:border-primary hover:bg-primary/5"
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Search className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Member</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                I want to browse creators & enjoy personalized adult experiences.
              </p>
              {selectedRole === "consumer" && (
                <p className="mt-3 text-xs font-semibold text-primary">Selected</p>
              )}
            </button>

            <button
              onClick={() => setSelectedRole("creator")}
              className={`selection-card rounded-xl p-6 text-left border-2 transition-all duration-300 cursor-pointer ${
                selectedRole === "creator"
                  ? "border-primary bg-primary/5 shadow-lg"
                  : "border-border hover:border-primary hover:bg-primary/5"
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Creator</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                I want to monetize my intimacy & earn from adult freelancing.
              </p>
              {selectedRole === "creator" && (
                <p className="mt-3 text-xs font-semibold text-primary">Selected</p>
              )}
            </button>
          </div>

          {/* Sign Up Form */}
          <form className="space-y-5" onSubmit={handleSignUp}>
            <div className="text-center">
              <h2 className="text-xl font-bold text-foreground">Create your account</h2>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                className="h-12 rounded-xl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="h-12 rounded-xl pr-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Checkbox
                id="terms"
                className="mt-0.5"
                checked={agreedToTerms}
                onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
              />
              <Label htmlFor="terms" className="text-sm font-normal text-muted-foreground cursor-pointer leading-relaxed">
                I agree to the{" "}
                <Link to="/terms-of-use" className="text-primary hover:underline font-medium">Terms of Use</Link>{" "}
                and{" "}
                <Link to="/privacy-policy" className="text-primary hover:underline font-medium">Privacy Policy</Link>.
              </Label>
            </div>

            <Button type="submit" className="w-full h-12 rounded-xl text-base font-bold" disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-background px-4 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          {/* Social Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="h-12 rounded-xl font-semibold gap-2">
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google
            </Button>
            <Button variant="outline" className="h-12 rounded-xl font-semibold gap-2">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              Apple
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6">
        <p className="text-center text-sm text-muted-foreground">
          © 2026 Plezyy Inc. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
