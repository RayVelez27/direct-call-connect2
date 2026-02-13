import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, ArrowLeft, ArrowRight, Plus, HelpCircle, Bell, User, MapPin, Landmark, ShieldCheck, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import plezyyLogo from "@/assets/plezyy-logo.jpeg";

const sidebarSteps = [
  { icon: Check, label: "Profile Info", status: "completed" as const },
  { icon: Landmark, label: "Address & Payouts", status: "active" as const },
  { icon: null, label: "Availability", status: "upcoming" as const },
];

export default function OnboardingPayouts() {
  const [payoutMethod, setPayoutMethod] = useState<"stripe" | "manual" | null>(null);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-72 border-r border-border flex-col bg-card">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-2 mb-6">
            <Link to="/">
              <img alt="Plezyy Logo" className="h-8 w-auto dark:invert" src={plezyyLogo} />
            </Link>
          </div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Onboarding Progress
          </p>
          <div className="space-y-3">
            {sidebarSteps.map((step, i) => (
              <div
                key={step.label}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  step.status === "active"
                    ? "bg-primary/10 text-primary"
                    : step.status === "completed"
                    ? "text-muted-foreground"
                    : "text-muted-foreground/60"
                }`}
              >
                {step.status === "completed" ? (
                  <Check className="h-5 w-5 text-primary" />
                ) : step.status === "active" ? (
                  <Landmark className="h-5 w-5" />
                ) : (
                  <span className="material-symbols-outlined text-[20px]">schedule</span>
                )}
                <div>
                  <p>{step.label}</p>
                  <p className="text-xs font-normal">
                    {step.status === "completed"
                      ? "Completed"
                      : step.status === "active"
                      ? "Active Step"
                      : "Coming up next"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="p-6">
          <p className="text-xs text-muted-foreground mb-2">Progress</p>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: "66%" }} />
            </div>
            <span className="text-sm font-semibold text-foreground">66%</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="sticky top-0 z-50 border-b border-border bg-background">
          <div className="flex items-center justify-between px-6 h-14">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">Creator Onboarding</span>
              <ChevronRight className="h-4 w-4" />
              <span>Step 2: Payout Information</span>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 rounded-lg hover:bg-accent transition-colors">
                <HelpCircle className="h-5 w-5 text-muted-foreground" />
              </button>
              <button className="p-2 rounded-lg hover:bg-accent transition-colors">
                <Bell className="h-5 w-5 text-muted-foreground" />
              </button>
              <button className="p-2 rounded-lg hover:bg-accent transition-colors">
                <User className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-8">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-foreground mb-1">Address & Payouts</h1>
            <p className="text-sm text-muted-foreground mb-8">
              To receive your earnings, we need your legal residential address and your preferred bank account details. We use Stripe to ensure secure and timely payments.
            </p>

            {/* Residential Address */}
            <section className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">Residential Address</h2>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="street">Street Address</Label>
                  <Input id="street" placeholder="" className="h-12 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" placeholder="" className="h-12 rounded-xl" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>State</Label>
                    <Select>
                      <SelectTrigger className="h-12 rounded-xl">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="california">California</SelectItem>
                        <SelectItem value="new-york">New York</SelectItem>
                        <SelectItem value="texas">Texas</SelectItem>
                        <SelectItem value="florida">Florida</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip">Zip Code</Label>
                    <Input id="zip" placeholder="" className="h-12 rounded-xl" />
                  </div>
                </div>
              </div>
            </section>

            {/* Connect Bank Account */}
            <section className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <Landmark className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">Connect Bank Account</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Your payment information is stored securely with Stripe. Plezyy does not have access to your bank login details.
              </p>

              <div className="border border-border rounded-2xl p-6 bg-card">
                <h3 className="text-base font-semibold text-foreground mb-1">Setup Secure Payouts</h3>
                <p className="text-sm text-muted-foreground mb-5">
                  Connect your bank account or debit card to receive payouts automatically.
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setPayoutMethod("stripe")}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                      payoutMethod === "stripe"
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-primary/50 text-foreground"
                    }`}
                  >
                    Connect with Stripe
                  </button>
                  <button
                    onClick={() => setPayoutMethod("manual")}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                      payoutMethod === "manual"
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-primary/50 text-foreground"
                    }`}
                  >
                    <Plus className="h-4 w-4" />
                    Manual Bank Details
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                Your details are encrypted and securely stored. We never share your data.
              </div>
            </section>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <Button variant="ghost" className="gap-2 text-muted-foreground" asChild>
                <Link to="/onboarding-identity">
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Link>
              </Button>
              <div className="flex items-center gap-4">
                <span className="text-xs text-muted-foreground hidden sm:block">
                  Saving progress automatically...
                </span>
                <Button className="rounded-xl font-semibold px-6 gap-2">
                  Next Step
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
