import { useColorScheme } from 'react-native';

import { darkTokens, tokens, type Palette } from './tokens';

/** The colours for the phone's current light or dark setting. */
export function usePalette(): { palette: Palette; isDark: boolean } {
  const isDark = useColorScheme() === 'dark';
  return { palette: isDark ? darkTokens : tokens, isDark };
}
