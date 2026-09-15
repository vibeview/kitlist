import React from 'react';
import { StyleSheet, View } from 'react-native';

import { colors } from '../theme';

type Props = { packed: number; total: number; testID?: string };

/** Thin bar: accent while packing, done-green once everything is in the bag. */
export function ProgressBar({ packed, total, testID }: Props) {
  const complete = total > 0 && packed === total;
  const fraction = total === 0 ? 0 : packed / total;
  return (
    <View style={styles.track} testID={testID} accessibilityRole="progressbar">
      <View
        style={[
          styles.fill,
          { width: `${Math.round(fraction * 100)}%`, backgroundColor: complete ? colors.done : colors.accent },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { height: 4, borderRadius: 2, backgroundColor: colors.line, overflow: 'hidden' },
  fill: { height: 4, borderRadius: 2 },
});
