import { Link } from "react-router-dom";

export default function StartEarningCta() {
  return (
    <section className="bg-[#1E4FBF] dark:bg-[#3268D4] py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-2">
          Ready to start earning?
        </h2>
        <p className="text-base text-blue-100 mb-6">
          Set up your profile in minutes. You keep 80% of everything you make.
        </p>
        <Link
          to="/sign-up"
          className="inline-block px-7 py-3 rounded-full bg-white text-[#1E4FBF] font-bold text-sm md:text-base hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          Become a creator — it&apos;s free
        </Link>
      </div>
    </section>
  );
}
