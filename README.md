## UnPuff

A compassionate, identity-driven vaping reduction app built with React, Tailwind, and Capacitor for iOS/Android.

### Stack

- React 18 + TypeScript + Vite
- Tailwind + shadcn/ui components
- Wouter (routing), Framer Motion (animations)
- Express server (dev/prod hosting), Capacitor (mobile)
- Supabase (authentication & database)

## Prerequisites

- Node.js 18+ and npm 9+
- macOS (for iOS builds) with Xcode 14+ (supports iOS 16 simulators)
- CocoaPods (for iOS): `sudo gem install cocoapods`
- Android Studio (for Android builds) and JDK 11+
- Supabase account (free tier available at https://supabase.com)

## 1) Clone and install

```bash
git clone https://github.com/andrewcovenant/unpuff.git
cd UnPuff
npm install
```

## 2) Run in the browser (development)

This starts the Express server and attaches the Vite dev server for hot reload.

```bash
npm run dev
```

Then open the URL shown in the terminal (typically `http://localhost:5000`).

Notes:

- Native-only features (e.g., haptics) are no-ops in the browser.
- The app persists onboarding data in `localStorage`.

## 3) Run on iOS Simulator (iOS 16)

Build the web app, sync Capacitor, install pods (first time), then open Xcode.

```bash
# From project root
npm run build
npx cap sync ios
cd ios/App && pod install && cd ../..
npx cap open ios
```

In Xcode:

1. Select a simulator that runs iOS 16 (e.g., iPhone 14 / 15)
2. Press the Run button (▶) or use Cmd+R

If you don't see iOS 16 devices, install the runtime via Xcode → Settings → Platforms.

## 4) Run on Android Emulator

```bash
npm run build
npx cap sync android
npx cap open android
```

In Android Studio, choose an emulator/device and click Run.

## Environment variables

**Required for authentication:**

Create `.env` (or `.env.local`) in the project root:

```bash
# Supabase Configuration (Required)
# Get these from your Supabase project: https://app.supabase.com/project/_/settings/api
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Server Configuration (Optional)
PORT=5000

# Optional: Server-side Supabase configuration (for admin operations)
# SUPABASE_URL=your_supabase_project_url
# SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Database Configuration (Optional - for Drizzle migrations)
# DATABASE_URL=postgresql://user:password@localhost:5432/unpuff
```

**Setting up Supabase:**

1. Create a free account at https://supabase.com
2. Create a new project
3. Go to Project Settings → API
4. Copy your Project URL and anon/public key
5. Add them to your `.env` file as `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
6. Enable Google OAuth provider in Authentication → Providers
7. Follow the database migration steps below to set up the users table

## Database Setup

After setting up your Supabase project, you need to create the `users` table in your Supabase database.

### Option 1: Using Supabase SQL Editor (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the following SQL to create the users table:

```sql
-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  supabase_user_id VARCHAR NOT NULL UNIQUE,
  username TEXT,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create index on supabase_user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_supabase_user_id ON users(supabase_user_id);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can read their own data
CREATE POLICY "Users can read own data" ON users
  FOR SELECT
  USING (auth.uid()::text = supabase_user_id);

-- Create policy: Users can update their own data
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE
  USING (auth.uid()::text = supabase_user_id);

-- Create policy: Service role can insert (for server-side operations)
CREATE POLICY "Service role can insert users" ON users
  FOR INSERT
  WITH CHECK (true);

-- Create a function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (supabase_user_id, email, username, created_at)
  VALUES (
    NEW.id::text,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', SPLIT_PART(NEW.email, '@', 1)),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to call the function on new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### Option 2: Using Drizzle Kit (Alternative)

If you prefer using Drizzle migrations:

1. Set your `DATABASE_URL` in `.env` to your Supabase connection string:
   ```
   DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
   ```

2. Run the migration:
   ```bash
   npm run db:push
   ```

3. Then manually set up RLS policies and triggers using the SQL above in Supabase SQL Editor.

### Setting up Google OAuth

1. Go to Authentication → Providers in your Supabase dashboard
2. Enable Google provider
3. Add your Google OAuth credentials (Client ID and Client Secret)
4. Add authorized redirect URLs:
   - For web: `http://localhost:5000` (development) and your production URL
   - For mobile: `unpuff://auth/callback` (configured in Capacitor)
5. Save the changes

## Available scripts

```bash
npm run dev      # Start dev server (Express + Vite)
npm run build    # Build client (Vite) and bundle server
npm start        # Run production server (serves dist)
npm run check    # Type-check with TypeScript
npm run db:push  # Drizzle-Kit push (requires DATABASE_URL)
```

## Troubleshooting

- iOS CocoaPods errors:
  ```bash
  cd ios/App
  pod install
  pod update
  cd ../..
  ```
- Simulator shows stale content: delete the app from the simulator or Device → Erase All Content and Settings, then rebuild.
- Xcode signing issues: In Xcode, select the project → Signing & Capabilities → choose a development team or enable automatic signing.
- Identifier mismatch (Unpuff/QuitTracker): If you change the bundle ID, update it consistently in `capacitor.config.ts`, iOS target settings, and Android `applicationId`.

## Project structure (high-level)

```
client/           # React app (components, pages, hooks)
server/           # Express bootstrap + Vite middleware
ios/, android/    # Capacitor native projects
shared/           # Shared types/schemas
dist/             # Build output (generated)
```

## License

MIT

# unpuff

Unpuff is a battle-tested tool built to disrupt addictive vaping behavior, combining data tracking, real-time intervention, community reinforcement, and identity transformation. This is not a habit tracker. It is a psychological weapon.
