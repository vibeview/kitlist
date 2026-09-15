export const CATEGORIES = ['Documents', 'Clothes', 'Toiletries', 'Tech', 'Other'] as const;
export type Category = (typeof CATEGORIES)[number];

export type Item = {
  id: string;
  name: string;
  quantity: number;
  category: Category;
  packed: boolean;
};

export type Trip = {
  id: string;
  name: string;
  /** ISO calendar date, YYYY-MM-DD (no time, no zone). */
  startDate: string;
  nights: number;
  items: Item[];
};

/** Number of items not yet packed — always derived, never stored. */
export function leftToPack(trip: Trip): number {
  return trip.items.filter((item) => !item.packed).length;
}

export function packedCount(trip: Trip): number {
  return trip.items.filter((item) => item.packed).length;
}

/** "swim-shorts", "eu-plug-adapter" — lowercase kebab-case of a name. */
export function kebab(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** kebab(name), with a numeric suffix when the id is already taken. */
export function uniqueId(name: string, taken: ReadonlySet<string>): string {
  const base = kebab(name) || 'item';
  if (!taken.has(base)) return base;
  let n = 2;
  while (taken.has(`${base}-${n}`)) n += 1;
  return `${base}-${n}`;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Parse YYYY-MM-DD as a local calendar date; null when malformed. */
export function parseIsoDate(value: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  if (d.getMonth() !== Number(m[2]) - 1 || d.getDate() !== Number(m[3])) return null;
  return d;
}

/** "Fri 25 Sep 2026" */
export function formatStartDate(value: string): string {
  const d = parseIsoDate(value);
  if (!d) return value;
  return `${WEEKDAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export function todayIso(): string {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}

export function nightsLabel(nights: number): string {
  return nights === 1 ? '1 night' : `${nights} nights`;
}
