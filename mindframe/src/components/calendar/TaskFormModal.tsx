import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { ScheduledTask } from '../../types/Task.types';
import { TaskPriority, TaskStatus } from '../../types/calendar/Calendar.types';
import { formatDateString } from '../../utils/calendarUtils';

// ─── Constants ────────────────────────────────────────────────────────────────

const PRIORITY_OPTIONS: TaskPriority[] = ['low', 'medium', 'high'];

const COLOR_OPTIONS = [
  '#534AB7', // purple
  '#0F6E56', // teal
  '#D85A30', // coral
  '#185FA5', // blue
  '#854F0B', // amber
  '#993556', // pink
  '#3B6D11', // green
  '#A32D2D', // red
];

const DEFAULT_STATUS: TaskStatus = 'in_progress';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function generateId(): string {
  return `task-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

/** "09:30" from a datetime string */
function extractTime(dateTime: string): string {
  const d = new Date(dateTime);
  const h = String(d.getHours()).padStart(2, '0');
  const m = String(d.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

/** "YYYY-MM-DD" from a datetime string */
function extractDate(dateTime: string): string {
  return dateTime.split('T')[0];
}

/** BuildLocal datetime from date string + "HH:MM" time string */
function buildDateTime(date: string, time: string): string {
  return `${date}T${time}:00`;
}

/** Validate that end is after start on the same day */
function isEndAfterStart(date: string, start: string, end: string): boolean {
  return new Date(buildDateTime(date, end)) > new Date(buildDateTime(date, start));
}

// ─── Form state type ──────────────────────────────────────────────────────────

interface FormState {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  priority: TaskPriority;
  color: string;
  subtasks: string[];
  newSubtask: string;
}

function buildInitialForm(selectedDate: string, task?: ScheduledTask): FormState {
  if (task) {
    return {
      title:      task.title,
      date:       extractDate(task.startDateTime),
      startTime:  extractTime(task.startDateTime),
      endTime:    extractTime(task.endDateTime),
      priority:   task.priority,
      color:      task.color,
      subtasks:   task.subtasks ?? [],
      newSubtask: '',
    };
  }
  return {
    title:      '',
    date:       selectedDate,
    startTime:  '09:00',
    endTime:    '10:00',
    priority:   'medium',
    color:      COLOR_OPTIONS[0],
    subtasks:   [],
    newSubtask: '',
  };
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface TaskFormModalProps {
  visible: boolean;
  /** When provided, form is in edit mode */
  task?: ScheduledTask;
  selectedDate: string;
  onClose: () => void;
  onSave: (task: ScheduledTask) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function TaskFormModal({
  visible,
  task,
  selectedDate,
  onClose,
  onSave,
}: TaskFormModalProps) {
  const isEdit = Boolean(task);
  const [form, setForm] = useState<FormState>(() =>
    buildInitialForm(selectedDate, task)
  );
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  // Re-initialise when the task prop or visibility changes
  useEffect(() => {
    if (visible) {
      setForm(buildInitialForm(selectedDate, task));
      setErrors({});
    }
  }, [visible, task, selectedDate]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  // ── Subtask helpers ──────────────────────────────────────────────────────

  const addSubtask = () => {
    const trimmed = form.newSubtask.trim();
    if (!trimmed) return;
    set('subtasks', [...form.subtasks, trimmed]);
    set('newSubtask', '');
  };

  const removeSubtask = (index: number) =>
    set('subtasks', form.subtasks.filter((_, i) => i !== index));

  // ── Validation ───────────────────────────────────────────────────────────

  function validate(): boolean {
    const next: typeof errors = {};
    if (!form.title.trim())
      next.title = 'Title is required';
    if (!form.date.match(/^\d{4}-\d{2}-\d{2}$/))
      next.date = 'Use format YYYY-MM-DD';
    if (!form.startTime.match(/^\d{2}:\d{2}$/))
      next.startTime = 'Use format HH:MM';
    if (!form.endTime.match(/^\d{2}:\d{2}$/))
      next.endTime = 'Use format HH:MM';
    if (
      !next.startTime &&
      !next.endTime &&
      !isEndAfterStart(form.date, form.startTime, form.endTime)
    )
      next.endTime = 'End must be after start';

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  // ── Submit ───────────────────────────────────────────────────────────────

  const handleSave = () => {
    if (!validate()) return;

    const saved: ScheduledTask = {
      id:            task?.id ?? generateId(),
      title:         form.title.trim(),
      startDateTime: buildDateTime(form.date, form.startTime),
      endDateTime:   buildDateTime(form.date, form.endTime),
      priority:      form.priority,
      color:         form.color,
      status:        task?.status ?? DEFAULT_STATUS,
      subtasks:      form.subtasks.length > 0 ? form.subtasks : undefined,
      isRecommended: task?.isRecommended ?? false,
    };

    onSave(saved);
    onClose();
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {/* ── Header ── */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} hitSlop={HIT_SLOP}>
              <Text style={styles.cancel}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.title}>{isEdit ? 'Edit Task' : 'New Task'}</Text>
            <TouchableOpacity onPress={handleSave} hitSlop={HIT_SLOP}>
              <Text style={styles.save}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={styles.body}
            keyboardShouldPersistTaps="handled"
          >
            {/* ── Title ── */}
            <Field label="Title" error={errors.title}>
              <TextInput
                style={[styles.input, errors.title && styles.inputError]}
                value={form.title}
                onChangeText={(v) => set('title', v)}
                placeholder="What needs to get done?"
                placeholderTextColor="#B4B2A9"
                returnKeyType="next"
                autoFocus={!isEdit}
              />
            </Field>

            {/* ── Date ── */}
            <Field label="Date" error={errors.date}>
              <TextInput
                style={[styles.input, errors.date && styles.inputError]}
                value={form.date}
                onChangeText={(v) => set('date', v)}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#B4B2A9"
                keyboardType="numbers-and-punctuation"
              />
            </Field>

            {/* ── Time row ── */}
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Field label="Start" error={errors.startTime}>
                  <TextInput
                    style={[styles.input, errors.startTime && styles.inputError]}
                    value={form.startTime}
                    onChangeText={(v) => set('startTime', v)}
                    placeholder="09:00"
                    placeholderTextColor="#B4B2A9"
                    keyboardType="numbers-and-punctuation"
                  />
                </Field>
              </View>
              <Text style={styles.timeSep}>–</Text>
              <View style={{ flex: 1 }}>
                <Field label="End" error={errors.endTime}>
                  <TextInput
                    style={[styles.input, errors.endTime && styles.inputError]}
                    value={form.endTime}
                    onChangeText={(v) => set('endTime', v)}
                    placeholder="10:00"
                    placeholderTextColor="#B4B2A9"
                    keyboardType="numbers-and-punctuation"
                  />
                </Field>
              </View>
            </View>

            {/* ── Priority ── */}
            <Field label="Priority">
              <View style={styles.chipRow}>
                {PRIORITY_OPTIONS.map((p) => (
                  <TouchableOpacity
                    key={p}
                    onPress={() => set('priority', p)}
                    style={[
                      styles.chip,
                      form.priority === p && styles.chipActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        form.priority === p && styles.chipTextActive,
                      ]}
                    >
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Field>

            {/* ── Color ── */}
            <Field label="Color">
              <View style={styles.colorRow}>
                {COLOR_OPTIONS.map((c) => (
                  <TouchableOpacity
                    key={c}
                    onPress={() => set('color', c)}
                    style={[
                      styles.colorSwatch,
                      { backgroundColor: c },
                      form.color === c && styles.colorSwatchActive,
                    ]}
                  />
                ))}
              </View>
            </Field>

            {/* ── Subtasks ── */}
            <Field label="Subtasks">
              {form.subtasks.map((s, i) => (
                <View key={i} style={styles.subtaskRow}>
                  <Text style={styles.subtaskBullet}>·</Text>
                  <Text style={styles.subtaskText}>{s}</Text>
                  <TouchableOpacity onPress={() => removeSubtask(i)} hitSlop={HIT_SLOP}>
                    <Text style={styles.subtaskRemove}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
              <View style={styles.subtaskInputRow}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  value={form.newSubtask}
                  onChangeText={(v) => set('newSubtask', v)}
                  placeholder="Add a subtask…"
                  placeholderTextColor="#B4B2A9"
                  onSubmitEditing={addSubtask}
                  returnKeyType="done"
                  blurOnSubmit={false}
                />
                <TouchableOpacity onPress={addSubtask} style={styles.addBtn}>
                  <Text style={styles.addBtnText}>Add</Text>
                </TouchableOpacity>
              </View>
            </Field>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

// ─── Field wrapper ────────────────────────────────────────────────────────────

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {children}
      {error && <Text style={styles.fieldError}>{error}</Text>}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const HIT_SLOP = { top: 12, bottom: 12, left: 12, right: 12 };

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderColor: '#E0E0E0',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C2C2A',
  },
  cancel: {
    fontSize: 16,
    color: '#888780',
  },
  save: {
    fontSize: 16,
    fontWeight: '600',
    color: '#534AB7',
  },
  body: {
    padding: 20,
    paddingBottom: 48,
  },
  field: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#888780',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  fieldError: {
    fontSize: 12,
    color: '#A32D2D',
    marginTop: 4,
  },
  input: {
    borderWidth: 0.5,
    borderColor: '#D3D1C7',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#2C2C2A',
    backgroundColor: '#FAFAF8',
  },
  inputError: {
    borderColor: '#A32D2D',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  timeSep: {
    fontSize: 18,
    color: '#B4B2A9',
    paddingBottom: 10,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: '#D3D1C7',
    alignItems: 'center',
    backgroundColor: '#FAFAF8',
  },
  chipActive: {
    backgroundColor: '#534AB7',
    borderColor: '#534AB7',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#5F5E5A',
  },
  chipTextActive: {
    color: '#fff',
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
    borderColor: '#2C2C2A',
  },
  subtaskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    gap: 8,
    borderBottomWidth: 0.5,
    borderColor: '#F1EFE8',
  },
  subtaskBullet: {
    fontSize: 20,
    color: '#888780',
    lineHeight: 20,
  },
  subtaskText: {
    flex: 1,
    fontSize: 14,
    color: '#2C2C2A',
  },
  subtaskRemove: {
    fontSize: 12,
    color: '#B4B2A9',
  },
  subtaskInputRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  addBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: '#534AB7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#534AB7',
  },
});