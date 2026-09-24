import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HINGE_GUTTER, useLayout } from '../layout';
import { CATEGORIES, Category, parseIsoDate, todayIso } from '../model';
import { colors, radius } from '../theme';

/** Which pane the sheet belongs to, when two panes are showing. */
type Side = 'primary' | 'secondary';

export type SheetConfig =
  | {
      kind: 'item';
      side: Side;
      tripName: string;
      onSave: (v: { name: string; quantity: number; category: Category }) => void;
    }
  | { kind: 'trip'; side: Side; onSave: (v: { name: string; startDate: string; nights: number }) => void };

type Props = { config: SheetConfig | null; onClose: () => void };

/**
 * One bottom sheet, two shapes:
 *  - item: name, quantity (default 1), category chips, "Add to <trip>"
 *  - trip: name, start date, nights, "Create trip"
 *
 * With two panes the sheet stays inside its own half — the pane it was opened
 * from when they are side by side, the bottom half when they are stacked — so
 * it never lies across the fold of a half-open foldable.
 */
export function Sheet({ config, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const { twoPane, direction, width, height } = useLayout();
  const [name, setName] = useState('');
  const [qty, setQty] = useState('1');
  const [category, setCategory] = useState<Category>('Other');
  const [date, setDate] = useState(todayIso());
  const [nights, setNights] = useState('2');
  const [error, setError] = useState<string | null>(null);

  // Reset the form every time the sheet opens.
  useEffect(() => {
    if (config) {
      setName('');
      setQty('1');
      setCategory('Other');
      setDate(todayIso());
      setNights('2');
      setError(null);
    }
  }, [config]);

  if (!config) return null;

  const half = twoPane && direction === 'row' ? config.side : null;
  const placement = {
    width: half ? (width - HINGE_GUTTER) / 2 : undefined,
    alignSelf: half === 'primary' ? ('flex-start' as const) : half === 'secondary' ? ('flex-end' as const) : undefined,
    maxHeight: twoPane && direction === 'column' ? (height - HINGE_GUTTER) / 2 : ('85%' as const),
    paddingLeft: 20 + (half === 'secondary' ? 0 : insets.left),
    paddingRight: 20 + (half === 'primary' ? 0 : insets.right),
    paddingBottom: Math.max(insets.bottom, 16) + 8,
  };

  const title = config.kind === 'item' ? 'Add item' : 'New trip';
  const saveLabel = config.kind === 'item' ? `Add to ${config.tripName}` : 'Create trip';

  function save() {
    if (!config) return;
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Give it a name.');
      return;
    }
    if (config.kind === 'item') {
      const quantity = Number.parseInt(qty, 10);
      if (!Number.isFinite(quantity) || quantity < 1) {
        setError('Quantity must be a whole number of at least 1.');
        return;
      }
      config.onSave({ name: trimmed, quantity, category });
    } else {
      if (!parseIsoDate(date)) {
        setError('Start date must look like 2026-09-25.');
        return;
      }
      const n = Number.parseInt(nights, 10);
      if (!Number.isFinite(n) || n < 0) {
        setError('Nights must be a whole number.');
        return;
      }
      config.onSave({ name: trimmed, startDate: date.trim(), nights: n });
    }
    onClose();
  }

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close" testID="sheet.backdrop" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.avoid} pointerEvents="box-none">
        <View style={[styles.card, placement]} testID="sheet">
          <View style={styles.grabber} />
          <Text style={styles.title} accessibilityRole="header">
            {title}
          </Text>
          <ScrollView style={styles.scroll} keyboardShouldPersistTaps="handled" bounces={false}>
            <Field label="Name">
              <TextInput
                testID="sheet.name"
                accessibilityLabel="Name"
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder={config.kind === 'item' ? 'e.g. Sunscreen' : 'e.g. Lisbon, long weekend'}
                placeholderTextColor={colors.inkSecondary}
                autoFocus
                autoCorrect={false}
                returnKeyType="done"
                onSubmitEditing={save}
              />
            </Field>

            {config.kind === 'item' ? (
              <>
                <Field label="Quantity">
                  <TextInput
                    testID="sheet.qty"
                    accessibilityLabel="Quantity"
                    style={[styles.input, styles.inputShort]}
                    value={qty}
                    onChangeText={setQty}
                    keyboardType="number-pad"
                    selectTextOnFocus
                  />
                </Field>
                <Field label="Category">
                  <View style={styles.chips}>
                    {CATEGORIES.map((c) => {
                      const selected = c === category;
                      return (
                        <Pressable
                          key={c}
                          testID={`sheet.cat.${c}`}
                          accessibilityRole="radio"
                          accessibilityState={{ selected, checked: selected }}
                          accessibilityLabel={c}
                          onPress={() => setCategory(c)}
                          style={[styles.chip, selected && styles.chipSelected]}
                        >
                          <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{c}</Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </Field>
              </>
            ) : (
              <View style={styles.rowFields}>
                <Field label="Start date" style={styles.flex}>
                  <TextInput
                    testID="sheet.date"
                    accessibilityLabel="Start date"
                    style={styles.input}
                    value={date}
                    onChangeText={setDate}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor={colors.inkSecondary}
                    autoCorrect={false}
                    autoCapitalize="none"
                  />
                </Field>
                <Field label="Nights">
                  <TextInput
                    testID="sheet.nights"
                    accessibilityLabel="Nights"
                    style={[styles.input, styles.inputShort]}
                    value={nights}
                    onChangeText={setNights}
                    keyboardType="number-pad"
                    selectTextOnFocus
                  />
                </Field>
              </View>
            )}

            {error ? (
              <Text style={styles.error} testID="sheet.error">
                {error}
              </Text>
            ) : null}
          </ScrollView>

          {/* Outside the scroll view, so a short screen with the keyboard up
              (a foldable's cover screen, a small phone) never hides it. */}
          <Pressable
            testID="sheet.save"
            accessibilityRole="button"
            accessibilityLabel={saveLabel}
            onPress={save}
            style={({ pressed }) => [styles.save, pressed && styles.savePressed]}
          >
            <Text style={styles.saveText} numberOfLines={1}>
              {saveLabel}
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function Field({ label, children, style }: { label: string; children: React.ReactNode; style?: object }) {
  return (
    <View style={[styles.field, style]}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: 'rgba(28, 34, 48, 0.35)' },
  avoid: { flex: 1, justifyContent: 'flex-end' },
  card: {
    backgroundColor: colors.card,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    paddingTop: 10,
  },
  grabber: { alignSelf: 'center', width: 36, height: 4, borderRadius: 2, backgroundColor: colors.line, marginBottom: 12 },
  title: { color: colors.ink, fontSize: 20, fontWeight: '700', marginBottom: 14 },
  scroll: { flexShrink: 1 },
  field: { marginBottom: 14 },
  flex: { flex: 1 },
  rowFields: { flexDirection: 'row', gap: 12 },
  label: { color: colors.inkSecondary, fontSize: 13, fontWeight: '500', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.ink,
    backgroundColor: colors.background,
  },
  inputShort: { width: 96 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    borderRadius: radius.chip,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: colors.card,
  },
  chipSelected: { backgroundColor: colors.accent, borderColor: colors.accent },
  chipText: { color: colors.ink, fontSize: 14, fontWeight: '500' },
  chipTextSelected: { color: colors.card },
  error: { color: colors.accent, fontSize: 13, marginBottom: 10 },
  save: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  savePressed: { opacity: 0.85 },
  saveText: { color: colors.card, fontSize: 16, fontWeight: '600' },
});
