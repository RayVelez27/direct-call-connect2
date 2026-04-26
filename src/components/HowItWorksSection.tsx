const steps = [
  {
    num: 1,
    title: "Discover creators",
    body: "Browse by service type, price, or rating. View profiles and packages before you commit to anything.",
  },
  {
    num: 2,
    title: "Book a service",
    body: "Choose a package and pay securely. Your payment is held until the service is delivered.",
  },
  {
    num: 3,
    title: "Enjoy and review",
    body: "Receive your content, approve it, and leave a review. Simple as that.",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="bg-[#EBF1FF] dark:bg-[#4180FB]/10 py-12 md:py-16 border-y border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white tracking-tight mb-6">
          How it works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {steps.map((s) => (
            <div
              key={s.num}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6"
            >
              <div className="w-7 h-7 rounded-full bg-[#D6E2FF] dark:bg-[#4180FB]/30 text-[#1E4FBF] dark:text-[#A8C4FF] text-xs font-bold flex items-center justify-center mb-3">
                {s.num}
              </div>
              <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-1.5">
                {s.title}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
