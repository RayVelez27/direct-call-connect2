import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { firstName, lastName, dateOfBirth } = await req.json();

    // Authenticate the caller via Supabase JWT
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Look up the creator profile for this user
    const { data: creatorProfile, error: profileError } = await supabase
      .from("creator_profiles")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (profileError || !creatorProfile) {
      return new Response(
        JSON.stringify({ error: "Creator profile not found. Complete profile setup first." }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Build the iDenfy token request
    const idenfyApiKey = Deno.env.get("IDENFY_API_KEY");
    const idenfyApiSecret = Deno.env.get("IDENFY_API_SECRET");

    if (!idenfyApiKey || !idenfyApiSecret) {
      return new Response(
        JSON.stringify({ error: "iDenfy credentials not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const siteUrl = Deno.env.get("SITE_URL") || "https://plezyy.netlify.app";
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;

    const tokenPayload: Record<string, unknown> = {
      clientId: user.id,
      // Redirect URLs — user returns here after iDenfy verification
      successUrl: `${siteUrl}/onboarding-identity?status=success`,
      errorUrl: `${siteUrl}/onboarding-identity?status=error`,
      unverifiedUrl: `${siteUrl}/onboarding-identity?status=unverified`,
      // Webhook — iDenfy POSTs the final result here
      callbackUrl: `${supabaseUrl}/functions/v1/idenfy-webhook`,
      locale: "en",
      expiryTime: 3600, // token valid for 1 hour
      sessionLength: 600, // 10 min to complete once started
    };

    // Pre-fill personal data if provided (helps iDenfy match faster)
    if (firstName) tokenPayload.firstName = firstName.toUpperCase();
    if (lastName) tokenPayload.lastName = lastName.toUpperCase();
    if (dateOfBirth) tokenPayload.dateOfBirth = dateOfBirth; // YYYY-MM-DD

    // Call iDenfy API to generate a verification token
    const idenfyResponse = await fetch("https://ivs.idenfy.com/api/v2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${btoa(`${idenfyApiKey}:${idenfyApiSecret}`)}`,
      },
      body: JSON.stringify(tokenPayload),
    });

    if (!idenfyResponse.ok) {
      const errorBody = await idenfyResponse.text();
      console.error("iDenfy token error:", idenfyResponse.status, errorBody);
      return new Response(
        JSON.stringify({ error: "Failed to create verification session" }),
        {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const idenfyData = await idenfyResponse.json();

    // Use service role client for the DB write (bypasses RLS)
    const adminSupabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Upsert the verification record (one per creator)
    const { error: dbError } = await adminSupabase
      .from("creator_verifications")
      .upsert(
        {
          creator_id: creatorProfile.id,
          full_legal_name: firstName && lastName ? `${firstName} ${lastName}` : null,
          date_of_birth: dateOfBirth || null,
          idenfy_scan_ref: idenfyData.scanRef,
          idenfy_auth_token: idenfyData.authToken,
          status: "pending",
        },
        { onConflict: "creator_id" }
      );

    if (dbError) {
      console.error("DB upsert error:", dbError);
      return new Response(
        JSON.stringify({ error: "Failed to save verification record" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Return the magic link to the frontend
    const magicLink = `https://ivs.idenfy.com/api/v2/redirect?authToken=${idenfyData.authToken}`;

    return new Response(
      JSON.stringify({
        magicLink,
        scanRef: idenfyData.scanRef,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
