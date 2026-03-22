import ctaCreator from "@/assets/cta-creator.png";

export default function CtaBanner() {
  return (
    <section className="pt-8 pb-24 overflow-hidden bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-[#4180FB] dark:bg-[#3268D4] rounded-3xl p-12 md:p-20 overflow-hidden">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-[#4180FB]/20 rounded-full blur-3xl" />
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              Ready to monetize your intimacy? Start creating today.
            </h2>
            <p className="text-blue-100 text-lg mb-10">
              Join thousands of creators earning on their own terms. Sell custom content, offer live experiences, and build your audience — safely and privately.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="/sign-up" className="px-8 py-4 bg-white text-[#4180FB] font-semibold rounded-full hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                Become a Creator
              </a>
              <a href="/how-it-works" className="px-8 py-4 bg-transparent border border-white/30 text-white font-semibold rounded-full hover:bg-white/10 transition-all duration-200">
                Learn More
              </a>
            </div>
          </div>
          <div className="absolute right-0 bottom-0 hidden lg:block translate-y-1/4">
            <img
              alt="CTA Image"
              className="w-[450px] h-[450px] object-cover rounded-3xl rotate-12 shadow-2xl opacity-50"
              src={ctaCreator}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
