import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What is Plezyy and how does it work?",
    answer:
      "Plezyy is the world's first freelance adult marketplace connecting fans with verified creators. Browse profiles, book personalised services — from custom videos to live calls — and pay securely through the platform.",
  },
  {
    question: "How are creators verified?",
    answer:
      "Every creator goes through a rigorous identity and age verification process before being listed. Pro creators undergo additional vetting for quality and professionalism, so you always know who you're connecting with.",
  },
  {
    question: "Is my privacy protected?",
    answer:
      "Absolutely. All transactions appear discreetly on your statement, communications are end-to-end encrypted, and your personal details are never shared with creators or third parties.",
  },
  {
    question: "What is the Plezyy Pro satisfaction guarantee?",
    answer:
      "If a session with a Pro creator doesn't meet the agreed-upon expectations, you can request a full refund within 24 hours — no questions asked. We want every experience to exceed your expectations.",
  },
  {
    question: "How do creators get paid?",
    answer:
      "Creators set their own rates and receive payouts weekly via secure bank transfer or cryptocurrency. Plezyy handles all payment processing, taxes, and compliance so creators can focus on what they do best.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white text-center mb-2 tracking-tight">
          Frequently Asked Questions
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-center mb-10">
          Everything you need to know before getting started.
        </p>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => toggle(i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left text-gray-900 dark:text-white font-medium text-base hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                {faq.question}
                <ChevronDown
                  className={`h-5 w-5 text-gray-400 shrink-0 transition-transform duration-200 ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === i && (
                <div className="px-6 pb-4 text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
