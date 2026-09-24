import React, { createContext, useContext } from 'react';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';

type Edges = { top: boolean; right: boolean; bottom: boolean; left: boolean };

const ALL: Edges = { top: true, right: true, bottom: true, left: true };
const PaneEdgesContext = createContext<Edges>(ALL);

/** Tells a pane which edges of the window it touches. */
export function PaneEdges({ edges, children }: { edges: Partial<Edges>; children: React.ReactNode }) {
  return <PaneEdgesContext.Provider value={{ ...ALL, ...edges }}>{children}</PaneEdgesContext.Provider>;
}

/**
 * Safe-area insets for the pane we are in, each edge on its own: on a
 * foldable the status bar and camera can sit down one side, so left and right
 * (or top and bottom) are rarely equal, and a pane that does not touch an
 * edge needs no inset there at all.
 */
export function usePaneInsets(): EdgeInsets {
  const insets = useSafeAreaInsets();
  const edges = useContext(PaneEdgesContext);
  return {
    top: edges.top ? insets.top : 0,
    right: edges.right ? insets.right : 0,
    bottom: edges.bottom ? insets.bottom : 0,
    left: edges.left ? insets.left : 0,
  };
}
