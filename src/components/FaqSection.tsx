import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
  return (
    <section className="py-20 bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-2 font-['Playfair_Display']">
          Frequently Asked Questions
        </h2>
        <p className="text-muted-foreground text-center mb-10">
          Everything you need to know before getting started.
        </p>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left text-base">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
