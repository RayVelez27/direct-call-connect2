import ctaCreator from "@/assets/cta-creator.png";

export default function CtaBanner() {
  return (
    <section className="pt-8 pb-24 overflow-hidden bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-primary rounded-3xl p-12 md:p-20 overflow-hidden">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-3xl" />
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to monetize your intimacy? Start creating today.
            </h2>
            <p className="text-blue-100 text-lg mb-10">
              Join thousands of creators earning on their own terms. Sell custom content, offer live experiences, and build your audience—safely and privately.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="px-8 py-4 bg-white text-primary font-bold rounded-xl hover:bg-blue-50 transition-colors">
                Become a Creator
              </button>
              <button className="px-8 py-4 bg-transparent border border-white/30 text-white font-bold rounded-xl hover:bg-white/10 transition-colors">
                Learn More
              </button>
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
