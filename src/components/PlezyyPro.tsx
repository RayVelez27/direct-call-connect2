import { ShieldCheck } from "lucide-react";
import proCreator from "@/assets/pro-creator.png";

export default function PlezyyPro() {
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-[#4180FB] dark:bg-[#3268D4] p-10 md:p-16 flex flex-col md:flex-row items-center gap-10">
          {/* Left content */}
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-4 py-1.5">
              <ShieldCheck className="h-5 w-5 text-white" />
              <span className="text-white font-semibold text-sm tracking-wide uppercase">
                pro.
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight tracking-tight">
              Premium experiences, or your money back
            </h2>
            <p className="text-blue-100 text-base md:text-lg leading-relaxed max-w-xl">
              On Plezyy Pro, connect with top-tier verified creators risk-free.
              Every session with vetted Pro creators is backed by our
              satisfaction guarantee, so you can explore your desires with
              total confidence and privacy.
            </p>
            <a href="/sign-up" className="inline-block mt-2 px-8 py-3 rounded-full bg-white text-[#4180FB] font-semibold text-base hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
              Try Pro now
            </a>
          </div>

          {/* Right decorative element */}
          <div className="hidden md:flex items-center justify-center flex-shrink-0">
            <div className="w-56 h-56 rounded-full overflow-hidden ring-4 ring-white/20">
              <img src={proCreator} alt="Pro creator" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
