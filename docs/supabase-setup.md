# Supabase Setup

This project uses Supabase as the first production MVP backend: magic-link auth, Postgres, private file storage, and row-level security.

## Apply Order

1. Create a Supabase project in the EU region.
2. Add Vercel env values from `.env.example`.
3. Apply the Prisma migration:

```bash
npx prisma migrate deploy
```

4. Apply the Supabase security migration in SQL Editor:

```text
supabase/migrations/20260715083000_founder_workspace_security.sql
```

5. Open `/api/health`. Production should return `status: "ok"` when Supabase and database env values are configured.

## Auth

The first production user is a founder/CEO. The app uses `/login` for email magic-link auth and `/auth/callback` for Supabase session exchange.

When a new Supabase `auth.users` record is created, the SQL trigger inserts a matching `UserProfile` row with role `founder` and locale `ru`.

## Storage

Private bucket:

```text
case-files
```

Object path convention:

```text
users/{supabaseUserId}/cases/{caseId}/raw/{uploadedFileId}/{originalName}
users/{supabaseUserId}/cases/{caseId}/exports/{briefId}.pdf
```

Storage policies only allow authenticated users to read/write files under their own `users/{auth.uid()}` prefix.

## RLS Model

The MVP is founder-only:

- `UserProfile` is visible only to the matching Supabase auth user.
- `Company` is visible only to its owner.
- `Case` is visible only to its owner or the owner of the linked company.
- Case child tables are visible only through owned cases.

This deliberately avoids CFO, consultant, and admin roles until the product has real usage.
