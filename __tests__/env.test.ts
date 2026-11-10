import { readEnv } from '@/config/env';

describe('readEnv', () => {
  it('keeps only the origin of the API address', () => {
    expect(readEnv('https://mavelle.example.com/', 'production').apiUrl).toBe('https://mavelle.example.com');
    expect(readEnv('  http://10.0.2.2:4000/api  ', 'development').apiUrl).toBe('http://10.0.2.2:4000');
  });

  it('allows plain http only in development', () => {
    expect(readEnv('http://192.168.1.20:4000', 'development').problem).toBeNull();
    expect(readEnv('http://mavelle.example.com', 'preview').apiUrl).toBeNull();
    expect(readEnv('http://mavelle.example.com', 'production').problem).toMatch(/https/);
  });

  it('explains a missing or malformed address instead of throwing', () => {
    expect(readEnv(undefined, 'development').problem).toMatch(/EXPO_PUBLIC_API_URL is not set/);
    expect(readEnv('   ', 'development').apiUrl).toBeNull();
    expect(readEnv('not a url', 'development').problem).toMatch(/not a valid URL/);
  });
});
