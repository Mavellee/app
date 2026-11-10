import type { ConfigContext, ExpoConfig } from 'expo/config';

/**
 * One config, three builds. APP_ENV is set per build profile in eas.json (and defaults to development locally).
 * Each variant has its own name, app ID and URL scheme, so a test build and the store build can be installed
 * side by side on one phone.
 */
type AppEnv = 'development' | 'preview' | 'production';

const VARIANTS: Record<AppEnv, { name: string; idSuffix: string; scheme: string }> = {
  development: { name: 'Mavelle Dev', idSuffix: '.dev', scheme: 'mavelle-dev' },
  preview: { name: 'Mavelle Preview', idSuffix: '.preview', scheme: 'mavelle-preview' },
  production: { name: 'Mavelle', idSuffix: '', scheme: 'mavelle' },
};

// Confirm the final ID before the first store build: it can't change once the app is published.
const BASE_APP_ID = 'com.mavelle.app';

// Paste the project ID printed by `npx eas-cli@latest init` here.
const EAS_PROJECT_ID: string | undefined = undefined;

// "Eternal Rose" parchment and aubergine, from the web theme.
const PARCHMENT = '#F9F0E8';
const AUBERGINE = '#1A1216';

function appEnv(): AppEnv {
  const value = process.env.APP_ENV ?? 'development';
  if (value === 'development' || value === 'preview' || value === 'production') return value;
  throw new Error(`APP_ENV must be development, preview or production (got "${value}").`);
}

export default ({ config }: ConfigContext): ExpoConfig => {
  const env = appEnv();
  const variant = VARIANTS[env];
  const appId = `${BASE_APP_ID}${variant.idSuffix}`;

  return {
    ...config,
    name: variant.name,
    slug: 'mavelle',
    version: '0.1.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: variant.scheme,
    userInterfaceStyle: 'automatic',
    platforms: ['ios', 'android'],
    ios: {
      bundleIdentifier: appId,
      supportsTablet: false,
      icon: './assets/expo.icon',
    },
    android: {
      package: appId,
      adaptiveIcon: {
        backgroundColor: PARCHMENT,
        foregroundImage: './assets/images/android-icon-foreground.png',
        backgroundImage: './assets/images/android-icon-background.png',
        monochromeImage: './assets/images/android-icon-monochrome.png',
      },
      predictiveBackGestureEnabled: false,
    },
    plugins: [
      'expo-router',
      [
        'expo-splash-screen',
        {
          backgroundColor: PARCHMENT,
          image: './assets/images/splash-icon.png',
          imageWidth: 76,
          dark: { backgroundColor: AUBERGINE },
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
    extra: {
      appEnv: env,
      ...(EAS_PROJECT_ID ? { eas: { projectId: EAS_PROJECT_ID } } : {}),
    },
  };
};
