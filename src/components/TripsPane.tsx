import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { usePaneInsets } from '../insets';
import { useStore } from '../store';
import { colors } from '../theme';
import { Fab } from './Fab';
import { Header } from './Header';
import { Sheet, SheetConfig } from './Sheet';
import { TripRow } from './TripRow';

type Props = {
  /** Highlighted row, when the packing list is shown next to the list. */
  selectedId?: string;
  onSelect: (tripId: string) => void;
};

/** The trips list with its "+" and new-trip sheet. */
export function TripsPane({ selectedId, onSelect }: Props) {
  const { ready, trips, addTrip } = useStore();
  const insets = usePaneInsets();
  const [sheet, setSheet] = useState<SheetConfig | null>(null);

  function openNewTrip() {
    setSheet({
      kind: 'trip',
      side: 'primary',
      onSave: (v) => onSelect(addTrip(v).id),
    });
  }

  return (
    <View style={[styles.screen, { paddingLeft: insets.left, paddingRight: insets.right }]} testID="screen.trips">
      <Header title="Trips" />
      {ready ? (
        <FlatList
          data={trips}
          keyExtractor={(t) => t.id}
          renderItem={({ item }) => (
            <TripRow trip={item} selected={item.id === selectedId} onPress={() => onSelect(item.id)} />
          )}
          contentContainerStyle={[styles.list, { paddingBottom: 100 + insets.bottom }]}
          ListEmptyComponent={
            <Text style={styles.empty} testID="trips.empty">
              No trips yet. Tap + to plan one.
            </Text>
          }
        />
      ) : null}
      <Fab testID="trips.add" label="New trip" onPress={openNewTrip} />
      <Sheet config={sheet} onClose={() => setSheet(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  list: { paddingTop: 4 },
  empty: { color: colors.inkSecondary, textAlign: 'center', marginTop: 48, paddingHorizontal: 40, fontSize: 15 },
});
