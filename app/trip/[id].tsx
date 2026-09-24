import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';

import { SplitView } from '../../src/components/SplitView';
import { TripPane } from '../../src/components/TripPane';
import { TripsPane } from '../../src/components/TripsPane';
import { useLayout } from '../../src/layout';

/**
 * The selected trip lives in the route, so folding and unfolding only changes
 * how much is shown: one pane with a back button on a narrow window, the list
 * and the packing list side by side on a wide one — same trip either way.
 */
export default function TripScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { twoPane } = useLayout();

  function goBack() {
    if (router.canGoBack()) router.back();
    else router.replace('/');
  }

  if (!twoPane) return <TripPane tripId={id} onBack={goBack} />;
  return (
    <SplitView
      primary={<TripsPane selectedId={id} onSelect={(next) => router.setParams({ id: next })} />}
      secondary={<TripPane tripId={id} />}
    />
  );
}
