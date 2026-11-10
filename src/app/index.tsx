import { Platform, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { env } from '@/config/env';
import { usePalette } from '@/theme/use-palette';

/** Placeholder start screen until the sign-in flow lands (Phase 1–2). Shows which build and API this is. */
export default function StartScreen() {
  const { palette } = usePalette();

  const rows: { label: string; value: string }[] = [
    { label: 'Build', value: env.appEnv },
    { label: 'API', value: env.apiUrl ?? 'Not configured' },
    { label: 'Platform', value: `${Platform.OS} ${Platform.Version}` },
  ];

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: palette.background }]}>
      <View style={styles.content}>
        <Text accessibilityRole="header" style={[styles.title, { color: palette['primary-text'] }]}>
          Mavelle
        </Text>
        <Text style={[styles.subtitle, { color: palette['text-soft'] }]}>The app is set up. Screens arrive in the next phases.</Text>

        <View style={[styles.card, { backgroundColor: palette.surface, borderColor: palette.border }]}>
          {rows.map((row) => (
            <View key={row.label} style={styles.row}>
              <Text style={[styles.label, { color: palette['text-muted'] }]}>{row.label}</Text>
              <Text style={[styles.value, { color: palette.text }]} selectable>
                {row.value}
              </Text>
            </View>
          ))}
        </View>

        {env.problem ? (
          <Text accessibilityRole="alert" style={[styles.problem, { color: palette['error-text'], backgroundColor: palette['error-soft'] }]}>
            {env.problem}
          </Text>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: 24, gap: 16 },
  title: { fontSize: 40, fontWeight: '600', textAlign: 'center' },
  subtitle: { fontSize: 16, lineHeight: 22, textAlign: 'center' },
  card: { borderWidth: StyleSheet.hairlineWidth, borderRadius: 16, paddingHorizontal: 16, paddingVertical: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 16, paddingVertical: 8 },
  label: { fontSize: 14 },
  value: { fontSize: 14, fontWeight: '500', flexShrink: 1, textAlign: 'right' },
  problem: { fontSize: 14, lineHeight: 20, padding: 12, borderRadius: 12, overflow: 'hidden' },
});
