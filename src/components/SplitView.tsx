import React from 'react';
import { StyleSheet, View } from 'react-native';

import { PaneEdges } from '../insets';
import { HINGE_GUTTER, useLayout } from '../layout';
import { colors } from '../theme';

type Props = { primary: React.ReactNode; secondary: React.ReactNode };

/**
 * Two equal panes with a gutter in the exact middle of the window: side by
 * side when the window is wide, one above the other when it is tall. Each pane
 * is exactly half the window minus half the gutter, so the fold of a half-open
 * foldable lands in the gutter in both orientations.
 */
export function SplitView({ primary, secondary }: Props) {
  const { direction } = useLayout();
  const row = direction === 'row';
  return (
    <View style={[styles.split, { flexDirection: row ? 'row' : 'column' }]}>
      <View style={styles.pane} testID="pane.primary">
        <PaneEdges edges={row ? { right: false } : { bottom: false }}>{primary}</PaneEdges>
      </View>
      <View style={[styles.gutter, row ? { width: HINGE_GUTTER } : { height: HINGE_GUTTER }]}>
        <View style={row ? styles.lineRow : styles.lineColumn} />
      </View>
      <View style={styles.pane} testID="pane.secondary">
        <PaneEdges edges={row ? { left: false } : { top: false }}>{secondary}</PaneEdges>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  split: { flex: 1, backgroundColor: colors.background },
  pane: { flex: 1, flexBasis: 0, overflow: 'hidden' },
  gutter: { alignItems: 'center', justifyContent: 'center' },
  lineRow: { width: StyleSheet.hairlineWidth, flex: 1, backgroundColor: colors.line },
  lineColumn: { height: StyleSheet.hairlineWidth, alignSelf: 'stretch', backgroundColor: colors.line },
});
