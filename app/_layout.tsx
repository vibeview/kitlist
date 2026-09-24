import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useLayout } from '../src/layout';
import { StoreProvider } from '../src/store';
import { colors } from '../src/theme';

function Navigator() {
  // With two panes, picking a trip swaps the right-hand pane in place; a
  // push animation would slide the whole window, list included.
  const { twoPane } = useLayout();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: twoPane ? 'none' : 'default',
      }}
    />
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StoreProvider>
        <StatusBar style="dark" />
        <Navigator />
      </StoreProvider>
    </SafeAreaProvider>
  );
}
