import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import {
  CalendarProvider,
  ExpandableCalendar,
} from 'react-native-calendars';
import { useTaskStore } from '../../store/useTaskStore';
import { getTasksForDay } from '../../utils/calendarUtils';
import { ScheduledTask } from '../../types/Task.types';
import { TaskFormModal } from './TaskFormModal';
import { TaskDetailModal } from './TaskDetailModal';
import { DelayTaskDialog } from './DelayTaskDialog';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { SegmentedControl } from '../ui/SegmentedControl';
import { EmptyState } from '../ui/EmptyState';
import { colors } from '../../styling/theme';
import { styles, calendarTheme } from '../../styling/components/calendar/Calendar.styles';

type ListFilter = 'all' | 'active' | 'done';

const FILTER_OPTIONS: { value: ListFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'done', label: 'Done' },
];

function applyFilter(tasks: ScheduledTask[], filter: ListFilter): ScheduledTask[] {
  if (filter === 'all') return tasks;
  if (filter === 'done') return tasks.filter((t) => t.status === 'complete' || t.status === 'skipped');
  return tasks.filter((t) => t.status === 'in_progress' || t.status === 'delayed');
}

// ─── Modal orchestration ────────────────────────────────────────────────────
//
// Four modals live here: create/edit form, task detail, delay-date picker,
// and delete confirmation. Only one is ever visible at a time — every
// "open the next one" handler closes whichever is currently open first.
// Stacking multiple native <Modal>s at once previously froze touch input,
// so this single-owner approach is intentional, not incidental.

export function Calendar() {
  const [formOpen, setFormOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<ScheduledTask | null>(null);
  const [delayTarget, setDelayTarget] = useState<ScheduledTask | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ScheduledTask | null>(null);
  const [filter, setFilter] = useState<ListFilter>('all');

  const {
    tasks,
    selectedDate,
    setSelectedDate,
    addTask,
    updateTask,
    removeTask,
    completeTask,
    delayTask,
    skipTask,
  } = useTaskStore();

  const openCreate = () => {
    setSelectedTask(null);
    setFormOpen(true);
  };

  const openDetail = (task: ScheduledTask) => {
    setSelectedTask(task);
    setDetailOpen(true);
  };

  const handleEdit = (task: ScheduledTask) => {
    setDetailOpen(false);
    setSelectedTask(task);
    setFormOpen(true);
  };

  const handleRequestDelay = (task: ScheduledTask) => {
    setDetailOpen(false);
    setDelayTarget(task);
  };

  const handleConfirmDelay = (newDate: string) => {
    if (delayTarget) delayTask(delayTarget.id, newDate);
    setDelayTarget(null);
  };

  const handleRequestDelete = (task: ScheduledTask) => {
    setDetailOpen(false);
    setDeleteTarget(task);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) removeTask(deleteTarget.id);
    setDeleteTarget(null);
  };

  const markedDates = getMarkedDates(tasks, selectedDate);
  const dailyTasks = useMemo(
    () => applyFilter(getTasksForDay(tasks, selectedDate), filter),
    [tasks, selectedDate, filter]
  );

  return (
    <CalendarProvider date={selectedDate} onDateChanged={(date) => setSelectedDate(date)}>
      <ExpandableCalendar
        markingType="multi-dot"
        markedDates={markedDates}
        theme={calendarTheme}
      />

      <View style={styles.toolbar}>
        <View style={styles.filterWrap}>
          <SegmentedControl options={FILTER_OPTIONS} value={filter} onChange={setFilter} />
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={openCreate} accessibilityRole="button" accessibilityLabel="Add task">
          <Text style={styles.addBtnText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={dailyTasks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState
            glyph="◌"
            title="Nothing here"
            subtitle={filter === 'all' ? 'No tasks for this day yet.' : 'No tasks match this filter.'}
          />
        }
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.taskRow} onPress={() => openDetail(item)} activeOpacity={0.7}>
            <View style={[styles.colorDot, { backgroundColor: item.color }]} />

            <Text
              style={[
                styles.taskText,
                (item.status === 'complete' || item.status === 'skipped') && styles.taskTextDone,
              ]}
              numberOfLines={1}
            >
              {item.title}
            </Text>

            {item.status === 'in_progress' ? (
              <View style={styles.actionsRow}>
                <TouchableOpacity onPress={() => completeTask(item.id)} style={styles.action} hitSlop={HIT_SLOP}>
                  <Text style={styles.complete}>✓</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleRequestDelay(item)} style={styles.action} hitSlop={HIT_SLOP}>
                  <Text style={styles.delay}>↷</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => skipTask(item.id)} style={styles.action} hitSlop={HIT_SLOP}>
                  <Text style={styles.skip}>✕</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <Text style={styles.statusLabel}>{item.status.replace('_', ' ')}</Text>
            )}
          </TouchableOpacity>
        )}
      />

      {/* CREATE / EDIT MODAL */}
      <TaskFormModal
        visible={formOpen}
        task={selectedTask ?? undefined}
        selectedDate={selectedDate}
        onClose={() => setFormOpen(false)}
        onSave={(task) => {
          if (selectedTask) {
            updateTask(task.id, task);
          } else {
            addTask(task);
          }
          setFormOpen(false);
        }}
      />

      {/* DETAIL MODAL */}
      <TaskDetailModal
        visible={detailOpen}
        task={selectedTask}
        onClose={() => setDetailOpen(false)}
        onComplete={(id) => completeTask(id)}
        onSkip={(id) => skipTask(id)}
        onEdit={handleEdit}
        onRequestDelay={handleRequestDelay}
        onRequestDelete={handleRequestDelete}
      />

      {/* DELAY DATE PICKER */}
      <DelayTaskDialog
        visible={!!delayTarget}
        taskTitle={delayTarget?.title}
        initialDate={delayTarget ? delayTarget.startDateTime.split('T')[0] : undefined}
        onConfirm={handleConfirmDelay}
        onCancel={() => setDelayTarget(null)}
      />

      {/* DELETE CONFIRMATION */}
      <ConfirmDialog
        visible={!!deleteTarget}
        title="Delete this task?"
        message={deleteTarget ? `"${deleteTarget.title}" will be removed permanently. This can't be undone.` : undefined}
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </CalendarProvider>
  );
}

const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };

function getMarkedDates(tasks: ScheduledTask[], selectedDate: string): Record<string, any> {
  const marks: Record<string, any> = {};

  tasks.forEach((task) => {
    const date = task.startDateTime.split('T')[0];

    if (!marks[date]) {
      marks[date] = { dots: [] };
    }

    marks[date].dots.push({
      key: task.id,
      color: task.color,
    });
  });

  if (selectedDate) {
    marks[selectedDate] = {
      ...(marks[selectedDate] || {}),
      selected: true,
      selectedColor: colors.brandSoft,
    };
  }

  return marks;
}
