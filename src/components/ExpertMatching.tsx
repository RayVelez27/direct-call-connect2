export default function ExpertMatching() {
  return (
    <section className="py-16 bg-[#4180FB] dark:bg-[#3268D4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
              Looking for the perfect creator?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg max-w-xl">
              Tell us what you're looking for and we'll match you with verified creators who fit your style and preferences.
            </p>
          </div>
          <a href="/discovery" className="px-8 py-3 rounded-full bg-[#4180FB] dark:bg-[#5A96FC] text-white font-semibold text-base hover:bg-[#3268D4] dark:hover:bg-[#7AAFFD] transition-all duration-200 whitespace-nowrap shadow-sm hover:shadow-md">
            Get matched
          </a>
        </div>
      </div>
    </section>
  );
}
