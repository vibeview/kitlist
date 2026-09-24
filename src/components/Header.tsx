import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { usePaneInsets } from '../insets';
import { colors } from '../theme';

/** A "+" beside the title, used instead of the floating button in a split layout. */
export type HeaderAction = { testID: string; label: string; onPress: () => void };

type Props = {
  title: string;
  backLabel?: string;
  onBack?: () => void;
  backTestID?: string;
  action?: HeaderAction;
};

export function Header({ title, backLabel, onBack, backTestID, action }: Props) {
  const insets = usePaneInsets();
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
      <View style={styles.row}>
        {/* Beside a + the title keeps to one line and shrinks a little if it
            must, rather than wrapping in a narrow pane. */}
        <Text
          style={styles.title}
          accessibilityRole="header"
          numberOfLines={action ? 1 : 2}
          adjustsFontSizeToFit={!!action}
          minimumFontScale={0.75}
        >
          {title}
        </Text>
        {action ? (
          <Pressable
            testID={action.testID}
            accessibilityRole="button"
            accessibilityLabel={action.label}
            onPress={action.onPress}
            hitSlop={6}
            style={({ pressed }) => [styles.add, pressed && styles.pressed]}
          >
            <Text style={styles.plus}>+</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 20, paddingBottom: 12, backgroundColor: colors.background },
  back: { alignSelf: 'flex-start', paddingVertical: 4, marginBottom: 2 },
  backText: { color: colors.accent, fontSize: 17, fontWeight: '500' },
  row: { flexDirection: 'row', alignItems: 'center' },
  title: { flex: 1, color: colors.ink, fontSize: 30, fontWeight: '700', letterSpacing: -0.5 },
  add: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginLeft: 10,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.85 },
  plus: { color: colors.card, fontSize: 24, lineHeight: 28, fontWeight: '500', marginTop: -2 },
});
