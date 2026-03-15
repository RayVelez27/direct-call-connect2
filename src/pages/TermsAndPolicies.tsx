import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TermsAndPolicies() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-4xl font-bold mb-2">Plezyy Creator (Merchant) Terms &amp; Policies</h1>
        <p className="text-muted-foreground mb-10">Last updated: February 27, 2026</p>

        <p className="mb-4">
          These Creator Terms ("Terms") govern your use of Plezyy as a creator, seller, provider, or
          merchant ("Creator", "you").
        </p>
        <p className="mb-10">By creating a creator account, you agree to these Terms.</p>

        {/* 1 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">1. Platform Overview</h2>
          <p className="text-muted-foreground leading-relaxed">
            Plezyy is a marketplace that allows adult creators to offer and sell virtual services,
            digital content, and online experiences to members. Plezyy acts as a technology platform
            connecting creators and members. Creators operate as independent sellers.
          </p>
        </section>

        {/* 2 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">2. Eligibility</h2>
          <p className="text-muted-foreground mb-3">To become a creator, you must:</p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-1 mb-4">
            <li>Be at least 18 years old</li>
            <li>Provide accurate registration information</li>
            <li>Complete required verification</li>
            <li>Have the legal right to sell your content and services</li>
            <li>Comply with all applicable laws</li>
          </ul>
          <p className="text-muted-foreground">
            Plezyy may suspend or remove accounts that fail verification.
          </p>
        </section>

        {/* 3 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">3. Creator Responsibility</h2>
          <p className="text-muted-foreground mb-3">Creators are responsible for:</p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-1 mb-4">
            <li>The services they offer</li>
            <li>Content they upload or deliver</li>
            <li>Setting prices</li>
            <li>Defining boundaries</li>
            <li>Communicating honestly with members</li>
            <li>Ensuring all content involves consenting adults</li>
          </ul>
          <p className="text-muted-foreground">
            Creators may not upload content involving minors, non-consensual material, or illegal
            activity.
          </p>
        </section>

        {/* 4 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">4. Independent Seller Status</h2>
          <p className="text-muted-foreground mb-3">
            Creators are independent merchants — not employees of Plezyy.
          </p>
          <p className="text-muted-foreground mb-3">Creators control:</p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-1 mb-4">
            <li>What they offer</li>
            <li>Pricing</li>
            <li>Availability</li>
            <li>Acceptance of requests</li>
          </ul>
          <p className="text-muted-foreground">
            Creators are responsible for taxes and business obligations in their jurisdiction.
          </p>
        </section>

        {/* 5 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">5. Payments &amp; Fees</h2>
          <p className="text-muted-foreground mb-3">
            Plezyy processes payments on behalf of creators.
          </p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-1 mb-4">
            <li>Creators earn revenue from completed purchases</li>
            <li>Platform fees may apply</li>
            <li>Payout schedules will be defined in the creator dashboard</li>
            <li>Plezyy may hold funds for fraud, disputes, or policy review</li>
          </ul>
          <p className="text-muted-foreground">
            Chargebacks or disputes may result in balance adjustments.
          </p>
        </section>

        {/* 6 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">6. Content Ownership</h2>
          <p className="text-muted-foreground mb-3">
            Creators retain ownership of their content.
          </p>
          <p className="text-muted-foreground mb-3">
            By using Plezyy, creators grant Plezyy a limited license to:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-1 mb-4">
            <li>Host content</li>
            <li>Display content within the platform</li>
            <li>Promote creator profiles</li>
            <li>Operate marketplace features</li>
          </ul>
          <p className="text-muted-foreground">
            This license ends when content is removed, except where required for legal or operational
            reasons.
          </p>
        </section>

        {/* 7 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">7. Content Protection &amp; Redistribution</h2>
          <p className="text-muted-foreground mb-3">
            Members are prohibited from redistributing creator content without permission.
          </p>
          <p className="text-muted-foreground mb-3">Creators may:</p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-1 mb-4">
            <li>Define redistribution rules</li>
            <li>License content externally</li>
            <li>Authorize third-party use</li>
          </ul>
          <p className="text-muted-foreground">
            Plezyy may provide content protection tools but cannot guarantee prevention of leaks.
          </p>
        </section>

        {/* 8 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">8. Acceptable Use</h2>
          <p className="text-muted-foreground mb-3">Creators may not:</p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-1 mb-4">
            <li>Offer illegal services</li>
            <li>Share non-consensual content</li>
            <li>Impersonate others</li>
            <li>Sell stolen content</li>
            <li>Attempt to move transactions off platform to avoid fees</li>
            <li>Harass or exploit members</li>
          </ul>
          <p className="text-muted-foreground">
            Plezyy may remove content or accounts that violate policies.
          </p>
        </section>

        {/* 9 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">9. Safety &amp; Boundaries</h2>
          <p className="text-muted-foreground mb-3">
            Creators control their boundaries and may refuse any request.
          </p>
          <p className="text-muted-foreground mb-3">Plezyy encourages:</p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-1 mb-4">
            <li>Clear service descriptions</li>
            <li>Transparent expectations</li>
            <li>Respectful interactions</li>
            <li>Consent-based communication</li>
          </ul>
          <p className="text-muted-foreground">
            Members who violate boundaries may be restricted.
          </p>
        </section>

        {/* 10 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">10. Disputes &amp; Refunds</h2>
          <p className="text-muted-foreground mb-3">
            Plezyy may review disputes between members and creators.
          </p>
          <p className="text-muted-foreground mb-3">Possible outcomes:</p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-1 mb-4">
            <li>Refund</li>
            <li>Partial refund</li>
            <li>No refund</li>
            <li>Account action</li>
          </ul>
          <p className="text-muted-foreground">
            Plezyy decisions are final where permitted by law.
          </p>
        </section>

        {/* 11 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">11. Account Suspension &amp; Termination</h2>
          <p className="text-muted-foreground mb-3">
            Plezyy may suspend or terminate creator accounts for:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-1 mb-4">
            <li>Policy violations</li>
            <li>Fraud risk</li>
            <li>Verification failure</li>
            <li>Legal requirements</li>
            <li>Safety concerns</li>
          </ul>
          <p className="text-muted-foreground mb-3">
            Creators may stop using Plezyy at any time.
          </p>
          <p className="text-muted-foreground">
            Outstanding balances may be processed according to payout policies.
          </p>
        </section>

        {/* 12 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">12. Taxes</h2>
          <p className="text-muted-foreground mb-3">Creators are responsible for:</p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-1 mb-4">
            <li>Reporting income</li>
            <li>Paying taxes</li>
            <li>Business registration if required</li>
          </ul>
          <p className="text-muted-foreground">
            Plezyy may provide transaction records but does not provide tax advice.
          </p>
        </section>

        {/* 13 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">13. Platform Changes</h2>
          <p className="text-muted-foreground mb-3">Plezyy may update:</p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-1 mb-4">
            <li>Features</li>
            <li>Fees</li>
            <li>Policies</li>
            <li>Requirements</li>
          </ul>
          <p className="text-muted-foreground mb-3">
            Creators will be notified of material changes.
          </p>
          <p className="text-muted-foreground">
            Continued use means acceptance of updates.
          </p>
        </section>

        {/* 14 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">14. Limitation of Liability</h2>
          <p className="text-muted-foreground mb-3">
            Plezyy provides the platform "as is."
          </p>
          <p className="text-muted-foreground mb-3">Plezyy is not responsible for:</p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-1 mb-4">
            <li>Creator earnings expectations</li>
            <li>Member behavior outside the platform</li>
            <li>Unauthorized redistribution of content</li>
            <li>Business outcomes</li>
          </ul>
          <p className="text-muted-foreground">
            To the extent permitted by law, Plezyy's liability is limited to platform fees paid.
          </p>
        </section>

        {/* 15 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">15. Contact</h2>
          <p className="text-muted-foreground mb-3">
            For creator support or policy questions:
          </p>
          <ul className="list-none text-muted-foreground space-y-1">
            <li>
              Email:{" "}
              <a
                href="mailto:support@plezyy.com"
                className="text-primary hover:underline"
              >
                support@plezyy.com
              </a>
            </li>
            <li>Platform: Creator dashboard support</li>
          </ul>
        </section>
      </main>

      <Footer />
    </div>
  );
}
