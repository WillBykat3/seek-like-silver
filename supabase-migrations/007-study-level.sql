-- Seek Like Silver: remember each person's study level (Settings → Study level).
-- Empty means "show all three levels". Run once in Supabase SQL Editor. Safe to run again.
alter table public.profiles add column if not exists study_level text
  check (study_level is null or study_level in ('beginner', 'moderate', 'philosopher'));
