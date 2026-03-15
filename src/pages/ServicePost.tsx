import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Star,
  Clock,
  Video,
  FileText,
  ChevronRight,
  ChevronDown,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  ShieldCheck,
  Heart,
  Share2,
  Play,
  CheckCircle,
  Sparkles,
  Flame,
  Zap,
  Users,
  Eye,
  Award,
  ArrowRight,
  BadgeCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const pricingTiers = [
  {
    label: "Basic",
    price: "$25",
    per: "session",
    name: "15 Min Video Call",
    description:
      "Quick virtual hangout — perfect for a casual chat, flirty conversation, or getting to know each other.",
    features: [
      { icon: Clock, text: "15 Minutes Duration", included: true },
      { icon: MessageCircle, text: "Text Chat Included", included: true },
      { icon: Video, text: "Video Recording", included: false },
    ],
    popular: false,
  },
  {
    label: "Standard",
    price: "$55",
    per: "session",
    name: "30 Min Private Session",
    description:
      "A longer, more personal session. Customize what happens — from dirty talk to a full strip show.",
    features: [
      { icon: Clock, text: "30 Minutes Duration", included: true },
      { icon: MessageCircle, text: "Text Chat Included", included: true },
      { icon: Video, text: "Session Recording", included: true },
    ],
    popular: true,
  },
  {
    label: "Premium",
    price: "$99",
    per: "session",
    name: "60 Min Ultimate Experience",
    description:
      "The full experience — an hour of whatever you want. Roleplay, toys, outfits, full control.",
    features: [
      { icon: Clock, text: "60 Minutes Duration", included: true },
      { icon: MessageCircle, text: "Priority Messaging", included: true },
      { icon: Video, text: "HD Recording Included", included: true },
    ],
    popular: false,
  },
];

const faqs = [
  {
    question: "Is the session private and secure?",
    answer:
      "Absolutely. All sessions are end-to-end private. Only you and the creator are in the call. Plezyy never records or monitors sessions.",
  },
  {
    question: "Can I request specific outfits or scenarios?",
    answer:
      "Yes! Send the creator a message before booking to discuss your preferences. Most creators are happy to accommodate requests.",
  },
  {
    question: "What if I need to reschedule?",
    answer:
      "You can reschedule up to 2 hours before the session. After that, the booking is final.",
  },
  {
    question: "How does payment work?",
    answer:
      "Payments are processed securely through Plezyy Pay (powered by Stripe). You'll be charged once you confirm your booking. Refunds follow our cancellation policy.",
  },
];

const reviews = [
  {
    initials: "MR",
    name: "Mike R.",
    rating: 5,
    time: "3 days ago",
    text: "Absolutely incredible experience. She made me feel so comfortable and the whole session was exactly what I wanted. Will definitely be coming back.",
    verified: true,
  },
  {
    initials: "TJ",
    name: "Tyler J.",
    rating: 5,
    time: "1 week ago",
    text: "Best virtual date I've ever had. Super fun, flirty, and she actually listens to what you want. 10/10.",
    verified: true,
  },
  {
    initials: "DK",
    name: "David K.",
    rating: 4,
    time: "2 weeks ago",
    text: "Great energy, really fun and engaging. Felt like a real connection. The 30 min went by way too fast — going premium next time.",
    verified: false,
  },
];

const serviceHighlights = [
  {
    icon: Flame,
    title: "Live Striptease",
    description: "Slow, sensual strip on camera — your pace, your requests.",
  },
  {
    icon: MessageCircle,
    title: "Dirty Talk & JOI",
    description: "I'll guide you with my voice and tell you exactly what to do.",
  },
  {
    icon: Sparkles,
    title: "Roleplay & Fantasy",
    description: "Nurse, schoolgirl, boss — pick a scenario and I'll play it out.",
  },
  {
    icon: Zap,
    title: "Toy Play",
    description: "Interactive toy sessions — you control what happens live.",
  },
];

const ratingBreakdown = [
  { stars: 5, percent: 88 },
  { stars: 4, percent: 8 },
  { stars: 3, percent: 3 },
  { stars: 2, percent: 1 },
  { stars: 1, percent: 0 },
];

export default function ServicePost() {
  const [activeTier, setActiveTier] = useState(1);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [liked, setLiked] = useState(false);
  const tier = pricingTiers[activeTier];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex text-sm font-medium text-muted-foreground">
          <ol className="flex items-center space-x-2">
            <li>
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            </li>
            <li className="flex items-center gap-2">
              <ChevronRight className="h-3 w-3" />
              <Link to="/explore" className="hover:text-primary transition-colors">Explore</Link>
            </li>
            <li className="flex items-center gap-2">
              <ChevronRight className="h-3 w-3" />
              <span className="text-foreground">Live Video Session</span>
            </li>
          </ol>
        </nav>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left Column */}
          <div className="flex-1 space-y-10">
            {/* Title & Creator Info */}
            <section>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge className="bg-primary/10 text-primary border-0 font-semibold gap-1">
                  <Flame className="h-3 w-3" />
                  Popular
                </Badge>
                <Badge variant="secondary" className="font-semibold gap-1">
                  <Video className="h-3 w-3" />
                  Live Video
                </Badge>
                <Badge variant="secondary" className="font-semibold gap-1">
                  <ShieldCheck className="h-3 w-3" />
                  Verified Creator
                </Badge>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground leading-tight mb-5">
                Private Live Video Session — Striptease, Dirty Talk & Custom Requests
              </h1>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="h-12 w-12 rounded-full overflow-hidden bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-bold text-lg">
                      VS
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-green-500 border-2 border-background" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm font-bold text-foreground">Valentina S.</h3>
                      <BadgeCheck className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, j) => (
                          <Star key={j} className="h-3 w-3 fill-yellow-400" />
                        ))}
                      </div>
                      <span className="text-xs font-bold">4.9</span>
                      <span className="text-xs text-muted-foreground">(847)</span>
                    </div>
                  </div>
                </div>
                <div className="h-6 w-px bg-border hidden sm:block" />
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Eye className="h-3.5 w-3.5" /> 2.4k views
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5" /> 312 booked
                  </span>
                </div>
                <div className="ml-auto flex items-center gap-1">
                  <button
                    onClick={() => setLiked(!liked)}
                    className={`p-2.5 rounded-xl transition-all ${
                      liked
                        ? "bg-red-50 text-red-500 dark:bg-red-500/10"
                        : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                    }`}
                  >
                    <Heart className={`h-5 w-5 ${liked ? "fill-red-500" : ""}`} />
                  </button>
                  <button className="p-2.5 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-xl transition-colors">
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </section>

            {/* Media Gallery */}
            <section className="space-y-3">
              <div className="aspect-video w-full rounded-2xl overflow-hidden relative group">
                <div className="w-full h-full bg-gradient-to-br from-primary/30 via-primary/10 to-background" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="bg-white/90 dark:bg-black/70 backdrop-blur-sm h-16 w-16 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                    <Play className="h-7 w-7 text-primary ml-1" />
                  </button>
                </div>
                <div className="absolute top-4 left-4">
                  <Badge className="bg-black/60 text-white border-0 backdrop-blur-sm gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                    Preview
                  </Badge>
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                  <span className="text-xs text-white/80 bg-black/50 px-2 py-1 rounded backdrop-blur-sm">0:47</span>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`aspect-video rounded-xl overflow-hidden cursor-pointer transition-all relative group/thumb ${
                      i === 1
                        ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                        : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity">
                      <Play className="h-5 w-5 text-white drop-shadow-lg" />
                    </div>
                    {i === 4 && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white font-bold text-lg backdrop-blur-[2px]">
                        +8
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Description */}
            <section>
              <h2 className="text-xl font-bold mb-4 text-foreground">About this service</h2>
              <div className="text-muted-foreground leading-relaxed space-y-4">
                <p>
                  Looking for a real, intimate virtual experience with someone who actually listens? I offer private 1-on-1 live video sessions tailored to exactly what you want — whether that's a slow striptease, dirty talk, JOI, roleplay, or just a fun naked hangout.
                </p>
                <p>
                  Every session is fully customizable. Tell me your fantasy and I'll make it happen. I'm comfortable with most requests and love making the experience feel personal. No rush, no judgment — just you and me.
                </p>
              </div>

              {/* Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                {serviceHighlights.map((h) => (
                  <div
                    key={h.title}
                    className="group flex items-start gap-3 p-4 rounded-xl border border-border bg-card hover:border-primary/30 hover:bg-primary/[0.02] transition-colors"
                  >
                    <div className="p-2 rounded-lg bg-primary/10 shrink-0 group-hover:bg-primary/15 transition-colors">
                      <h.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-foreground">{h.title}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{h.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* FAQ */}
            <section>
              <h2 className="text-xl font-bold mb-5 text-foreground">Frequently Asked Questions</h2>
              <div className="space-y-3">
                {faqs.map((faq, i) => (
                  <div
                    key={i}
                    className={`rounded-xl border transition-colors ${
                      openFaq === i ? "border-primary/30 bg-primary/[0.02]" : "border-border"
                    }`}
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="flex items-center justify-between w-full text-left font-semibold text-sm text-foreground p-4"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        className={`h-4 w-4 text-muted-foreground shrink-0 ml-4 transition-transform duration-200 ${
                          openFaq === i ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-200 ${
                        openFaq === i ? "max-h-40 pb-4 px-4" : "max-h-0"
                      }`}
                    >
                      <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Reviews */}
            <section>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h2 className="text-xl font-bold text-foreground">Member Reviews</h2>
                <div className="flex items-center gap-2">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-yellow-400" />
                    ))}
                  </div>
                  <span className="font-bold text-sm">4.9</span>
                  <span className="text-sm text-muted-foreground">from 847 reviews</span>
                </div>
              </div>

              {/* Rating breakdown */}
              <div className="rounded-xl border border-border bg-card p-5 mb-6">
                <div className="grid sm:grid-cols-[1fr_auto] gap-6">
                  <div className="space-y-2.5">
                    {ratingBreakdown.map((r) => (
                      <div key={r.stars} className="flex items-center gap-3">
                        <span className="text-xs font-semibold text-muted-foreground w-12">{r.stars} star</span>
                        <Progress value={r.percent} className="h-2 flex-1" />
                        <span className="text-xs font-semibold text-muted-foreground w-10 text-right">{r.percent}%</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col items-center justify-center text-center sm:px-6 sm:border-l border-border">
                    <span className="text-4xl font-extrabold text-foreground">4.9</span>
                    <div className="flex text-yellow-400 mt-1">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className="h-3.5 w-3.5 fill-yellow-400" />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground mt-1">847 reviews</span>
                  </div>
                </div>
              </div>

              {/* Review list */}
              <div className="space-y-5">
                {reviews.map((review) => (
                  <div key={review.name} className="rounded-xl border border-border bg-card p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center font-bold text-primary text-sm">
                        {review.initials}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-sm text-foreground">{review.name}</span>
                          {review.verified && (
                            <Badge variant="secondary" className="text-[10px] h-5 gap-1 font-semibold">
                              <CheckCircle className="h-2.5 w-2.5" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex text-yellow-400">
                            {Array.from({ length: review.rating }).map((_, j) => (
                              <Star key={j} className="h-3 w-3 fill-yellow-400" />
                            ))}
                          </div>
                          <span className="text-[11px] text-muted-foreground">{review.time}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{review.text}</p>
                    <div className="flex gap-4 mt-3 pt-3 border-t border-border">
                      <button className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors">
                        <ThumbsUp className="h-3.5 w-3.5" /> Helpful
                      </button>
                      <button className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors">
                        <ThumbsDown className="h-3.5 w-3.5" /> Not Helpful
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <Button variant="outline" className="w-full mt-5 font-semibold gap-2">
                View All 847 Reviews
                <ArrowRight className="h-4 w-4" />
              </Button>
            </section>
          </div>

          {/* Right Column: Sidebar */}
          <aside className="w-full lg:w-[420px] shrink-0">
            <div className="lg:sticky lg:top-24 space-y-5">
              {/* Pricing Card */}
              <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                {/* Tier Tabs */}
                <div className="flex border-b border-border">
                  {pricingTiers.map((t, i) => (
                    <button
                      key={t.label}
                      onClick={() => setActiveTier(i)}
                      className={`flex-1 py-4 text-sm font-bold relative transition-colors ${
                        activeTier === i
                          ? "text-primary bg-primary/5"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                      }`}
                    >
                      {t.popular && (
                        <span className="absolute -top-0 left-1/2 -translate-x-1/2 text-[9px] font-bold text-primary uppercase tracking-wider">
                          Popular
                        </span>
                      )}
                      {t.label}
                      {activeTier === i && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Tier Content */}
                <div className="p-6">
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-3xl font-extrabold text-foreground">{tier.price}</span>
                    <span className="text-sm text-muted-foreground">/ {tier.per}</span>
                  </div>
                  <h4 className="font-bold text-sm text-foreground mb-1">{tier.name}</h4>
                  <p className="text-sm text-muted-foreground mb-5 leading-relaxed">{tier.description}</p>

                  <div className="space-y-3 mb-6">
                    {tier.features.map((f) => (
                      <div
                        key={f.text}
                        className={`flex items-center gap-3 text-sm ${
                          f.included ? "text-foreground" : "text-muted-foreground/50"
                        }`}
                      >
                        {f.included ? (
                          <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                        ) : (
                          <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/20 shrink-0" />
                        )}
                        <span className={f.included ? "" : "line-through"}>{f.text}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <Button className="w-full h-12 font-bold text-base shadow-lg shadow-primary/20 gap-2">
                      <Video className="h-4 w-4" />
                      Book Session — {tier.price}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full h-12 font-bold border-primary/30 text-primary hover:bg-primary/5 gap-2"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Send Message
                    </Button>
                  </div>

                  <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-border">
                    <ShieldCheck className="h-3.5 w-3.5 text-muted-foreground" />
                    <p className="text-[11px] text-muted-foreground font-medium">
                      Secure Payment via Plezyy Pay
                    </p>
                  </div>
                </div>
              </div>

              {/* About Creator Card */}
              <div className="rounded-2xl border border-border bg-card overflow-hidden">
                {/* Mini gradient header */}
                <div className="h-16 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />
                <div className="p-5 -mt-8">
                  <div className="flex items-end gap-3 mb-4">
                    <div className="relative">
                      <div className="h-16 w-16 rounded-xl overflow-hidden bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-bold text-xl ring-4 ring-card">
                        VS
                      </div>
                      <span className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-green-500 border-2 border-card" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-foreground">Valentina S.</h3>
                        <BadgeCheck className="h-4 w-4 text-primary" />
                      </div>
                      <p className="text-xs text-muted-foreground">Latina Creator &middot; Striptease & GFE</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    Colombian babe who loves making you feel good. I'm open-minded, fun, and here to give you an experience you won't forget. Tell me your fantasy.
                  </p>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {[
                      { label: "Avg. Response", value: "15 Min", icon: Clock },
                      { label: "Completion", value: "99%", icon: Award },
                      { label: "Member Since", value: "Jan 2025", icon: Users },
                      { label: "Status", value: "Online", icon: Zap, highlight: true },
                    ].map((s) => (
                      <div key={s.label} className="rounded-lg bg-secondary/50 p-3">
                        <div className="flex items-center gap-1.5 mb-1">
                          <s.icon className="h-3 w-3 text-muted-foreground" />
                          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">{s.label}</span>
                        </div>
                        <p className={`text-xs font-bold ${s.highlight ? "text-green-500" : "text-foreground"}`}>
                          {s.value}
                        </p>
                      </div>
                    ))}
                  </div>
                  <Link to="/explore">
                    <Button variant="secondary" className="w-full font-semibold gap-2" size="sm">
                      View Full Profile
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Trust Badge */}
              <div className="flex items-start gap-3 p-4 bg-primary/5 border border-primary/10 rounded-2xl">
                <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground mb-0.5">18+ Verified Platform</p>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    All creators are age-verified. Payments are secure and sessions are fully private.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
