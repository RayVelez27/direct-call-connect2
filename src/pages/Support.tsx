import { useState } from "react";
import { Mail, MessageSquare, Shield, Clock, ChevronDown, Send, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const categories = [
  "Account & Login",
  "Billing & Payments",
  "Bookings & Sessions",
  "Creator Verification",
  "Report a User",
  "Technical Issue",
  "Feature Request",
  "Other",
];

const quickLinks = [
  {
    icon: MessageSquare,
    title: "FAQ",
    description: "Find answers to common questions about Plezyy.",
    to: "/faq",
  },
  {
    icon: Shield,
    title: "Trust & Safety",
    description: "Learn about our safety policies and reporting tools.",
    to: "/trust-and-safety",
  },
  {
    icon: Clock,
    title: "How It Works",
    description: "New to Plezyy? See how the platform works.",
    to: "/how-it-works",
  },
];

export default function Support() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !category || !subject.trim() || !message.trim()) {
      toast.error("Please fill out all fields.");
      return;
    }
    setSending(true);
    // Simulate submission — replace with real endpoint when ready
    await new Promise((r) => setTimeout(r, 1200));
    toast.success("Your message has been sent! We'll get back to you within 24-48 hours.");
    setName("");
    setEmail("");
    setCategory("");
    setSubject("");
    setMessage("");
    setSending(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        {/* Header */}
        <div className="text-center mb-14">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Contact Support</h1>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
            Have a question or need help? Reach out and our team will get back to you as soon as possible.
          </p>
        </div>

        {/* Quick links */}
        <div className="grid sm:grid-cols-3 gap-4 mb-14">
          {quickLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="group rounded-2xl border border-border bg-card p-6 hover:border-primary/40 hover:shadow-sm transition-all"
            >
              <link.icon className="h-6 w-6 text-primary mb-3" />
              <h3 className="font-semibold text-foreground mb-1 flex items-center gap-1.5">
                {link.title}
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-sm text-muted-foreground">{link.description}</p>
            </Link>
          ))}
        </div>

        {/* Contact form + email info */}
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-5">
            <h2 className="text-xl font-bold text-foreground mb-1">Send us a message</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Fill out the form below and we'll respond within 24-48 hours.
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full name"
                  className="h-11 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="h-11 rounded-xl"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category *</Label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full h-11 rounded-xl border border-border bg-card text-foreground px-4 pr-10 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  >
                    <option value="">Select a category...</option>
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Brief summary of your issue"
                  className="h-11 rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your issue or question in detail..."
                className="rounded-xl min-h-[160px] resize-none"
                maxLength={2000}
              />
              <p className="text-xs text-muted-foreground text-right">{message.length}/2000</p>
            </div>

            <Button
              type="submit"
              className="rounded-xl font-semibold px-8 gap-2"
              disabled={sending}
            >
              {sending ? "Sending..." : (
                <>
                  <Send className="h-4 w-4" />
                  Send Message
                </>
              )}
            </Button>
          </form>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6">
              <Mail className="h-6 w-6 text-primary mb-3" />
              <h3 className="font-semibold text-foreground mb-1">Email Us Directly</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Prefer email? Send us a message at:
              </p>
              <a
                href="mailto:support@plezyy.com"
                className="text-sm font-medium text-primary hover:underline"
              >
                support@plezyy.com
              </a>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <Clock className="h-6 w-6 text-primary mb-3" />
              <h3 className="font-semibold text-foreground mb-1">Response Time</h3>
              <p className="text-sm text-muted-foreground">
                We typically respond within <span className="font-medium text-foreground">24-48 hours</span>. Urgent safety reports are prioritized.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-muted/30 p-6">
              <Shield className="h-6 w-6 text-primary mb-3" />
              <h3 className="font-semibold text-foreground mb-1">Safety Concern?</h3>
              <p className="text-sm text-muted-foreground mb-3">
                If you need to report a user or safety issue, select "Report a User" in the form or visit our Trust & Safety page.
              </p>
              <Link to="/trust-and-safety" className="text-sm font-medium text-primary hover:underline">
                Trust & Safety
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
