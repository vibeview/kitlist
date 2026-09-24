import { useWindowDimensions } from 'react-native';

/**
 * Narrowest pane that still reads well. Two of them plus the hinge gutter is
 * the smallest window that gets the two-pane layout: the inner screen of a
 * foldable (open or half open, either way round) or a big tablet window. A
 * phone, the cover screen of a foldable and a phone on its side stay single
 * pane.
 */
const MIN_PANE = 300;

/**
 * Space kept clear down the middle of a two-pane layout. On a foldable's
 * inner screen the hinge runs through the middle of the window whichever way
 * the device is held, so splitting exactly in half puts only this gap, never
 * a control or a line of text, on the fold.
 */
export const HINGE_GUTTER = 40;

export type Layout = {
  width: number;
  height: number;
  /** Trips list and packing list side by side (or one above the other). */
  twoPane: boolean;
  /** 'row' when the window is wider than tall, 'column' otherwise. */
  direction: 'row' | 'column';
};

/**
 * Layout decisions come from the window size only — never from the device
 * model or orientation — so every fold, unfold and rotation re-renders into
 * the right shape.
 */
export function useLayout(): Layout {
  const { width, height } = useWindowDimensions();
  const twoPane = Math.min(width, height) >= MIN_PANE * 2 && Math.max(width, height) >= MIN_PANE * 2 + HINGE_GUTTER;
  return { width, height, twoPane, direction: width >= height ? 'row' : 'column' };
}
