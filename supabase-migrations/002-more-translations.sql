-- Seek Like Silver: allow the additional Bible translations in Settings.
-- Run once in Supabase: SQL Editor → New query → paste → Run. Safe to run again.
-- (Without this, choosing one of the new translations in Settings fails to save.)

alter table public.profiles drop constraint if exists profiles_translation_check;

alter table public.profiles add constraint profiles_translation_check check (translation in (
  'ESV', 'NIV', 'NLT', 'KJV', 'NKJV', 'CSB', 'NASB', 'NASB1995', 'LSB', 'AMP',
  'NET', 'NRSVUE', 'RSV', 'NABRE', 'CEB', 'MSG', 'NIRV', 'ASV'
));
