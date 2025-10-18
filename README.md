## UnPuff

A compassionate, identity-driven vaping reduction app built with React, Tailwind, and Capacitor for iOS/Android.

### Stack

- React 18 + TypeScript + Vite
- Tailwind + shadcn/ui components
- Wouter (routing), Framer Motion (animations)
- Express server (dev/prod hosting), Capacitor (mobile)

## Prerequisites

- Node.js 18+ and npm 9+
- macOS (for iOS builds) with Xcode 14+ (supports iOS 16 simulators)
- CocoaPods (for iOS): `sudo gem install cocoapods`
- Android Studio (for Android builds) and JDK 11+

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

Running the app locally does not require any secrets. Optional variables:

Create `.env` (or `.env.local`) if desired:

```bash
# .env example
PORT=5000
# DATABASE_URL=postgresql://user:password@localhost:5432/unpuff  # Only used by drizzle tools
```

The server uses `PORT` (defaults to 5000). `DATABASE_URL` is only required when using drizzle tooling (no runtime dependency at the moment).

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
