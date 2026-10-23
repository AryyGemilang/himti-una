CREATE TABLE IF NOT EXISTS schema_migrations (
  name text PRIMARY KEY,
  applied_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS admins (
  id uuid PRIMARY KEY,
  username text NOT NULL UNIQUE,
  role text NOT NULL CHECK (role IN ('documentation', 'registration')),
  password_hash text NOT NULL,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS admin_sessions (
  id uuid PRIMARY KEY,
  admin_id uuid NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
  token_hash text NOT NULL UNIQUE,
  csrf_token text NOT NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS admin_sessions_expiry_idx ON admin_sessions(expires_at);

CREATE TABLE IF NOT EXISTS registration_events (
  id uuid PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  event_type text NOT NULL CHECK (event_type IN ('training', 'competition', 'recruitment', 'other')),
  form_schema jsonb NOT NULL DEFAULT '[]'::jsonb,
  includes_npm boolean NOT NULL DEFAULT false,
  opens_at timestamptz NOT NULL,
  closes_at timestamptz NOT NULL,
  manual_closed boolean NOT NULL DEFAULT false,
  published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (closes_at > opens_at)
);
CREATE INDEX IF NOT EXISTS registration_events_public_idx ON registration_events(published, opens_at, closes_at);

CREATE TABLE IF NOT EXISTS registrations (
  id uuid PRIMARY KEY,
  event_id uuid NOT NULL REFERENCES registration_events(id) ON DELETE RESTRICT,
  email text NOT NULL,
  npm text,
  answers jsonb NOT NULL,
  schema_snapshot jsonb NOT NULL,
  submitted_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS registrations_event_submitted_idx ON registrations(event_id, submitted_at DESC);
CREATE INDEX IF NOT EXISTS registrations_event_email_idx ON registrations(event_id, lower(email));
CREATE INDEX IF NOT EXISTS registrations_event_npm_idx ON registrations(event_id, upper(npm)) WHERE npm IS NOT NULL;

CREATE TABLE IF NOT EXISTS documentation_events (
  id uuid PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  event_date date,
  thumbnail_path text,
  published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS documentation_media (
  id uuid PRIMARY KEY,
  event_id uuid NOT NULL REFERENCES documentation_events(id) ON DELETE CASCADE,
  kind text NOT NULL CHECK (kind IN ('thumbnail', 'image', 'video')),
  file_path text NOT NULL,
  mime_type text NOT NULL,
  original_name text NOT NULL,
  alt_text text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS documentation_media_event_idx ON documentation_media(event_id, sort_order, created_at);
