import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, CalendarDays, Video, ListChecks, DollarSign, Zap, ShieldCheck, Lock, HeartHandshake, UserCheck, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type Persona = "members" | "creators";

const memberSteps = [
  {
    icon: Search,
    title: "1. Browse & Discover",
    description:
      "Explore verified adult creators across every category. Use filters for services, pricing, and availability to find exactly who you're looking for.",
  },
  {
    icon: CalendarDays,
    title: "2. Choose & Book",
    description:
      "Pick a creator, select the virtual service you want, and purchase securely. No subscriptions — just pay for the experience you want.",
  },
  {
    icon: Video,
    title: "3. Connect & Enjoy",
    description:
      "Sessions happen on-platform via video call, chat, or custom content delivery. Private, discreet, and on your schedule.",
  },
];

const creatorSteps = [
  {
    icon: ListChecks,
    title: "1. List Your Services",
    description:
      "Choose from 40+ virtual services or create your own. Set your prices, define your boundaries, and build your profile your way.",
  },
  {
    icon: Zap,
    title: "2. Get Booked",
    description:
      "Members browse and purchase your services directly. No need to build a following first — your services speak for themselves.",
  },
  {
    icon: DollarSign,
    title: "3. Get Paid",
    description:
      "Earn money for every completed session. Get paid weekly with transparent payouts. No monthly grind or subscriber pressure.",
  },
];

const trustItems = [
  { icon: UserCheck, label: "18+ Verified" },
  { icon: Lock, label: "Secure Payments" },
  { icon: ShieldCheck, label: "Content Protection" },
  { icon: HeartHandshake, label: "Consent & Boundaries" },
  { icon: Eye, label: "Creator-Controlled" },
];

const creatorBenefits = [
  { title: "Set Your Own Rates", description: "You decide how much your time is worth. No hidden fees or platform markups." },
  { title: "Work From Anywhere", description: "All you need is a device and an internet connection. Work on your own schedule." },
  { title: "Get Paid Weekly", description: "Transparent, reliable payouts every week. No chasing invoices." },
  { title: "No Subscriber Pressure", description: "Earn per session, not per follower. Your income isn't tied to a content treadmill." },
];

export default function HowItWorks() {
  const [persona, setPersona] = useState<Persona>("members");
  const steps = persona === "members" ? memberSteps : creatorSteps;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative pt-20 pb-16 px-6 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-5 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent" />
          </div>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4">
              How It Works
            </span>
            <h1 className="text-5xl md:text-6xl font-extrabold text-foreground leading-[1.1] mb-6">
              Virtual Adult Services,{" "}
              <span className="text-primary">Simplified.</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Plezyy is the marketplace where adult creators sell virtual
              services and members pay only for the experiences they want — no
              subscriptions required.
            </p>
          </div>
        </section>

        {/* Persona Toggle + Steps */}
        <section className="px-6 py-12">
          <div className="max-w-6xl mx-auto">
            {/* Toggle */}
            <div className="flex justify-center mb-16">
              <div className="inline-flex p-1 bg-secondary rounded-xl">
                <button
                  onClick={() => setPersona("members")}
                  className={`px-8 py-3 rounded-lg font-bold text-sm transition-all ${
                    persona === "members"
                      ? "bg-background text-primary shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  For Members
                </button>
                <button
                  onClick={() => setPersona("creators")}
                  className={`px-8 py-3 rounded-lg font-bold text-sm transition-all ${
                    persona === "creators"
                      ? "bg-background text-primary shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  For Creators
                </button>
              </div>
            </div>

            {/* Steps */}
            <div className="grid md:grid-cols-3 gap-8 relative">
              {/* Connector line (desktop) */}
              <div className="hidden md:block absolute top-10 left-[15%] w-[70%] h-0.5 border-t-2 border-dashed border-border -z-10" />

              {steps.map((step) => (
                <div
                  key={step.title}
                  className="flex flex-col items-center text-center group"
                >
                  <div className="w-20 h-20 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center mb-6 shadow-xl shadow-primary/30 transition-transform duration-300 group-hover:scale-110">
                    <step.icon className="h-9 w-9" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Ribbon */}
        <section className="bg-secondary py-10 border-y border-border">
          <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-10 md:gap-20 items-center text-muted-foreground font-bold uppercase text-xs tracking-widest">
            {trustItems.map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <item.icon className="h-5 w-5 text-primary" />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Creator Earnings / Benefits Detail */}
        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <div className="bg-primary/5 p-8 border border-primary/10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
                    <DollarSign className="h-5 w-5" />
                  </div>
                  <h4 className="text-2xl font-bold text-foreground">
                    Creator Benefits
                  </h4>
                </div>
                <ul className="space-y-6">
                  {creatorBenefits.map((benefit) => (
                    <li key={benefit.title} className="flex gap-4">
                      <ShieldCheck className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-foreground">
                          {benefit.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {benefit.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="space-y-8">
              <h2 className="text-4xl font-extrabold text-foreground">
                Built for everyday adults, not just influencers.
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Whether you want a side hustle or a full-time income — or you
                just do it for fun — Plezyy gives you the tools to offer
                virtual adult services on your own terms. You control what you
                offer, how you work, and how much you earn.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/onboarding">
                  <Button
                    size="lg"
                    className="rounded-xl shadow-xl shadow-primary/20 hover:scale-105 transition-transform font-bold px-8"
                  >
                    Become a Creator
                  </Button>
                </Link>
                <Link to="/explore">
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-xl font-bold px-8"
                  >
                    Explore Creators
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 px-6">
          <div className="max-w-5xl mx-auto bg-black rounded-3xl p-12 md:p-20 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 relative z-10">
              Start your journey with Plezyy today.
            </h2>
            <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto relative z-10">
              Join creators and members already connecting on the only
              pay-per-experience adult marketplace.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
              <Link to="/explore">
                <Button
                  size="lg"
                  className="rounded-xl text-lg font-bold px-10 py-6"
                >
                  Find a Creator
                </Button>
              </Link>
              <Link to="/onboarding">
                <Button
                  variant="secondary"
                  size="lg"
                  className="rounded-xl text-lg font-bold px-10 py-6 bg-white text-black hover:bg-slate-100"
                >
                  Start Earning
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
