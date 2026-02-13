import Lottie from "lottie-react";
import verifiedBadge from "@/assets/verified-badge.json";
import bellNotification from "@/assets/bell-notification.json";
import camera from "@/assets/camera.json";

const features = [
  {
    lottie: verifiedBadge,
    title: "Verified Creators",
    description: "Browse hundreds of vetted creators across every category and fantasy.",
  },
  {
    lottie: bellNotification,
    title: "Perfect Match",
    description: "Find exactly who you're looking for with smart filters and recommendations.",
  },
  {
    lottie: camera,
    title: "Instant Access",
    description: "Connect live or request custom content — on your schedule, your terms.",
  },
];

export default function MakeItHappen() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-4">
          <p className="text-muted-foreground text-lg">Why Plezyy</p>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-14 font-['Playfair_Display']">
          Your ultimate creator experience
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-14">
          {features.map((feature) => (
            <div key={feature.title} className="text-center space-y-4">
              <div className="w-64 h-64 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center">
                <Lottie animationData={feature.lottie} loop className="h-[30rem] w-[30rem]" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button className="px-10 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-base hover:bg-primary/90 transition-colors">
            Join now
          </button>
        </div>
      </div>
    </section>
  );
}
