// Supabase connection. Both values are meant to be public.
// NEVER put the secret (service_role) key in this file or anywhere in the site.
const SUPABASE_URL = "https://monriqwuhiwunqrdffao.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_vWbk2Kf64RBq5b1LeCOXQQ_GZN9IRws";

// Length of the email sign-in code. Must match Supabase:
// Authentication → Sign In / Providers → Email → "Email OTP Length".
const OTP_LENGTH = 6;
