import { StyleSheet } from 'react-native';
import { colors, radius, spacing, type } from '../../theme';

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  title: {
    ...type.bodyStrong,
    fontSize: 16,
    color: colors.ink,
  },
  cancel: {
    ...type.body,
    fontSize: 16,
    color: colors.inkMuted,
  },
  save: {
    ...type.bodyStrong,
    fontSize: 16,
    color: colors.brand,
  },
  body: {
    padding: spacing.xl,
    paddingBottom: 48,
  },
  field: {
    marginBottom: spacing.xl,
  },
  fieldLabel: {
    ...type.caption,
    color: colors.inkFaint,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  fieldError: {
    fontSize: 12,
    color: colors.stress,
    marginTop: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.ink,
    backgroundColor: colors.surfaceAlt,
  },
  inputError: {
    borderColor: colors.stress,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  timeSep: {
    fontSize: 18,
    color: colors.inkFaint,
    paddingBottom: 10,
  },
  chipRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  chip: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    backgroundColor: colors.surfaceAlt,
  },
  chipActive: {
    backgroundColor: colors.brand,
    borderColor: colors.brand,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.inkMuted,
  },
  chipTextActive: {
    color: colors.inkOnBrand,
  },
  colorRow: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  colorSwatch: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  colorSwatchActive: {
    borderWidth: 3,
    borderColor: colors.ink,
  },
  subtaskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    gap: spacing.sm,
    borderBottomWidth: 1,
    borderColor: colors.surfaceAlt,
  },
  subtaskBullet: {
    fontSize: 20,
    color: colors.inkFaint,
    lineHeight: 20,
  },
  subtaskText: {
    flex: 1,
    fontSize: 14,
    color: colors.ink,
  },
  subtaskRemove: {
    fontSize: 12,
    color: colors.inkFaint,
  },
  subtaskInputRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  addBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.brand,
  },
});
