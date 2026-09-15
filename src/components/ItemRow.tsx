import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Item } from '../model';
import { colors } from '../theme';

type Props = { item: Item; onToggle: () => void };

/** Checkbox row. Tapping anywhere toggles packed; rows never move on tick. */
export function ItemRow({ item, onToggle }: Props) {
  return (
    <Pressable
      testID={`item.row.${item.id}`}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: item.packed }}
      accessibilityLabel={item.quantity > 1 ? `${item.name} ×${item.quantity}` : item.name}
      onPress={onToggle}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <View style={[styles.box, item.packed && styles.boxDone]}>
        {item.packed ? <Text style={styles.tick}>✓</Text> : null}
      </View>
      <Text style={[styles.name, item.packed && styles.nameDone]} numberOfLines={1}>
        {item.name}
      </Text>
      {item.quantity > 1 ? (
        <Text style={[styles.qty, item.packed && styles.qtyDone]}>×{item.quantity}</Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 13,
    paddingHorizontal: 16,
    backgroundColor: colors.card,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line,
  },
  pressed: { backgroundColor: colors.background },
  box: {
    width: 24,
    height: 24,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxDone: { backgroundColor: colors.done, borderColor: colors.done },
  tick: { color: colors.card, fontSize: 15, fontWeight: '700', lineHeight: 18 },
  name: { flex: 1, color: colors.ink, fontSize: 16 },
  nameDone: { color: colors.inkSecondary, textDecorationLine: 'line-through' },
  qty: { color: colors.inkSecondary, fontSize: 15, fontVariant: ['tabular-nums'] },
  qtyDone: { textDecorationLine: 'line-through' },
});
