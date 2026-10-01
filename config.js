// Supabase connection. Both values are meant to be public.
// NEVER put the secret (service_role) key in this file or anywhere in the site.
const SUPABASE_URL = "https://monriqwuhiwunqrdffao.supabase.co";
// Google OAuth Client ID (public by design). The client SECRET lives only in Supabase.
const GOOGLE_CLIENT_ID = "684287820535-5dh585uinpli7afbirco3r33jejkclqi.apps.googleusercontent.com";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_vWbk2Kf64RBq5b1LeCOXQQ_GZN9IRws";

// Length of the email sign-in code. Must match Supabase:
// Authentication → Sign In / Providers → Email → "Email OTP Length".
const OTP_LENGTH = 6;

// YouVersion sign-in. The App Key is public (it identifies the site to YouVersion).
// Leave it empty to show the button as "coming soon".
// The redirect URL must EXACTLY match the one registered at platform.youversion.com.
const YOUVERSION_APP_KEY = "";
const YOUVERSION_REDIRECT_URI = "https://seeklikesilver.com/";
