import { useRouter } from 'expo-router';
import React from 'react';

import { SplitView } from '../src/components/SplitView';
import { NoTripSelected } from '../src/components/TripPane';
import { TripsPane } from '../src/components/TripsPane';
import { useLayout } from '../src/layout';

export default function TripsScreen() {
  const router = useRouter();
  const { twoPane } = useLayout();

  const open = (id: string) => router.push({ pathname: '/trip/[id]', params: { id } });

  if (!twoPane) return <TripsPane onSelect={open} />;
  return <SplitView primary={<TripsPane onSelect={open} />} secondary={<NoTripSelected />} />;
}
