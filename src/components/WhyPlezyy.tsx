import { Zap, ShieldCheck, Lock } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Instant Connection",
    description: "Browse creators, find what excites you, and connect instantly. No waiting, no awkward negotiations.",
  },
  {
    icon: ShieldCheck,
    title: "Safe & Discreet",
    description: "Every transaction is secure. Your identity stays private, and all payments are processed safely through our platform.",
  },
  {
    icon: Lock,
    title: "100% Private",
    description: "Your personal details are never shared. All interactions happen through our encrypted, anonymous infrastructure.",
  },
];

export default function WhyPlezyy() {
  return (
    <section className="py-24 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold mb-4">Why choose Plezyy?</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            The safest and most private way to explore desire, connect with creators, and enjoy personalized adult experiences.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-12 text-center">
          {features.map((feature) => (
            <div key={feature.title} className="p-8 rounded-2xl bg-slate-800/50 border border-slate-700">
              <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <feature.icon className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
              <p className="text-slate-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
