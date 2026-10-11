# Seek Like Silver: Setup Guide

Do these in order. Steps 1–4 get the site live and let you test email sign-in yourself; step 5 adds Google.

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

## 2. Email sign-in: works now for testing, needs custom email before launch

**For testing right now, do nothing.** The site sends a sign-in *link* using Supabase's default email.

Supabase's built-in email has two limits:
- It only sends to members of your Supabase team (right now, just you).
- About 2 emails per hour.

**Before other people can sign in by email**, set up custom email (SMTP) under **Authentication → Emails → Set up SMTP**, using a free service such as Resend or Brevo. Once that's done, you can optionally edit the **Magic link or OTP** template to include a 6-digit code:

```html
<h2>Your Seek Like Silver sign-in</h2>
<p><a href="{{ .ConfirmationURL }}">Sign in</a>, or enter this code: <strong>{{ .Token }}</strong></p>
```

The site already accepts either the link or the code. Google sign-in (step 5) has no such limits.

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

Now test it: open the site, answer a question, press **Save answer**, enter *your own* email, and click the link in the email you receive.

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
- **No email arrives:** check spam and wait a minute. The default sender allows only about 2 emails per hour and only to your own address (see step 2).
- **"Email address not authorized":** custom email (step 2) isn't set up yet; the default sender only emails you.

---

## Supabase pieces added later (run each once)

**Database updates** (SQL Editor → New query → paste → Run; each is safe to re-run):
- `supabase-migrations/002-more-translations.sql`: allows the 18 translations in Settings.
- `supabase-migrations/003-account-linking-and-mfa.sql`: YouVersion account connections, plus the rule that locks an account's answers behind its authenticator code once that's turned on.
- `supabase-migrations/004-merge-accounts.sql`: lets the merge-accounts function find which account owns a Google login.
- `supabase-migrations/009-remove-authenticator-signin.sql`: removes the short-lived authenticator sign-in (008). Then delete the `authenticator` Edge Function in Supabase.
- `supabase-migrations/010-share-answers.sql`: lets you share one answer by link (#share=…). Anyone with the link sees that answer, its question and your display name; "Stop sharing" turns the link off. Until it is run, the Share link buttons stay hidden.
- `supabase-migrations/011-group-question-suggestions.sql`: group leaders can set a "question for this week" (with an optional due date and note); signed-in people can "Suggest a question" (max 5 a day), which only you see, under Stats; and a tiny `sls_ping` function the keep-awake job calls. Until it is run, those features stay hidden or say they aren't switched on yet.
- `supabase-migrations/007-study-level.sql`: remembers each person's study level from Settings on their account (until it's run, the level is kept on that device only).
- `supabase-migrations/006-site-stats.sql`: the owner-only Stats page. After running it, add yourself as admin with the one-line insert shown at the top of that file (using your own sign-in email).
- `supabase-migrations/005-answers-groups.sql`: more than one answer per question, sharing answers with groups, and private study groups. Until it's run, the site keeps one answer per question and Groups says it isn't switched on.

**Server functions** (Edge Functions → Deploy a new function → Via Editor; paste the file; Deploy; then turn **Verify JWT off** for each). Both use the secret `YOUVERSION_APP_KEY` (Edge Functions → Secrets).
- `youversion-signin` ← `supabase/functions/youversion-signin/index.ts` (YouVersion sign-in, connect, disconnect)
- `merge-accounts` ← `supabase/functions/merge-accounts/index.ts` (merges a separate Google-sign-in account into the signed-in one; no secret needed)
- `delete-account` ← `supabase/functions/delete-account/index.ts` ("Delete my account" in Settings; no secret needed)
- `bible-passage` ← `supabase/functions/bible-passage/index.ts` (only needed if verse previews say "Couldn't load the text")

Name each function correctly **before** its first deploy: the address is fixed at that moment, and renaming later only changes the label. (merge-accounts is deployed at the address `smooth-endpoint`; config.js points there.)

Editing a function's file on GitHub does **not** update it in Supabase. Paste the new code and deploy again.

**Account linking:** Authentication → Sign In / Providers → turn on **Allow manual linking** (needed for "Connect Google" in Settings).


## Keep-awake and backups (GitHub Actions)

**Keep-awake** (`.github/workflows/keep-awake.yml`) runs every 2 days and makes one tiny public request so the free Supabase project doesn't pause after a week of no visitors. Nothing to set up. To test it: GitHub → **Actions** → **Keep Supabase awake** → **Run workflow**.
Note: GitHub turns off scheduled jobs in a repository that has had no commits for 60 days. It emails you first; re-enable it from the Actions tab with one click.

**Weekly backup** (`.github/workflows/backup.yml`) saves the database every Sunday, **encrypted**, and keeps each backup for 90 days. The repository is public and anyone signed in to GitHub can download a workflow's files, which is why the backup is never stored unencrypted. Setup, once:

1. **Choose a backup passphrase** (at least 16 characters, e.g. four or five random words). Store it in your password manager. Without it the backups can't be opened, and nobody can recover it for you.
2. **Get the database connection string:** Supabase → your project → **Connect** (top of the page) → **Session pooler** → copy the URI. Replace `[YOUR-PASSWORD]` with your database password (Supabase → Project Settings → Database → reset it there if you don't know it). Use the *Session pooler* one: GitHub's machines can't reach the "Direct connection" address.
3. **Add two repository secrets:** GitHub → the repository → **Settings → Secrets and variables → Actions → New repository secret**:
   - `SUPABASE_DB_URL` = the connection string from step 2
   - `BACKUP_PASSPHRASE` = the passphrase from step 1
   (Secrets are encrypted by GitHub and never shown in logs or on the site. Never put them in any file in this repository.)
4. **Test it:** Actions → **Weekly backup** → **Run workflow**. When it finishes (green check), the run page lists a file **sls-backup-encrypted**.

**To restore** (only if something goes wrong): download the file from a run, unzip it, then on a computer with GnuPG and PostgreSQL 17 tools:
```
gpg -d sls-backup-YYYY-MM-DD.tar.gz.gpg > backup.tar.gz     # asks for the passphrase
tar xzf backup.tar.gz                                        # gives public.dump and auth-accounts.dump
pg_restore --list public.dump                                # look inside without changing anything
```
Restoring into the live database overwrites data, so ask for help (or try it on a new, empty Supabase project first).
