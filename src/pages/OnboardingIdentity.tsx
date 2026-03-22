import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Shield,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";

const IDENFY_MAGIC_LINK =
  "https://ivs.idenfy.com/api/v2/magic-link-redirect?token=RNMb3hSLQOKmvOrPxCMHt9fIAlVUX0Jjkx6vnRve";

const steps = [
  { label: "Identity" },
  { label: "Address" },
  { label: "Bank Details" },
  { label: "Review" },
];

export default function OnboardingIdentity() {
  const navigate = useNavigate();

  // Since iDenfy redirects back to /onboarding-identity with no query params,
  // we track whether the user has been sent to iDenfy via sessionStorage
  const [verificationStatus, setVerificationStatus] = useState<
    "idle" | "pending" | "verified" | "rejected"
  >("idle");

  useEffect(() => {
    // Check if user was previously sent to iDenfy
    const sent = sessionStorage.getItem("idenfy_verification_started");
    if (sent === "true") {
      // User has returned from iDenfy — show pending status
      setVerificationStatus("pending");
      sessionStorage.removeItem("idenfy_verification_started");
      toast.success("Verification submitted! We'll review it shortly.");
    }
  }, []);

  const handleStartVerification = () => {
    // Mark that we're sending the user to iDenfy so we can detect their return
    sessionStorage.setItem("idenfy_verification_started", "true");
    window.location.href = IDENFY_MAGIC_LINK;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8 sm:py-12">
        {/* Title & Progress */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Creator Onboarding</h1>
          <p className="text-sm text-muted-foreground mt-1">Step 1 of 4</p>
          <Progress value={25} className="mt-4 h-2 max-w-md mx-auto" />
        </div>

        {/* Steps */}
        <div className="flex justify-center gap-2 sm:gap-4 mb-8 flex-wrap">
          {steps.map((step, i) => (
            <div
              key={step.label}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                i === 0
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <span className="hidden sm:inline">{step.label}</span>
              <span className="sm:hidden">{step.label.slice(0, 3)}</span>
            </div>
          ))}
        </div>

        {/* Security Notice */}
        <div className="flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-xl p-4 mb-8 max-w-2xl mx-auto">
          <Shield className="h-5 w-5 text-primary shrink-0" />
          <p className="text-sm text-muted-foreground">
            Your data is encrypted and used only for identity verification in compliance with global
            financial standards. Verification is powered by iDenfy.
          </p>
        </div>

        {/* Form Card */}
        <div className="max-w-2xl mx-auto bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-foreground">Identity Verification</h2>
            <p className="text-sm text-muted-foreground mt-1">
              We use iDenfy to securely verify your identity. You'll be redirected to complete a
              quick ID check — just have your government-issued ID ready.
            </p>
          </div>

          {/* Verified State */}
          {verificationStatus === "verified" && (
            <div className="space-y-6">
              <div className="border border-green-500/30 bg-green-500/5 rounded-xl p-6 text-center">
                <CheckCircle2 className="h-10 w-10 text-green-500 mx-auto mb-3" />
                <p className="font-semibold text-green-700 dark:text-green-400 text-lg">
                  Identity Verified
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Your identity has been confirmed. You can proceed to the next step.
                </p>
              </div>
              <div className="flex justify-between items-center pt-4">
                <Button variant="ghost" className="gap-2 text-muted-foreground" asChild>
                  <Link to="/onboarding">
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Link>
                </Button>
                <Button
                  className="rounded-xl font-semibold px-6"
                  onClick={() => navigate("/onboarding-payouts")}
                >
                  Continue to Address
                </Button>
              </div>
            </div>
          )}

          {/* Pending State */}
          {verificationStatus === "pending" && (
            <div className="space-y-6">
              <div className="border border-yellow-500/30 bg-yellow-500/5 rounded-xl p-6 text-center">
                <Clock className="h-10 w-10 text-yellow-500 mx-auto mb-3" />
                <p className="font-semibold text-yellow-700 dark:text-yellow-400 text-lg">
                  Verification Submitted
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Your identity is being reviewed. This usually takes a few minutes. You can
                  continue setting up your profile while we process your verification.
                </p>
              </div>
              <div className="flex justify-between items-center pt-4">
                <Button variant="ghost" className="gap-2 text-muted-foreground" asChild>
                  <Link to="/onboarding">
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Link>
                </Button>
                <Button
                  className="rounded-xl font-semibold px-6"
                  onClick={() => navigate("/onboarding-payouts")}
                >
                  Continue to Address
                </Button>
              </div>
            </div>
          )}

          {/* Rejected State */}
          {verificationStatus === "rejected" && (
            <div className="space-y-6">
              <div className="border border-red-500/30 bg-red-500/5 rounded-xl p-6 text-center">
                <XCircle className="h-10 w-10 text-red-500 mx-auto mb-3" />
                <p className="font-semibold text-red-700 dark:text-red-400 text-lg">
                  Verification Failed
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  We couldn't verify your identity. Please try again with a valid government-issued
                  ID.
                </p>
              </div>

              <VerifyButton onClick={handleStartVerification} />

              <div className="flex justify-between items-center pt-4">
                <Button variant="ghost" className="gap-2 text-muted-foreground" asChild>
                  <Link to="/onboarding">
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Link>
                </Button>
              </div>
            </div>
          )}

          {/* Idle State — Initial */}
          {verificationStatus === "idle" && (
            <div className="space-y-6">
              {/* How it works */}
              <div className="bg-muted/50 rounded-xl p-4 space-y-3">
                <p className="text-sm font-medium text-foreground">How verification works:</p>
                <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                  <li>
                    Click the button below — you'll be redirected to our verification partner
                  </li>
                  <li>
                    Take a photo of your government-issued ID (passport, driver's license, or
                    national ID)
                  </li>
                  <li>Take a quick selfie for liveness verification</li>
                  <li>You'll be redirected back here once complete</li>
                </ol>
              </div>

              <VerifyButton onClick={handleStartVerification} />

              <p className="text-xs text-center text-muted-foreground">
                You'll be securely redirected to iDenfy to complete verification.
                <br />
                Your documents are processed securely and never stored on our servers.
              </p>

              <div className="flex justify-between items-center pt-4">
                <Button variant="ghost" className="gap-2 text-muted-foreground" asChild>
                  <Link to="/onboarding">
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 mt-8">
        <p className="text-center text-xs text-muted-foreground">
          &copy; 2025 Plezyy Inc. All rights reserved. Identity verification powered by iDenfy.
        </p>
      </footer>
    </div>
  );
}

function VerifyButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      onClick={onClick}
      className="w-full h-12 rounded-xl font-semibold text-base gap-2"
    >
      <ExternalLink className="h-4 w-4" />
      Verify My Identity
    </Button>
  );
}
