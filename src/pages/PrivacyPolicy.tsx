import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground mb-10">Last updated: March 31, 2026</p>

        <p className="mb-4">
          Plezyy Inc. ("Plezyy", "we", "us", or "our") is committed to protecting your privacy. This
          Privacy Policy explains how we collect, use, disclose, and safeguard your information when you
          use our platform, website, and services (collectively, the "Platform").
        </p>
        <p className="mb-10">
          By using Plezyy, you consent to the practices described in this Privacy Policy.
        </p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>

          <h3 className="text-lg font-medium mb-3 mt-6">1.1 Information You Provide</h3>
          <ul className="list-disc pl-6 text-muted-foreground space-y-1 mb-4">
            <li>Account registration details (name, email address, password, date of birth)</li>
            <li>Profile information (display name, bio, tagline, profile photos)</li>
            <li>Identity verification documents (government-issued ID, selfie, address)</li>
            <li>Payment information (processed by third-party payment providers)</li>
            <li>Communications (messages, support tickets, feedback)</li>
            <li>Content you upload (photos, videos, service descriptions)</li>
          </ul>

          <h3 className="text-lg font-medium mb-3 mt-6">1.2 Information Collected Automatically</h3>
          <ul className="list-disc pl-6 text-muted-foreground space-y-1 mb-4">
            <li>Device information (browser type, operating system, device identifiers)</li>
            <li>Usage data (pages visited, features used, time spent, click patterns)</li>
            <li>IP address and approximate location</li>
            <li>Cookies and similar tracking technologies</li>
            <li>Referral source and search terms</li>
          </ul>

          <h3 className="text-lg font-medium mb-3 mt-6">1.3 Information from Third Parties</h3>
          <ul className="list-disc pl-6 text-muted-foreground space-y-1">
            <li>Identity verification results from our KYC provider (iDenfy)</li>
            <li>OAuth profile data from Google or Apple sign-in</li>
            <li>Payment transaction data from payment processors</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
          <p className="text-muted-foreground mb-3">We use the information we collect to:</p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-1">
            <li>Create and manage your account</li>
            <li>Verify your identity and age</li>
            <li>Process transactions and payouts</li>
            <li>Provide, maintain, and improve the Platform</li>
            <li>Personalize your experience and recommendations</li>
            <li>Facilitate communication between members and creators</li>
            <li>Detect and prevent fraud, abuse, and security threats</li>
            <li>Enforce our Terms of Use and community guidelines</li>
            <li>Send service-related communications and updates</li>
            <li>Comply with legal obligations and respond to legal requests</li>
            <li>Conduct analytics and research to improve our services</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">3. How We Share Your Information</h2>
          <p className="text-muted-foreground mb-3">
            We do not sell your personal information. We may share your information with:
          </p>

          <h3 className="text-lg font-medium mb-3 mt-6">3.1 Other Users</h3>
          <p className="text-muted-foreground mb-4">
            Your public profile information (display name, bio, profile photo, categories) is visible to
            other users. Messages are shared only with the intended recipient.
          </p>

          <h3 className="text-lg font-medium mb-3">3.2 Service Providers</h3>
          <p className="text-muted-foreground mb-3">
            We share information with trusted third parties who help us operate the Platform:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-1 mb-4">
            <li>Payment processors (Stripe) for transaction processing</li>
            <li>Identity verification providers (iDenfy) for KYC compliance</li>
            <li>Cloud hosting and infrastructure providers (Supabase)</li>
            <li>Analytics providers for platform improvement</li>
            <li>Email and communication service providers</li>
          </ul>

          <h3 className="text-lg font-medium mb-3">3.3 Legal and Safety</h3>
          <p className="text-muted-foreground mb-3">
            We may disclose your information when required to:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-1">
            <li>Comply with applicable law, regulation, or legal process</li>
            <li>Respond to lawful requests from public authorities</li>
            <li>Protect the rights, safety, or property of Plezyy, our users, or the public</li>
            <li>Detect, prevent, or address fraud, security, or technical issues</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">4. Cookies and Tracking Technologies</h2>
          <p className="text-muted-foreground mb-3">We use cookies and similar technologies to:</p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-1 mb-4">
            <li>Keep you signed in</li>
            <li>Remember your preferences</li>
            <li>Understand how you use the Platform</li>
            <li>Deliver relevant content and recommendations</li>
          </ul>
          <p className="text-muted-foreground">
            You can manage cookie preferences through your browser settings. Disabling cookies may affect
            Platform functionality.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
          <p className="text-muted-foreground mb-3">
            We implement industry-standard security measures to protect your information, including:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-1 mb-4">
            <li>Encryption of data in transit (TLS/SSL) and at rest</li>
            <li>Secure authentication with hashed passwords</li>
            <li>Row-level security policies on database access</li>
            <li>Regular security audits and vulnerability assessments</li>
            <li>Access controls limiting employee access to personal data</li>
          </ul>
          <p className="text-muted-foreground">
            While we strive to protect your information, no method of transmission or storage is 100%
            secure. You are responsible for maintaining the security of your account credentials.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">6. Data Retention</h2>
          <p className="text-muted-foreground mb-3">
            We retain your information for as long as your account is active or as needed to provide
            services. We may also retain information as required for:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-1 mb-4">
            <li>Legal compliance and regulatory obligations</li>
            <li>Dispute resolution and fraud prevention</li>
            <li>Enforcement of our Terms of Use</li>
            <li>Legitimate business purposes</li>
          </ul>
          <p className="text-muted-foreground">
            Identity verification records are retained for a minimum of 5 years after account closure, as
            required by applicable regulations.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">7. Your Rights</h2>
          <p className="text-muted-foreground mb-3">
            Depending on your location, you may have the following rights:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-1 mb-4">
            <li><strong>Access:</strong> Request a copy of the personal data we hold about you</li>
            <li><strong>Correction:</strong> Request correction of inaccurate or incomplete data</li>
            <li><strong>Deletion:</strong> Request deletion of your personal data, subject to legal retention requirements</li>
            <li><strong>Portability:</strong> Request your data in a machine-readable format</li>
            <li><strong>Objection:</strong> Object to processing of your data for certain purposes</li>
            <li><strong>Withdrawal of consent:</strong> Withdraw consent where processing is based on consent</li>
          </ul>
          <p className="text-muted-foreground">
            To exercise these rights, contact us at{" "}
            <a href="mailto:privacy@plezyy.com" className="text-primary hover:underline">
              privacy@plezyy.com
            </a>
            . We will respond within 30 days.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">8. California Privacy Rights (CCPA)</h2>
          <p className="text-muted-foreground mb-3">
            If you are a California resident, you have additional rights under the California Consumer
            Privacy Act (CCPA):
          </p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-1 mb-4">
            <li>Right to know what personal information is collected, used, and shared</li>
            <li>Right to delete personal information</li>
            <li>Right to opt out of the sale of personal information (we do not sell your data)</li>
            <li>Right to non-discrimination for exercising your privacy rights</li>
          </ul>
          <p className="text-muted-foreground">
            To make a CCPA request, email{" "}
            <a href="mailto:privacy@plezyy.com" className="text-primary hover:underline">
              privacy@plezyy.com
            </a>{" "}
            with the subject line "CCPA Request."
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">9. International Data Transfers</h2>
          <p className="text-muted-foreground">
            Your information may be transferred to and processed in countries other than your country of
            residence. We ensure appropriate safeguards are in place to protect your data in compliance with
            applicable data protection laws, including standard contractual clauses where required.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">10. Children's Privacy</h2>
          <p className="text-muted-foreground">
            Plezyy is strictly for adults aged 18 and older. We do not knowingly collect information from
            anyone under 18. If we learn that we have collected personal data from a minor, we will delete
            that information immediately and terminate the associated account.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">11. Changes to This Policy</h2>
          <p className="text-muted-foreground">
            We may update this Privacy Policy from time to time. We will notify you of material changes by
            posting the updated policy on the Platform and updating the "Last updated" date. Your continued
            use of the Platform after changes are posted constitutes acceptance of the revised policy.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">12. Contact Us</h2>
          <p className="text-muted-foreground mb-3">
            If you have questions or concerns about this Privacy Policy, please contact us:
          </p>
          <ul className="list-none text-muted-foreground space-y-1">
            <li>
              Privacy inquiries:{" "}
              <a href="mailto:privacy@plezyy.com" className="text-primary hover:underline">
                privacy@plezyy.com
              </a>
            </li>
            <li>
              General support:{" "}
              <a href="mailto:support@plezyy.com" className="text-primary hover:underline">
                support@plezyy.com
              </a>
            </li>
            <li>
              Mailing address: Plezyy Inc., United States
            </li>
          </ul>
        </section>
      </main>

      <Footer />
    </div>
  );
}
