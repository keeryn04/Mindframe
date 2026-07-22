import { StyleSheet } from 'react-native';
import { colors, radius, spacing, type } from '../../theme';

export const calendarTheme = {
  backgroundColor: colors.surface,
  calendarBackground: colors.surface,
  todayTextColor: colors.brand,
  selectedDayBackgroundColor: colors.brand,
  selectedDayTextColor: colors.inkOnBrand,
  dayTextColor: colors.ink,
  textDisabledColor: colors.inkFaint,
  monthTextColor: colors.ink,
  textMonthFontWeight: '700' as const,
  dotColor: colors.brand,
  selectedDotColor: colors.inkOnBrand,
  arrowColor: colors.brand,
  indicatorColor: colors.brand,
  textDayFontWeight: '500' as const,
  textDayHeaderFontWeight: '600' as const,
  textSectionTitleColor: colors.inkFaint,
};

export const styles = StyleSheet.create({
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    marginBottom: 4,
  },
  filterWrap: {
    flex: 1,
  },
  addBtn: {
    paddingVertical: 10,
    paddingHorizontal: spacing.base,
    borderRadius: radius.md,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: {
    ...type.bodyStrong,
    fontSize: 13,
    color: colors.inkOnBrand,
  },

  list: {
    padding: spacing.md,
    paddingTop: spacing.sm,
  },

  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: spacing.md,
    marginBottom: 8,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },

  colorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.sm,
  },

  taskText: {
    flex: 1,
    ...type.body,
    fontSize: 15,
    color: colors.ink,
  },
  taskTextDone: {
    textDecorationLine: 'line-through',
    color: colors.inkFaint,
  },

  actionsRow: {
    flexDirection: 'row',
  },
  action: { paddingHorizontal: 6 },
  complete: { fontSize: 17, color: colors.energy, fontWeight: '700' },
  delay: { fontSize: 17, color: colors.momentum },
  skip: { fontSize: 17, color: colors.stress },

  statusLabel: {
    ...type.micro,
    color: colors.inkFaint,
    textTransform: 'capitalize',
  },
});