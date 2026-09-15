import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Trip, formatStartDate, nightsLabel, packedCount } from '../model';
import { colors, radius } from '../theme';
import { ProgressBar } from './ProgressBar';

type Props = { trip: Trip; onPress: () => void };

export function TripRow({ trip, onPress }: Props) {
  const packed = packedCount(trip);
  const total = trip.items.length;
  return (
    <Pressable
      testID={`trip.row.${trip.id}`}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.top}>
        <View style={styles.text}>
          <Text style={styles.name} numberOfLines={1}>
            {trip.name}
          </Text>
          <Text style={styles.meta}>
            {formatStartDate(trip.startDate)} · {nightsLabel(trip.nights)}
          </Text>
        </View>
        <Text style={[styles.count, packed === total && total > 0 && styles.countDone]} testID={`trip.count.${trip.id}`}>
          {packed} / {total}
        </Text>
      </View>
      <ProgressBar packed={packed} total={total} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    gap: 12,
  },
  pressed: { opacity: 0.9 },
  top: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  text: { flex: 1, gap: 3 },
  name: { color: colors.ink, fontSize: 17, fontWeight: '600' },
  meta: { color: colors.inkSecondary, fontSize: 14 },
  count: { color: colors.inkSecondary, fontSize: 15, fontVariant: ['tabular-nums'], marginTop: 1 },
  countDone: { color: colors.done, fontWeight: '600' },
});
