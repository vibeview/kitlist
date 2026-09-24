import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { usePaneInsets } from '../insets';
import { colors } from '../theme';

type Props = { testID: string; label: string; onPress: () => void };

/** Floating "+" button, bottom-right. */
export function Fab({ testID, label, onPress }: Props) {
  const insets = usePaneInsets();
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.fab, { right: 20 + insets.right, bottom: 28 + insets.bottom }, pressed && styles.pressed]}
    >
      <Text style={styles.plus}>+</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 28,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.ink,
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  pressed: { opacity: 0.85 },
  plus: { color: colors.card, fontSize: 30, lineHeight: 34, fontWeight: '500', marginTop: -2 },
});
