import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { Fab } from '../src/components/Fab';
import { Header } from '../src/components/Header';
import { Sheet, SheetConfig } from '../src/components/Sheet';
import { TripRow } from '../src/components/TripRow';
import { useStore } from '../src/store';
import { colors } from '../src/theme';

export default function TripsScreen() {
  const router = useRouter();
  const { ready, trips, addTrip } = useStore();
  const [sheet, setSheet] = useState<SheetConfig | null>(null);

  function openNewTrip() {
    setSheet({
      kind: 'trip',
      onSave: (v) => {
        const trip = addTrip(v);
        router.push({ pathname: '/trip/[id]', params: { id: trip.id } });
      },
    });
  }

  return (
    <View style={styles.screen} testID="screen.trips">
      <Header title="Trips" />
      {ready ? (
        <FlatList
          data={trips}
          keyExtractor={(t) => t.id}
          renderItem={({ item }) => (
            <TripRow trip={item} onPress={() => router.push({ pathname: '/trip/[id]', params: { id: item.id } })} />
          )}
          contentContainerStyle={styles.list}
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
  list: { paddingTop: 4, paddingBottom: 100 },
  empty: { color: colors.inkSecondary, textAlign: 'center', marginTop: 48, paddingHorizontal: 40, fontSize: 15 },
});
