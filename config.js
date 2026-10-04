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
const YOUVERSION_APP_KEY = "AisS92WgjEzhGeTiAqOmFem9YoEtGY8GEMT1f9jUc8jDzd1A";
const YOUVERSION_REDIRECT_URI = "https://seeklikesilver.com/";

// Supabase function addresses ("slugs"). Supabase fixes a function's address when it is
// first deployed; renaming it later doesn't change the address.
const MERGE_FUNCTION = "smooth-endpoint"; // the merge-accounts function (supabase/functions/merge-accounts)
const DELETE_FUNCTION = "delete-account"; // the delete-account function (supabase/functions/delete-account)

