import { supabase } from "./supabase";

export interface VerificationResponse {
  magicLink: string;
  scanRef: string;
}

/**
 * Calls the create-verification edge function to generate an iDenfy Magic Link.
 * Redirects the user to iDenfy's hosted verification flow.
 */
export async function startIdenfyVerification(params: {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string; // YYYY-MM-DD
}): Promise<VerificationResponse> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("You must be signed in to start verification.");
  }

  const response = await supabase.functions.invoke("create-verification", {
    body: params,
  });

  if (response.error) {
    throw new Error(response.error.message || "Failed to start verification");
  }

  return response.data as VerificationResponse;
}

/**
 * Check the current verification status for the logged-in creator.
 */
export async function getVerificationStatus(): Promise<{
  status: "pending" | "verified" | "rejected" | null;
  rejectionReason?: string;
}> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { status: null };

  // Get creator profile first
  const { data: creator } = await supabase
    .from("creator_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!creator) return { status: null };

  const { data: verification } = await supabase
    .from("creator_verifications")
    .select("status, rejection_reason")
    .eq("creator_id", creator.id)
    .single();

  if (!verification) return { status: null };

  return {
    status: verification.status as "pending" | "verified" | "rejected",
    rejectionReason: verification.rejection_reason ?? undefined,
  };
}
