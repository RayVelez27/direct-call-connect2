import { Link } from "react-router-dom";

export default function HomeHero() {
  return (
    <section className="bg-[#EBF1FF] dark:bg-[#4180FB]/10 px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <div className="max-w-3xl mx-auto text-center">
        <span className="inline-block text-xs font-semibold tracking-widest uppercase bg-[#D6E2FF] dark:bg-[#4180FB]/30 text-[#1E4FBF] dark:text-[#A8C4FF] px-4 py-1.5 rounded-full mb-5">
          The marketplace for virtual services
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight leading-[1.2] mb-5">
          <span className="block">
            Real Creators.{" "}
            <span className="relative inline-block whitespace-nowrap">
              <span
                aria-hidden
                className="absolute -inset-x-1 top-[18%] bottom-[6%] -rotate-[1.5deg] bg-[#7AAFFD]/60 dark:bg-[#4180FB]/45 rounded-sm"
              />
              <span className="relative">Real connections.</span>
            </span>
          </span>
          <span className="block mt-1 sm:mt-2">
            No subscriptions.{" "}
            <span className="relative inline-block whitespace-nowrap">
              <span
                aria-hidden
                className="absolute -inset-x-1 top-[18%] bottom-[6%] rotate-[1deg] bg-[#7AAFFD]/60 dark:bg-[#4180FB]/45 rounded-sm"
              />
              <span className="relative">Pay per experience.</span>
            </span>
          </span>
        </h1>
        <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-xl mx-auto mb-8">
          Plezyy is where you discover talented creators offering personalized videos,
          live chats, custom content, and more — all in one place, on your terms.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            to="/discovery"
            className="px-7 py-3 rounded-full bg-[#4180FB] dark:bg-[#5A96FC] text-white font-semibold text-sm md:text-base hover:bg-[#3268D4] dark:hover:bg-[#7AAFFD] transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Browse creators
          </Link>
          <Link
            to="/sign-up"
            className="px-7 py-3 rounded-full bg-transparent border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white font-medium text-sm md:text-base hover:bg-white dark:hover:bg-gray-800 transition-all duration-200"
          >
            Start selling your services
          </Link>
        </div>
      </div>
    </section>
  );
}
