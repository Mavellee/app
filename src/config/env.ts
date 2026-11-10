import Constants from 'expo-constants';

export type AppEnv = 'development' | 'preview' | 'production';

export type Env = {
  appEnv: AppEnv;
  /** The API's origin, e.g. https://mavelle.example.com. Paths such as /api and /socket.io are added by callers. */
  apiUrl: string | null;
  /** Why apiUrl is missing, in words a developer can act on. */
  problem: string | null;
};

/**
 * Checks the API address. Outside development it must be HTTPS: release builds talk to production over TLS only.
 * Returns a problem instead of throwing, so a misconfigured build shows a clear message rather than a crash.
 */
export function readEnv(rawApiUrl: string | undefined, appEnv: AppEnv): Env {
  const value = rawApiUrl?.trim();
  if (!value) {
    return { appEnv, apiUrl: null, problem: 'EXPO_PUBLIC_API_URL is not set. Copy .env.example to .env.local and fill it in.' };
  }
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return { appEnv, apiUrl: null, problem: `EXPO_PUBLIC_API_URL is not a valid URL: "${value}".` };
  }
  if (url.protocol !== 'https:' && !(appEnv === 'development' && url.protocol === 'http:')) {
    return { appEnv, apiUrl: null, problem: `EXPO_PUBLIC_API_URL must use https outside development (got "${value}").` };
  }
  return { appEnv, apiUrl: `${url.protocol}//${url.host}`, problem: null };
}

function currentAppEnv(): AppEnv {
  const value = Constants.expoConfig?.extra?.appEnv;
  return value === 'preview' || value === 'production' ? value : 'development';
}

// Expo inlines EXPO_PUBLIC_* variables into the bundle at build time, so this must stay a direct property access.
// Never put secrets in EXPO_PUBLIC_* variables: anyone can read them from the app.
export const env: Env = readEnv(process.env.EXPO_PUBLIC_API_URL, currentAppEnv());
