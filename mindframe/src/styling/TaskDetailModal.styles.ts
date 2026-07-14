import { StyleSheet } from 'react-native';
import { colors, radius, spacing, type } from './theme';

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  closeBtn: {
    ...type.body,
    fontSize: 16,
    color: colors.inkMuted,
  },
  editBtn: {
    ...type.bodyStrong,
    fontSize: 16,
    color: colors.brand,
  },
  body: {
    padding: spacing.xl,
    paddingBottom: 48,
  },
  colorBar: {
    height: 4,
    borderRadius: 2,
    marginBottom: spacing.base,
  },
  taskTitle: {
    ...type.title,
    color: colors.ink,
    marginBottom: spacing.md,
    lineHeight: 28,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: spacing.xl,
  },
  infoBlock: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    overflow: 'hidden',
    marginBottom: spacing.xl,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderColor: colors.surfaceAlt,
    gap: 10,
  },
  infoIcon: {
    fontSize: 15,
    width: 22,
    textAlign: 'center',
  },
  infoLabel: {
    ...type.body,
    fontSize: 13,
    color: colors.inkFaint,
    width: 64,
  },
  infoValue: {
    flex: 1,
    ...type.bodyStrong,
    fontSize: 13,
    color: colors.ink,
    textAlign: 'right',
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionLabel: {
    ...type.caption,
    color: colors.inkFaint,
    textTransform: 'uppercase',
    marginBottom: spacing.md,
  },
  subtaskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderColor: colors.surfaceAlt,
  },
  subtaskDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    flexShrink: 0,
  },
  subtaskText: {
    flex: 1,
    ...type.body,
    fontSize: 14,
    color: colors.ink,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surfaceAlt,
  },
  actionBtnDisabled: {
    opacity: 0.45,
  },
  actionIcon: {
    fontSize: 20,
  },
  actionLabel: {
    ...type.micro,
    fontWeight: '600',
  },
  finishedNote: {
    marginTop: spacing.md,
    ...type.body,
    fontSize: 12,
    color: colors.inkFaint,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  deleteBtn: {
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  deleteBtnText: {
    ...type.body,
    fontSize: 14,
    color: colors.stress,
  },
});