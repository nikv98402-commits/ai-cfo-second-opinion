-- Supabase security layer for the first founder-only production MVP.
-- Apply after the Prisma migration creates the public tables.

create extension if not exists "pgcrypto";

create or replace function public.current_user_profile_id()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select "id"
  from public."UserProfile"
  where "supabaseUserId" = auth.uid()::text
  limit 1
$$;

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public."UserProfile" ("id", "supabaseUserId", "email", "role", "locale", "updatedAt")
  values (
    'usr_' || replace(gen_random_uuid()::text, '-', ''),
    new.id::text,
    coalesce(new.email, ''),
    'founder',
    'ru',
    now()
  )
  on conflict ("supabaseUserId") do update
  set "email" = excluded."email",
      "updatedAt" = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();

alter table public."UserProfile" enable row level security;
alter table public."Company" enable row level security;
alter table public."Case" enable row level security;
alter table public."UploadedFile" enable row level security;
alter table public."MappingProfile" enable row level security;
alter table public."FinancialInput" enable row level security;
alter table public."WorkingCapitalAging" enable row level security;
alter table public."DebtSchedule" enable row level security;
alter table public."CapexPlan" enable row level security;
alter table public."SalesChannelMetric" enable row level security;
alter table public."EvidenceItem" enable row level security;
alter table public."AnalysisResult" enable row level security;
alter table public."OwnerBrief" enable row level security;
alter table public."ChatMessage" enable row level security;

create policy "founder owns own profile"
on public."UserProfile"
for all
using ("supabaseUserId" = auth.uid()::text)
with check ("supabaseUserId" = auth.uid()::text);

create policy "founder owns companies"
on public."Company"
for all
using ("ownerUserId" = public.current_user_profile_id())
with check ("ownerUserId" = public.current_user_profile_id());

create policy "founder owns cases"
on public."Case"
for all
using (
  "ownerUserId" = public.current_user_profile_id()
  or exists (
    select 1 from public."Company"
    where public."Company"."id" = public."Case"."companyId"
      and public."Company"."ownerUserId" = public.current_user_profile_id()
  )
)
with check (
  "ownerUserId" = public.current_user_profile_id()
  or exists (
    select 1 from public."Company"
    where public."Company"."id" = public."Case"."companyId"
      and public."Company"."ownerUserId" = public.current_user_profile_id()
  )
);

create policy "founder owns uploaded files"
on public."UploadedFile"
for all
using (
  exists (
    select 1 from public."Case"
    where public."Case"."id" = public."UploadedFile"."caseId"
      and public."Case"."ownerUserId" = public.current_user_profile_id()
  )
)
with check (
  exists (
    select 1 from public."Case"
    where public."Case"."id" = public."UploadedFile"."caseId"
      and public."Case"."ownerUserId" = public.current_user_profile_id()
  )
);

create policy "founder owns mapping profiles"
on public."MappingProfile"
for all
using (
  exists (
    select 1
    from public."UploadedFile"
    join public."Case" on public."Case"."id" = public."UploadedFile"."caseId"
    where public."UploadedFile"."id" = public."MappingProfile"."uploadedFileId"
      and public."Case"."ownerUserId" = public.current_user_profile_id()
  )
)
with check (
  exists (
    select 1
    from public."UploadedFile"
    join public."Case" on public."Case"."id" = public."UploadedFile"."caseId"
    where public."UploadedFile"."id" = public."MappingProfile"."uploadedFileId"
      and public."Case"."ownerUserId" = public.current_user_profile_id()
  )
);

create policy "founder owns financial inputs"
on public."FinancialInput"
for all
using (exists (select 1 from public."Case" where public."Case"."id" = public."FinancialInput"."caseId" and public."Case"."ownerUserId" = public.current_user_profile_id()))
with check (exists (select 1 from public."Case" where public."Case"."id" = public."FinancialInput"."caseId" and public."Case"."ownerUserId" = public.current_user_profile_id()));

create policy "founder owns aging"
on public."WorkingCapitalAging"
for all
using (exists (select 1 from public."Case" where public."Case"."id" = public."WorkingCapitalAging"."caseId" and public."Case"."ownerUserId" = public.current_user_profile_id()))
with check (exists (select 1 from public."Case" where public."Case"."id" = public."WorkingCapitalAging"."caseId" and public."Case"."ownerUserId" = public.current_user_profile_id()));

create policy "founder owns debt schedules"
on public."DebtSchedule"
for all
using (exists (select 1 from public."Case" where public."Case"."id" = public."DebtSchedule"."caseId" and public."Case"."ownerUserId" = public.current_user_profile_id()))
with check (exists (select 1 from public."Case" where public."Case"."id" = public."DebtSchedule"."caseId" and public."Case"."ownerUserId" = public.current_user_profile_id()));

create policy "founder owns capex plans"
on public."CapexPlan"
for all
using (exists (select 1 from public."Case" where public."Case"."id" = public."CapexPlan"."caseId" and public."Case"."ownerUserId" = public.current_user_profile_id()))
with check (exists (select 1 from public."Case" where public."Case"."id" = public."CapexPlan"."caseId" and public."Case"."ownerUserId" = public.current_user_profile_id()));

create policy "founder owns sales channel metrics"
on public."SalesChannelMetric"
for all
using (exists (select 1 from public."Case" where public."Case"."id" = public."SalesChannelMetric"."caseId" and public."Case"."ownerUserId" = public.current_user_profile_id()))
with check (exists (select 1 from public."Case" where public."Case"."id" = public."SalesChannelMetric"."caseId" and public."Case"."ownerUserId" = public.current_user_profile_id()));

create policy "founder owns evidence items"
on public."EvidenceItem"
for all
using (exists (select 1 from public."Case" where public."Case"."id" = public."EvidenceItem"."caseId" and public."Case"."ownerUserId" = public.current_user_profile_id()))
with check (exists (select 1 from public."Case" where public."Case"."id" = public."EvidenceItem"."caseId" and public."Case"."ownerUserId" = public.current_user_profile_id()));

create policy "founder owns analysis results"
on public."AnalysisResult"
for all
using (exists (select 1 from public."Case" where public."Case"."id" = public."AnalysisResult"."caseId" and public."Case"."ownerUserId" = public.current_user_profile_id()))
with check (exists (select 1 from public."Case" where public."Case"."id" = public."AnalysisResult"."caseId" and public."Case"."ownerUserId" = public.current_user_profile_id()));

create policy "founder owns owner briefs"
on public."OwnerBrief"
for all
using (exists (select 1 from public."Case" where public."Case"."id" = public."OwnerBrief"."caseId" and public."Case"."ownerUserId" = public.current_user_profile_id()))
with check (exists (select 1 from public."Case" where public."Case"."id" = public."OwnerBrief"."caseId" and public."Case"."ownerUserId" = public.current_user_profile_id()));

create policy "founder owns chat messages"
on public."ChatMessage"
for all
using (exists (select 1 from public."Case" where public."Case"."id" = public."ChatMessage"."caseId" and public."Case"."ownerUserId" = public.current_user_profile_id()))
with check (exists (select 1 from public."Case" where public."Case"."id" = public."ChatMessage"."caseId" and public."Case"."ownerUserId" = public.current_user_profile_id()));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'case-files',
  'case-files',
  false,
  52428800,
  array[
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
    'text/csv',
    'application/csv',
    'application/pdf'
  ]
)
on conflict (id) do update
set public = false,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

create policy "founder reads own case files"
on storage.objects
for select
using (
  bucket_id = 'case-files'
  and (storage.foldername(name))[1] = 'users'
  and (storage.foldername(name))[2] = auth.uid()::text
);

create policy "founder uploads own case files"
on storage.objects
for insert
with check (
  bucket_id = 'case-files'
  and (storage.foldername(name))[1] = 'users'
  and (storage.foldername(name))[2] = auth.uid()::text
);

create policy "founder updates own case files"
on storage.objects
for update
using (
  bucket_id = 'case-files'
  and (storage.foldername(name))[1] = 'users'
  and (storage.foldername(name))[2] = auth.uid()::text
)
with check (
  bucket_id = 'case-files'
  and (storage.foldername(name))[1] = 'users'
  and (storage.foldername(name))[2] = auth.uid()::text
);

create policy "founder deletes own case files"
on storage.objects
for delete
using (
  bucket_id = 'case-files'
  and (storage.foldername(name))[1] = 'users'
  and (storage.foldername(name))[2] = auth.uid()::text
);
