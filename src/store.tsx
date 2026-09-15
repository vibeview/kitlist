import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { Category, Item, Trip, kebab, uniqueId } from './model';
import { seedTrips } from './seed';

const STORAGE_KEY = 'kitlist.trips.v1';

type Store = {
  ready: boolean;
  trips: Trip[];
  addTrip: (input: { name: string; startDate: string; nights: number }) => Trip;
  addItem: (tripId: string, input: { name: string; quantity: number; category: Category }) => Item | null;
  toggleItem: (tripId: string, itemId: string) => void;
};

const StoreContext = createContext<Store | null>(null);

function isTripArray(value: unknown): value is Trip[] {
  return Array.isArray(value) && value.every((t) => t && typeof t.id === 'string' && Array.isArray(t.items));
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [ready, setReady] = useState(false);
  const tripsRef = useRef<Trip[]>([]);
  tripsRef.current = trips;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      let loaded: Trip[] | null = null;
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed: unknown = JSON.parse(raw);
          if (isTripArray(parsed)) loaded = parsed;
        }
      } catch (e) {
        console.warn('[kitlist] could not read storage', e);
      }
      if (cancelled) return;
      if (loaded === null) {
        // Seed runs only when storage is empty (or unreadable).
        loaded = seedTrips();
        await persist(loaded);
      }
      setTrips(loaded);
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const update = useCallback((next: Trip[]) => {
    tripsRef.current = next;
    setTrips(next);
    void persist(next);
  }, []);

  const addTrip = useCallback<Store['addTrip']>(
    (input) => {
      const taken = new Set(tripsRef.current.map((t) => t.id));
      const trip: Trip = {
        id: uniqueId(input.name, taken),
        name: input.name.trim(),
        startDate: input.startDate,
        nights: input.nights,
        items: [],
      };
      update([...tripsRef.current, trip]);
      return trip;
    },
    [update],
  );

  const addItem = useCallback<Store['addItem']>(
    (tripId, input) => {
      const trip = tripsRef.current.find((t) => t.id === tripId);
      if (!trip) return null;
      const taken = new Set(trip.items.map((i) => i.id));
      const item: Item = {
        id: uniqueId(input.name, taken),
        name: input.name.trim(),
        quantity: input.quantity,
        category: input.category,
        packed: false,
      };
      update(tripsRef.current.map((t) => (t.id === tripId ? { ...t, items: [...t.items, item] } : t)));
      return item;
    },
    [update],
  );

  const toggleItem = useCallback<Store['toggleItem']>(
    (tripId, itemId) => {
      update(
        tripsRef.current.map((t) =>
          t.id === tripId
            ? { ...t, items: t.items.map((i) => (i.id === itemId ? { ...i, packed: !i.packed } : i)) }
            : t,
        ),
      );
    },
    [update],
  );

  const value = useMemo<Store>(
    () => ({ ready, trips, addTrip, addItem, toggleItem }),
    [ready, trips, addTrip, addItem, toggleItem],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

async function persist(trips: Trip[]) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
  } catch (e) {
    console.warn('[kitlist] could not write storage', e);
  }
}

export function useStore(): Store {
  const store = useContext(StoreContext);
  if (!store) throw new Error('useStore must be used inside StoreProvider');
  return store;
}

export function useTrip(id: string | undefined): Trip | undefined {
  const { trips } = useStore();
  return trips.find((t) => t.id === id);
}

export { kebab };
