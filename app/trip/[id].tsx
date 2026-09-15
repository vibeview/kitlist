import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { SectionList, StyleSheet, Text, View } from 'react-native';

import { Fab } from '../../src/components/Fab';
import { Header } from '../../src/components/Header';
import { ItemRow } from '../../src/components/ItemRow';
import { Sheet, SheetConfig } from '../../src/components/Sheet';
import { CATEGORIES, Item, leftToPack } from '../../src/model';
import { useStore, useTrip } from '../../src/store';
import { colors, radius } from '../../src/theme';

export default function TripScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { ready, addItem, toggleItem } = useStore();
  const trip = useTrip(id);
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

  function goBack() {
    if (router.canGoBack()) router.back();
    else router.replace('/');
  }

  if (!ready) return <View style={styles.screen} />;

  if (!trip) {
    return (
      <View style={styles.screen}>
        <Header title="Trip not found" backLabel="Trips" onBack={goBack} backTestID="trip.back" />
      </View>
    );
  }

  const left = leftToPack(trip);

  function openAddItem() {
    if (!trip) return;
    const tripId = trip.id;
    setSheet({
      kind: 'item',
      tripName: trip.name,
      onSave: (v) => {
        addItem(tripId, v);
      },
    });
  }

  return (
    <View style={styles.screen} testID="screen.trip">
      <Header title={trip.name} backLabel="Trips" onBack={goBack} backTestID="trip.back" />
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
        contentContainerStyle={styles.list}
      />
      <Fab testID="item.add" label="Add item" onPress={openAddItem} />
      <Sheet config={sheet} onClose={() => setSheet(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  list: { paddingBottom: 100 },
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
