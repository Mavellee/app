# Mavelle app

The Mavelle mobile app for Android and iOS: React Native with Expo (SDK 58), TypeScript and Expo Router.
It talks to the API in [Mavellee/server](https://github.com/Mavellee/server). The website lives in
[Mavellee/Web](https://github.com/Mavellee/Web).

## Requirements

- **Node 22.13 or newer** (`nvm use` reads `.nvmrc`)
- **Android:** Android Studio with an emulator (or a phone with USB debugging)
- **iOS:** a Mac with Xcode and the iOS simulator (or an iPhone)
- The API running locally (see the server README) or a reachable staging API

## First-time setup

```bash
npm install
cp .env.example .env.local   # then set EXPO_PUBLIC_API_URL
```

`EXPO_PUBLIC_API_URL` is the API's origin, without `/api`:

| Where the app runs | Value |
|---|---|
| iOS simulator | `http://localhost:4000` |
| Android emulator | `http://10.0.2.2:4000` |
| Physical phone (same Wi-Fi as your Mac) | `http://<your Mac's LAN IP>:4000` |

Outside development the address must use `https`.

## Running the app

The app uses a **development build** rather than Expo Go, because sign-in with Google and Apple, push and
media conversion need native code that Expo Go doesn't include.

```bash
npm run android   # builds and installs the development app on the emulator or a connected phone
npm run ios       # same for the iOS simulator
npm start         # after the first install: starts the bundler; press a or i to open the app
```

Without Android Studio or Xcode, build the development app in the cloud instead:
`npx eas-cli@latest build --profile development --platform android` (or `ios`; use
`--profile development-simulator` for the iOS simulator).

## Scripts

| Script | What it does |
|---|---|
| `npm run lint` | ESLint (Expo config) |
| `npm run typecheck` | TypeScript, strict |
| `npm test` | Jest with React Native Testing Library |
| `npm run check` | All three of the above |
| `npm run bundle:check` | Bundles the JavaScript for Android and iOS to catch build errors |
| `npm run doctor` | `expo-doctor`: dependency and config checks |

CI runs all of these on every pull request to `main`.

## Builds and environments

`app.config.ts` produces three variants, chosen by `APP_ENV` in `eas.json`. Each has its own name and app ID,
so they can be installed side by side:

| Profile | App name | App ID | Use |
|---|---|---|---|
| `development` | Mavelle Dev | `com.mavelle.app.dev` | Daily work with the development client |
| `preview` | Mavelle Preview | `com.mavelle.app.preview` | Testers (internal distribution) |
| `production` | Mavelle | `com.mavelle.app` | Play Store and App Store |

Set `EXPO_PUBLIC_API_URL` for `preview` and `production` as EAS environment variables (expo.dev → project →
Environment variables), not in the repo.

> The app ID `com.mavelle.app` is a placeholder. Confirm it before the first store build: it can't change
> once the app is published.

### One-time EAS setup

1. Create an Expo account at expo.dev (or use the team's).
2. Run `npx eas-cli@latest init` and paste the printed project ID into `EAS_PROJECT_ID` in `app.config.ts`.

## Project layout

```
src/
├── app/          Screens (Expo Router: every file is a route; layouts are _layout.tsx)
├── api/          API client, token refresh, one file per API area
├── components/   Reusable UI (ui/ for base components)
├── config/       Environment and build settings
├── hooks/
├── lib/          Secure storage, socket, formatting helpers
├── store/        Zustand, UI-only state
├── theme/        Colour tokens copied from Web/theme.ts
└── types/        API types copied from Web/src/lib/types.ts
__tests__/        Jest tests (kept outside src/app so they don't become routes)
```

## Branches

- `main` is production. Nothing is pushed to it directly after the initial setup.
- Work on `feature/<short-name>` branches and open a pull request to `main`. CI must pass before merging.

## Notes for contributors

- Add packages with `npx expo install <package>` so versions match the Expo SDK.
- `ios/` and `android/` are generated from `app.config.ts` and git-ignored. Configure native behaviour through
  the config and config plugins, never by editing those folders.
- `EXPO_PUBLIC_*` variables are built into the app and readable by anyone. Never put secrets in them.
- Theme colours must stay in step with `Web/theme.ts`.
