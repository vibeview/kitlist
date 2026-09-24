import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { usePaneInsets } from '../insets';
import { colors } from '../theme';

type Props = { testID: string; label: string; onPress: () => void };

const SIZE = 56;
const BOTTOM = 28;

/**
 * Space a list must leave free at the bottom of its pane (plus the pane's
 * bottom inset) so the button never sits on top of a row: the button's
 * offset, its height and a 12 pt gap above it.
 */
export const FAB_CLEARANCE = BOTTOM + SIZE + 12;

/** Floating "+" button, bottom-right, below its pane's list (see FAB_CLEARANCE). */
export function Fab({ testID, label, onPress }: Props) {
  const insets = usePaneInsets();
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.fab, { right: 20 + insets.right, bottom: BOTTOM + insets.bottom }, pressed && styles.pressed]}
    >
      <Text style={styles.plus}>+</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
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
