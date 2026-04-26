const stats = [
  { num: "12,400+", label: "Active creators" },
  { num: "$2.1M", label: "Paid to creators" },
  { num: "4.8 ★", label: "Avg. service rating" },
  { num: "48hr", label: "Avg. delivery time" },
];

export default function StatsStrip() {
  return (
    <section className="border-y border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center min-w-[120px]">
              <div className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                {s.num}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
