import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '../theme';

type Props = { title: string; backLabel?: string; onBack?: () => void; backTestID?: string };

export function Header({ title, backLabel, onBack, backTestID }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.wrap, { paddingTop: insets.top + 8 }]}>
      {onBack ? (
        <Pressable
          testID={backTestID}
          accessibilityRole="button"
          accessibilityLabel={`Back to ${backLabel ?? 'previous screen'}`}
          onPress={onBack}
          hitSlop={8}
          style={styles.back}
        >
          <Text style={styles.backText}>‹ {backLabel}</Text>
        </Pressable>
      ) : null}
      <Text style={styles.title} accessibilityRole="header" numberOfLines={2}>
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 20, paddingBottom: 12, backgroundColor: colors.background },
  back: { alignSelf: 'flex-start', paddingVertical: 4, marginBottom: 2 },
  backText: { color: colors.accent, fontSize: 17, fontWeight: '500' },
  title: { color: colors.ink, fontSize: 30, fontWeight: '700', letterSpacing: -0.5 },
});
