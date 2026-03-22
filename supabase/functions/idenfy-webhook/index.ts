import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  // Only accept POST from iDenfy
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    // Optional: Verify the iDenfy signature header for security
    // const signature = req.headers.get("idenfy-signature");
    // TODO: Validate signature using your iDenfy webhook secret

    const payload = await req.json();
    console.log("iDenfy webhook received:", JSON.stringify(payload));

    const { clientId, scanRef, status } = payload;
    // status.overall can be: "APPROVED", "DENIED", "SUSPECTED", "REVIEWING"

    if (!scanRef || !status) {
      return new Response("Invalid payload", { status: 400 });
    }

    // Use service role to bypass RLS
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const overallStatus = status.overall || status.autoDocument;
    const mappedStatus = overallStatus === "APPROVED" ? "verified" : "rejected";

    // Update the verification record
    const { error: verificationError } = await supabase
      .from("creator_verifications")
      .update({
        status: mappedStatus,
        idenfy_raw_response: payload,
        verified_at: mappedStatus === "verified" ? new Date().toISOString() : null,
        // Populate name from iDenfy's extracted data if available
        full_legal_name:
          payload.data?.docFirstName && payload.data?.docLastName
            ? `${payload.data.docFirstName} ${payload.data.docLastName}`
            : undefined,
        date_of_birth: payload.data?.docDateOfBirth || undefined,
        rejection_reason:
          mappedStatus === "rejected"
            ? payload.status?.mismatchTags?.join(", ") || "Verification failed"
            : null,
      })
      .eq("idenfy_scan_ref", scanRef);

    if (verificationError) {
      console.error("Failed to update verification:", verificationError);
      return new Response("Database error", { status: 500 });
    }

    // If approved, also mark the creator profile as verified
    if (mappedStatus === "verified") {
      // clientId is the user's auth.users id
      const { error: profileError } = await supabase
        .from("creator_profiles")
        .update({ is_verified: true })
        .eq("user_id", clientId);

      if (profileError) {
        console.error("Failed to update creator profile:", profileError);
      }
    }

    return new Response("OK", { status: 200 });
  } catch (err) {
    console.error("Webhook error:", err);
    return new Response("Internal server error", { status: 500 });
  }
});
