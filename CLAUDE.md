# Seek Like Silver: notes for Claude

Seek Like Silver (seeklikesilver.com) is a free Christian Bible-study site, written from the perspective of historic Christianity as summarized in the Nicene Creed. People pick a level (Beginner, Moderate, Philosopher) or a topic, get a question with Scripture, the early church fathers and further reading, and write and save their answers. Owner: Will (GitHub: WillBykat3).

## Working with Will
- **Accuracy comes first.** Double- and triple-check facts, quotes, Scripture references and claims about outside services. Be skeptical, research before stating things, and say plainly when something is unverified.
- Will is not a programmer. For anything in a dashboard (Supabase, GitHub settings), give click-by-click steps, and ask for a screenshot if a screen may have changed.
- **Never ask Will to paste a secret (passwords, keys, connection strings, passphrases) into chat.** They go straight into Supabase or GitHub secrets.
- Do the work, test it in a browser, then commit and push to `main`. Keep explanations short and plain.

## Hard rules
- **Never put the Supabase secret / `service_role` key in any file in this repo or the site.** The site uses only the publishable key in `config.js`.
- The Google OAuth client secret lives only in Supabase.
- Keep Will's email address out of the repo; it's public. (Admin access is granted by Will running an insert in the SQL Editor; see `supabase-migrations/006-site-stats.sql`.)
- Never host or link unofficial copies of copyrighted books. Library links go to free legal copies or a library search.
- Church-fathers quotes must be **copied verbatim from the linked source page and independently re-checked** before they go in. Never write a quote from memory.

## How the site is built
- **Static site, no build step.** GitHub Pages serves `main` on the custom domain in `CNAME`. Pushing to `main` deploys in about a minute.
- **Files:**
  - `index.html`: every view.
  - `app.js`: all app logic.
  - `styles.css`: all styles.
  - `config.js`: Supabase URL, publishable key, Google client ID, YouVersion app key, Edge Function names.
  - `questions.js`: the 90-question bank and topics.
  - `library.js`: books and their free or legal links.
  - `glossary.js`: hover/tap definitions.
  - `richtext.js`: the answer editor and its strict allow-list sanitizer `cleanRich`.
  - `icons.js`: the inline SVG icons, `iconButton()` and `flashIcon()`.
  - `sw.js`: the service worker, for install and offline use.
  - `privacy.html`
  - `site.webmanifest`
- **Routing:** hash routes, including `#answers`, `#groups`, `#library`, `#settings`, `#all`, `#stats`, `#q=NUM`, `#join=CODE` and `#share=TOKEN`. `setRoute`, `showView` and `handleRoute` make back/forward and reload work.
- **Questions:**
  - Each has an `id` (`b1`, `m12`, `p30`) and a permanent random 3-digit `num`, used in links and printouts. Never change existing `num`s or `id`s, because saved answers and shared links depend on them.
  - Fields: `prompt`, `passage`, `inspiration`, `readings`, `fathers`, `topics`.
  - Each `fathers` entry has `who`, `work`, `where`, `url`, `about`, `summary`, `quote`, `anchor` and `anchorEnd`. The last two build a text-fragment link (`#:~:text=anchor,anchorEnd`) that jumps to the quote. Anchors are plain words with no quote marks, apostrophes or commas, and must appear exactly in the quote.
- **Sign-in:** email code or Google. The sign-in dialog is a "soft modal" (`dialog.show()` plus a backdrop and `inert`) so password managers like Dashlane work. YouVersion sign-in is built but disabled ("coming soon").
- **Saved answers:** start with `<!--sls:rich-->` when formatted, and are always rebuilt through `cleanRich`. Pasting inserts plain text only.
- **Printing:** the print icon on a question makes a one-page worksheet (`#print-sheet`): logo, question, verses, and lines to write on. The browser's own Print still prints the full page.
- **Offline:** `sw.js` is network-first for the site's own files. Bump `VERSION` in it when the list of files changes.

## Supabase (project ref `monriqwuhiwunqrdffao`, free tier)
- Row-level security on every table. Write actions go through `security definer` functions with `set search_path = ''`.
- **Database updates are run by Will** in the SQL Editor, pasting the file and clicking Run. Make every new file in `supabase-migrations/` safe to run twice, and the next one is `012-…`.
  - Run as of 2026-10-22: everything through **011**. 010 and 011 were checked live. 008 was deleted; 009 removed an old authenticator sign-in.
  - Run order and notes: `SETUP.md`.
- **Edge Functions** (`supabase/functions/`): Will deploys them by pasting the code in the dashboard, with "Verify JWT" off. The names are fixed once deployed:
  - `bible-passage`: verse text and Verse of the Day from YouVersion. Only the passage is sent, never user info.
  - `delete-account`
  - `youversion-signin`
  - merge-accounts, deployed under the name `smooth-endpoint` (see `config.js`)
- **Features that need the database:** groups (005), owner-only stats (006, `sls_is_admin`), share-by-link (010), group question of the week, Suggest a question and the `sls_ping` function (011).

## GitHub Actions (`.github/workflows/`)
- **`keep-awake.yml`:** calls `sls_ping` every 2 days so the free Supabase project doesn't pause.
- **`backup.yml`:** every Sunday it runs `pg_dump` (the public schema, plus auth users and identities), encrypts the dump with GPG and keeps it 90 days as an artifact.
  - It uses the repository secrets `SUPABASE_DB_URL` (the Session pooler URI) and `BACKUP_PASSPHRASE`. Both are set, and the backup was tested successfully.
  - It is pinned to `ubuntu-24.04` on purpose.
  - The repo is public, so backups must stay encrypted.

## Testing
- There's no test suite in the repo yet. Changes were checked by:
  - serving the folder locally (`python3 -m http.server`);
  - driving it with Playwright and Chromium, with Supabase requests mocked by `page.route` (block service workers in those tests);
  - running the SQL files in PGlite (`@electric-sql/pglite`), with stub `auth` and `anon`/`authenticated` roles, to test permissions.
- Before pushing, check the changed pages at phone width (390px) and desktop width, in both light and dark mode.

## Commits
- Commit straight to `main` with a short message describing the change.

## Ideas not done yet
- Study plans: guided series of questions.
- "Look back" at an old answer when reopening a question.
- Comments on group answers. Held off because of moderation work.
- Email reminders. These need a paid email service.
- The privacy page has no contact email. People are pointed to "Suggest a question"; add an email if Will wants one.
