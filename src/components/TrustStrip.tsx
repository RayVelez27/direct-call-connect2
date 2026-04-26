const items = [
  "Secure payments",
  "Age verified platform",
  "DMCA protected",
  "24/7 creator support",
];

export default function TrustStrip() {
  return (
    <section className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
          {items.map((label) => (
            <div
              key={label}
              className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400"
            >
              <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
              {label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
