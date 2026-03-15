import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TrustAndSafety() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-4xl font-bold mb-2">Plezyy Trust &amp; Safety Policy</h1>
        <p className="text-muted-foreground mb-6">Last updated: February 27, 2026</p>

        <p className="mb-4">
          Plezyy is committed to providing a safe, private, and respectful marketplace where adults
          can offer and purchase virtual services.
        </p>
        <p className="mb-10">
          This Trust &amp; Safety Policy explains how Plezyy protects creators, members, and the
          platform.
        </p>

        {/* 1 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">1. Adults Only Platform</h2>
          <p className="text-muted-foreground mb-3">Plezyy is strictly for adults.</p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-1 mb-4">
            <li>All users must be 18+</li>
            <li>Creators must complete age verification</li>
            <li>Content involving minors is strictly prohibited</li>
            <li>
              Any attempt to bypass age requirements results in immediate removal and reporting where
              required
            </li>
          </ul>
          <p className="text-muted-foreground font-semibold">Zero tolerance.</p>
        </section>

        {/* 2 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">2. Consent &amp; Boundaries</h2>
          <p className="text-muted-foreground mb-3">Plezyy is a consent-based platform.</p>
          <p className="text-muted-foreground mb-3">Creators control:</p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-1 mb-4">
            <li>What they offer</li>
            <li>What they refuse</li>
            <li>How they interact</li>
            <li>Their pricing and availability</li>
          </ul>
          <p className="text-muted-foreground mb-3">
            Members must respect creator boundaries at all times.
          </p>
          <p className="text-muted-foreground">
            Requests that violate boundaries may result in warnings, suspension, or removal.
          </p>
        </section>

        {/* 3 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">3. Prohibited Content &amp; Services</h2>
          <p className="text-muted-foreground mb-3">The following are not allowed:</p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-1 mb-4">
            <li>Any content involving minors (real or simulated where illegal)</li>
            <li>Non-consensual content</li>
            <li>Exploitation, coercion, or trafficking</li>
            <li>Impersonation</li>
            <li>Stolen or leaked content</li>
            <li>Violence that violates platform rules</li>
            <li>Illegal services</li>
            <li>Requests encouraging self-harm or dangerous activity</li>
            <li>Real-world illegal sexual services where prohibited by law</li>
          </ul>
          <p className="text-muted-foreground">Plezyy may remove content without notice.</p>
        </section>

        {/* 4 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">4. Verification &amp; Authenticity</h2>
          <p className="text-muted-foreground mb-3">
            Plezyy uses verification measures to promote trust.
          </p>
          <p className="text-muted-foreground mb-3">These may include:</p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-1 mb-4">
            <li>Age verification</li>
            <li>Identity verification</li>
            <li>Creator verification badges</li>
            <li>Ongoing safety review</li>
            <li>Fraud detection tools</li>
          </ul>
          <p className="text-muted-foreground">
            Plezyy may request additional verification at any time.
          </p>
        </section>

        {/* 5 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">5. Content Protection &amp; Privacy</h2>
          <p className="text-muted-foreground mb-3">
            Plezyy takes steps to protect creator content, including:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-1 mb-4">
            <li>Platform access controls</li>
            <li>Reporting tools</li>
            <li>Policy enforcement against redistribution</li>
            <li>Monitoring for abuse patterns</li>
          </ul>
          <p className="text-muted-foreground mb-3">
            Members may not record, distribute, or resell creator content without permission.
            Unauthorized redistribution may result in permanent bans.
          </p>
          <p className="text-muted-foreground">
            Plezyy cannot guarantee prevention of all leaks but actively enforces protections.
          </p>
        </section>

        {/* 6 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">6. Reporting &amp; Moderation</h2>
          <p className="text-muted-foreground mb-3">Users can report:</p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-1 mb-4">
            <li>Boundary violations</li>
            <li>Harassment</li>
            <li>Suspicious behavior</li>
            <li>Stolen content</li>
            <li>Policy violations</li>
            <li>Safety concerns</li>
          </ul>
          <p className="text-muted-foreground mb-3">
            Plezyy reviews reports and may take action including:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-1 mb-4">
            <li>Content removal</li>
            <li>Warnings</li>
            <li>Refund decisions</li>
            <li>Account restrictions</li>
            <li>Permanent bans</li>
          </ul>
          <p className="text-muted-foreground">Urgent safety issues may be escalated.</p>
        </section>

        {/* 7 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">7. Harassment &amp; Respectful Conduct</h2>
          <p className="text-muted-foreground mb-3">Plezyy requires respectful behavior.</p>
          <p className="text-muted-foreground mb-3">Not allowed:</p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-1 mb-4">
            <li>Harassment</li>
            <li>Threats</li>
            <li>Hate speech</li>
            <li>Pressure after refusal</li>
            <li>Spam or manipulation</li>
            <li>Attempts to bypass platform rules</li>
          </ul>
          <p className="text-muted-foreground">Creators and members may block each other.</p>
        </section>

        {/* 8 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">8. Payments &amp; Off-Platform Risk</h2>
          <p className="text-muted-foreground mb-3">For safety and fraud protection:</p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-1 mb-4">
            <li>Transactions should stay on Plezyy</li>
            <li>Attempts to move payments off platform may result in penalties</li>
            <li>Off-platform interactions increase risk and are discouraged</li>
          </ul>
          <p className="text-muted-foreground">Plezyy may monitor suspicious behavior.</p>
        </section>

        {/* 9 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">9. Fraud &amp; Abuse Prevention</h2>
          <p className="text-muted-foreground mb-3">Plezyy uses systems to detect:</p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-1 mb-4">
            <li>Chargeback abuse</li>
            <li>Scam behavior</li>
            <li>Fake accounts</li>
            <li>Content theft patterns</li>
            <li>Platform manipulation</li>
          </ul>
          <p className="text-muted-foreground">
            Accounts involved in abuse may be suspended immediately.
          </p>
        </section>

        {/* 10 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">10. Creator Safety Tools</h2>
          <p className="text-muted-foreground mb-3">
            Plezyy is designed to support creator control.
          </p>
          <p className="text-muted-foreground mb-3">Creators can:</p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-1 mb-4">
            <li>Set boundaries</li>
            <li>Decline requests</li>
            <li>Block members</li>
            <li>Require prepayment</li>
            <li>Limit custom requests</li>
            <li>Define interaction rules</li>
          </ul>
          <p className="text-muted-foreground">Safety features will expand over time.</p>
        </section>

        {/* 11 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">11. Member Safety</h2>
          <p className="text-muted-foreground mb-3">Plezyy also protects members.</p>
          <p className="text-muted-foreground mb-3">Members receive:</p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-1 mb-4">
            <li>Clear service descriptions</li>
            <li>Transparent pricing</li>
            <li>Reporting tools</li>
            <li>Dispute review</li>
            <li>Verified creator indicators</li>
          </ul>
          <p className="text-muted-foreground">Misleading offers may be removed.</p>
        </section>

        {/* 12 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">12. Enforcement</h2>
          <p className="text-muted-foreground mb-3">
            Plezyy may take action without notice when necessary to protect users or comply with
            legal obligations.
          </p>
          <p className="text-muted-foreground mb-3">Enforcement may include:</p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-1">
            <li>Content removal</li>
            <li>Account suspension</li>
            <li>Permanent bans</li>
            <li>Payment holds</li>
            <li>Reporting to authorities where required</li>
          </ul>
        </section>

        {/* 13 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">13. Continuous Improvement</h2>
          <p className="text-muted-foreground mb-3">Trust &amp; Safety is ongoing.</p>
          <p className="text-muted-foreground mb-3">Plezyy will continue improving:</p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-1">
            <li>Moderation tools</li>
            <li>Creator protections</li>
            <li>Content safeguards</li>
            <li>Fraud detection</li>
            <li>User reporting systems</li>
          </ul>
        </section>

        {/* 14 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">14. Contact</h2>
          <p className="text-muted-foreground mb-3">To report safety concerns:</p>
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
            <li>In-platform reporting tools: Available in user dashboard</li>
          </ul>
        </section>
      </main>

      <Footer />
    </div>
  );
}
