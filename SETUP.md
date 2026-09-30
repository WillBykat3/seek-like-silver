# Seek Like Silver: Setup Guide

Do these in order. Steps 1–4 get the site live with email-code sign-in; step 5 adds Google.

## Files

| File | What it is |
|---|---|
| `index.html` | The page |
| `styles.css` | The look |
| `app.js` | How it works: questions, sign-in, saving |
| `questions.js` | The question bank and denomination sources. Edit this to add questions. |
| `config.js` | Your Supabase URL and publishable key (both safe to be public) |
| `supabase-setup.sql` | Creates the database tables and security rules (run once in Supabase) |

---

## 1. Set up the database (2 minutes)

1. In your Supabase project, open **SQL Editor** and start a new query.
2. Open `supabase-setup.sql`, copy all of it, paste it in, and click **Run**.
3. You should see "Success. No rows returned." Under **Table Editor** you'll now see `profiles` and `answers`.

## 2. Turn on 6-digit email codes (2 minutes)

By default Supabase emails a sign-in *link*. The site asks for a *code*, so change the email:

1. Go to **Authentication → Emails** (email templates) and open the **Magic Link** template.
2. Replace its body with:

   ```html
   <h2>Your Seek Like Silver sign-in code</h2>
   <p>Enter this code to sign in: <strong>{{ .Token }}</strong></p>
   <p>If you didn't request this, you can ignore this email.</p>
   ```
3. Save.

**Note:** Supabase's built-in email sender has a low hourly limit, fine for you and a few testers. Before sharing widely, connect a free email service under **Custom SMTP**. We can do that together later.

## 3. Put the site on GitHub Pages (5 minutes)

1. On GitHub, create a new repository named `seek-like-silver`. Make it **Public**; free GitHub Pages requires that. Nothing in these files is secret.
2. Click **Add file → Upload files**, drag in all the files, and commit.
3. Go to **Settings → Pages**. Under "Build and deployment," choose **Deploy from a branch**, branch **main**, folder **/ (root)**, then Save.
4. After a minute or two your site is live at:
   `https://YOUR-GITHUB-USERNAME.github.io/seek-like-silver/`

## 4. Tell Supabase where your site lives (1 minute)

Sign-in only returns to addresses you approve.

1. In Supabase, go to **Authentication → URL Configuration**.
2. **Site URL:** `https://YOUR-GITHUB-USERNAME.github.io/seek-like-silver/`
3. Under **Redirect URLs**, add the same address.
4. Save.

Now test it: open the site, answer a question, press **Save answer**, and sign in with the email code.

## 5. Add "Continue with Google" (10–15 minutes)

1. Go to **console.cloud.google.com** and create a new project (e.g. "Seek Like Silver").
2. Open **Google Auth Platform** (or "OAuth consent screen"). Set it up as **External**, with app name "Seek Like Silver" and your email as support contact.
3. Go to **Clients** (or **Credentials → Create credentials → OAuth client ID**) and choose **Web application**.
   - **Authorized JavaScript origins:** `https://YOUR-GITHUB-USERNAME.github.io`
   - **Authorized redirect URIs:** `https://monriqwuhiwunqrdffao.supabase.co/auth/v1/callback`
4. Create it, then copy the **Client ID** and **Client secret**.
5. In Supabase: **Authentication → Sign In / Providers → Google**. Turn it on and paste both values. Save.

The Google client secret goes **only** into the Supabase dashboard, never into the site's files.

Google's menus get renamed from time to time; if a label doesn't match, look for the closest equivalent, or ask me.

---

## Later

- **Custom domain (seeklikesilver.com):** GitHub **Settings → Pages → Custom domain**, plus DNS records at your registrar. Then update the Site URL and Redirect URLs in step 4, and the JavaScript origin in step 5.
- **YouVersion sign-in:** needs a YouVersion Platform app plus Supabase's custom OAuth provider support. Not wired up yet; the button shows "coming soon."
- **More questions:** add them to `questions.js`. Never change or reuse an existing `id`, because saved answers point to it.

## If something doesn't work

- **"Couldn't save" or answers don't appear:** re-run `supabase-setup.sql` (it's safe to run again).
- **Google sign-in shows `redirect_uri_mismatch`:** the redirect URI in Google doesn't exactly match step 5.3.
- **Signed in with Google but landed on the wrong page:** check the URLs in step 4.
- **No email code arrives:** check spam, wait a minute (one code per 60 seconds), and make sure step 2 is saved.
