import { ShieldCheck } from "lucide-react";
import proCreator from "@/assets/pro-creator.png";

export default function PlezyyPro() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-primary p-10 md:p-16 flex flex-col md:flex-row items-center gap-10">
          {/* Left content */}
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 bg-primary-foreground/15 rounded-full px-4 py-1.5">
              <ShieldCheck className="h-5 w-5 text-primary-foreground" />
              <span className="text-primary-foreground font-semibold text-sm tracking-wide uppercase">
                pro.
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground leading-tight font-['Noto_Serif'] italic font-black">
              Premium experiences, or your money back
            </h2>
            <p className="text-primary-foreground/80 text-base md:text-lg leading-relaxed max-w-xl">
              On Plezyy Pro, connect with top-tier verified creators risk-free.
              Every session with vetted Pro creators is backed by our
              satisfaction guarantee, so you can explore your desires with
              total confidence and privacy.
            </p>
            <button className="mt-2 px-8 py-3 rounded-lg bg-primary-foreground text-primary font-semibold text-base hover:bg-primary-foreground/90 transition-colors">
              Try Pro now
            </button>
          </div>

          {/* Right decorative element */}
          <div className="hidden md:flex items-center justify-center flex-shrink-0">
            <div className="w-56 h-56 rounded-full overflow-hidden ring-4 ring-primary-foreground/20">
              <img src={proCreator} alt="Pro creator" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
