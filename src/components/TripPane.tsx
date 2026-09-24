import React, { useMemo, useState } from 'react';
import { SectionList, StyleSheet, Text, View } from 'react-native';

import { usePaneInsets } from '../insets';
import { useLayout } from '../layout';
import { CATEGORIES, Item, leftToPack } from '../model';
import { useStore, useTrip } from '../store';
import { colors, radius } from '../theme';
import { Fab } from './Fab';
import { Header } from './Header';
import { ItemRow } from './ItemRow';
import { Sheet, SheetConfig } from './Sheet';

type Props = {
  tripId: string;
  /** Shown as "‹ Trips" when the packing list is on its own. */
  onBack?: () => void;
};

/** One trip's packing list with its "+" and add-item sheet. */
export function TripPane({ tripId, onBack }: Props) {
  const { ready, addItem, toggleItem } = useStore();
  const trip = useTrip(tripId);
  const insets = usePaneInsets();
  // Split layout: the + sits in the pane's header. A floating button in a
  // short pane always ends up covering a row; one pane keeps the usual FAB.
  const { twoPane } = useLayout();
  const [sheet, setSheet] = useState<SheetConfig | null>(null);

  // Group by category in a fixed order; item order within a group is insertion
  // order, so ticking never reorders anything.
  const sections = useMemo(() => {
    if (!trip) return [];
    return CATEGORIES.map((category) => ({
      title: category,
      data: trip.items.filter((i) => i.category === category),
    })).filter((s) => s.data.length > 0);
  }, [trip]);

  const edges = { paddingLeft: insets.left, paddingRight: insets.right };

  if (!ready) return <View style={[styles.screen, edges]} />;

  if (!trip) {
    return (
      <View style={[styles.screen, edges]}>
        <Header title="Trip not found" backLabel="Trips" onBack={onBack} backTestID="trip.back" />
      </View>
    );
  }

  const left = leftToPack(trip);

  function openAddItem() {
    if (!trip) return;
    const id = trip.id;
    setSheet({ kind: 'item', side: 'secondary', tripName: trip.name, onSave: (v) => addItem(id, v) });
  }

  return (
    <View style={[styles.screen, edges]} testID="screen.trip">
      <Header
        title={trip.name}
        backLabel="Trips"
        onBack={onBack}
        backTestID="trip.back"
        action={twoPane ? { testID: 'item.add', label: 'Add item', onPress: openAddItem } : undefined}
      />
      <SectionList<Item>
        sections={sections}
        keyExtractor={(item) => item.id}
        stickySectionHeadersEnabled={false}
        ListHeaderComponent={
          <Text style={[styles.left, left === 0 && styles.leftDone]} testID="trip.left">
            {left === 0 ? 'All packed' : `${left} left to pack`}
          </Text>
        }
        renderSectionHeader={({ section }) => (
          <Text style={styles.section} testID={`trip.section.${section.title}`}>
            {section.title}
          </Text>
        )}
        renderItem={({ item, index, section }) => (
          <View
            style={[
              styles.rowWrap,
              index === 0 && styles.rowFirst,
              index === section.data.length - 1 && styles.rowLast,
            ]}
          >
            <ItemRow item={item} onToggle={() => toggleItem(trip.id, item.id)} />
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty} testID="trip.empty">
            Nothing on the list yet. Tap + to add the first item.
          </Text>
        }
        contentContainerStyle={{ paddingBottom: (twoPane ? 24 : 100) + insets.bottom }}
      />
      {twoPane ? null : <Fab testID="item.add" label="Add item" onPress={openAddItem} />}
      <Sheet config={sheet} onClose={() => setSheet(null)} />
    </View>
  );
}

/** What the right-hand pane shows before a trip is picked. */
export function NoTripSelected() {
  const insets = usePaneInsets();
  return (
    <View style={[styles.screen, styles.center, { paddingLeft: insets.left, paddingRight: insets.right }]} testID="trip.none">
      <Text style={styles.noneTitle}>No trip selected</Text>
      <Text style={styles.noneText}>Pick a trip to see its packing list.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  center: { alignItems: 'center', justifyContent: 'center', padding: 40 },
  noneTitle: { color: colors.ink, fontSize: 20, fontWeight: '600', marginBottom: 6 },
  noneText: { color: colors.inkSecondary, fontSize: 15, textAlign: 'center' },
  left: { color: colors.accent, fontSize: 15, fontWeight: '600', paddingHorizontal: 20, paddingBottom: 8 },
  leftDone: { color: colors.done },
  section: {
    color: colors.inkSecondary,
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 8,
  },
  rowWrap: {
    marginHorizontal: 20,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  rowFirst: {
    borderTopLeftRadius: radius.card,
    borderTopRightRadius: radius.card,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  rowLast: {
    borderBottomLeftRadius: radius.card,
    borderBottomRightRadius: radius.card,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  empty: { color: colors.inkSecondary, textAlign: 'center', marginTop: 40, paddingHorizontal: 40, fontSize: 15 },
});
