import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { ScheduledTask } from '../../types/Task.types';
import { TaskStatus } from '../../types/calendar/Calendar.types';
import { TaskFormModal } from './TaskFormModal';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDateTime(dateTime: string): string {
  const d = new Date(dateTime);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const month = months[d.getMonth()];
  const day   = d.getDate();
  const h     = d.getHours();
  const m     = String(d.getMinutes()).padStart(2, '0');
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hour   = h % 12 === 0 ? 12 : h % 12;
  return `${month} ${day} · ${hour}:${m} ${suffix}`;
}

function formatTimeRange(start: string, end: string): string {
  const fmt = (dt: string) => {
    const d = new Date(dt);
    const h = d.getHours();
    const m = String(d.getMinutes()).padStart(2, '0');
    const suffix = h >= 12 ? 'PM' : 'AM';
    const hour   = h % 12 === 0 ? 12 : h % 12;
    return `${hour}:${m} ${suffix}`;
  };
  return `${fmt(start)} – ${fmt(end)}`;
}

function formatDuration(start: string, end: string): string {
  const mins = (new Date(end).getTime() - new Date(start).getTime()) / 60000;
  if (mins < 60) return `${Math.round(mins)}m`;
  const h = Math.floor(mins / 60);
  const m = Math.round(mins % 60);
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<TaskStatus, { label: string; color: string; bg: string }> = {
    in_progress: { label: 'In Progress', color: '#185FA5', bg: '#E6F1FB' },
    complete: { label: 'Complete', color: '#0F6E56', bg: '#E1F5EE' },
    delayed: { label: 'Delayed', color: '#854F0B', bg: '#FAEEDA' },
    skipped: { label: 'Skipped', color: '#A32D2D', bg: '#FCEBEB' },
    failed: { label: 'Failed', color: '#A32D2D', bg: '#FCEBEB' },
};

const PRIORITY_COLOR: Record<string, string> = {
  low:    '#3B6D11',
  medium: '#854F0B',
  high:   '#A32D2D',
};

// ─── Action button ────────────────────────────────────────────────────────────

interface ActionButtonProps {
  label: string;
  icon: string;
  color: string;
  onPress: () => void;
  disabled?: boolean;
}

function ActionButton({ label, icon, color, onPress, disabled }: ActionButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[styles.actionBtn, disabled && styles.actionBtnDisabled]}
    >
      <Text style={[styles.actionIcon, { color: disabled ? '#B4B2A9' : color }]}>
        {icon}
      </Text>
      <Text style={[styles.actionLabel, { color: disabled ? '#B4B2A9' : color }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface TaskDetailModalProps {
  visible: boolean;
  task: ScheduledTask | null;
  onClose: () => void;
  onUpdate: (task: ScheduledTask) => void;
  onComplete: (id: string) => void;
  onDelay:    (id: string) => void;
  onSkip:     (id: string) => void;
  onDelete:   (id: string) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function TaskDetailModal({
  visible,
  task,
  onClose,
  onUpdate,
  onComplete,
  onDelay,
  onSkip,
  onDelete,
}: TaskDetailModalProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  if (!task) return null;

  const statusCfg = STATUS_CONFIG[task.status];
  const isActionable = task.status === 'in_progress';
  const isFinished   = task.status === 'complete' || task.status === 'skipped';

  const handleAction = (action: () => void) => {
    action();
    onClose();
  };

  const handleDelete = () => {
    if (!confirmingDelete) {
      setConfirmingDelete(true);
      return;
    }
    onDelete(task.id);
    setConfirmingDelete(false);
    onClose();
  };

  return (
    <>
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={onClose}
      >
        <SafeAreaView style={styles.safe}>

          {/* ── Header ── */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} hitSlop={HIT_SLOP}>
              <Text style={styles.closeBtn}>Done</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setEditOpen(true)} hitSlop={HIT_SLOP}>
              <Text style={styles.editBtn}>Edit</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.body}>

            {/* ── Color bar + title ── */}
            <View style={[styles.colorBar, { backgroundColor: task.color }]} />
            <Text style={styles.taskTitle}>{task.title}</Text>

            {/* ── Badges ── */}
            <View style={styles.badgeRow}>
              <View style={[styles.badge, { backgroundColor: statusCfg.bg }]}>
                <Text style={[styles.badgeText, { color: statusCfg.color }]}>
                  {statusCfg.label}
                </Text>
              </View>
              <View style={[styles.badge, { backgroundColor: '#F1EFE8' }]}>
                <Text style={[styles.badgeText, { color: PRIORITY_COLOR[task.priority] ?? '#5F5E5A' }]}>
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} priority
                </Text>
              </View>
              {task.isRecommended && (
                <View style={[styles.badge, { backgroundColor: '#EEEDFE' }]}>
                  <Text style={[styles.badgeText, { color: '#534AB7' }]}>Recommended</Text>
                </View>
              )}
            </View>

            {/* ── Time info ── */}
            <View style={styles.infoBlock}>
              <InfoRow icon="🕐" label="Time" value={formatTimeRange(task.startDateTime, task.endDateTime)} />
              <InfoRow icon="⏱" label="Duration" value={formatDuration(task.startDateTime, task.endDateTime)} />
              <InfoRow icon="📅" label="Date" value={formatDateTime(task.startDateTime).split(' · ')[0]} />
            </View>

            {/* ── Subtasks ── */}
            {task.subtasks && task.subtasks.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Subtasks</Text>
                {task.subtasks.map((s, i) => (
                  <View key={i} style={styles.subtaskRow}>
                    <View style={[styles.subtaskDot, { backgroundColor: task.color }]} />
                    <Text style={styles.subtaskText}>{s}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* ── Actions ── */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Actions</Text>
              <View style={styles.actionRow}>
                <ActionButton
                  label="Complete"
                  icon="✓"
                  color="#0F6E56"
                  onPress={() => handleAction(() => onComplete(task.id))}
                  disabled={!isActionable}
                />
                <ActionButton
                  label="Delay"
                  icon="↷"
                  color="#854F0B"
                  onPress={() => handleAction(() => onDelay(task.id))}
                  disabled={!isActionable}
                />
                <ActionButton
                  label="Skip"
                  icon="✕"
                  color="#A32D2D"
                  onPress={() => handleAction(() => onSkip(task.id))}
                  disabled={!isActionable}
                />
              </View>

              {isFinished && (
                <Text style={styles.finishedNote}>
                  This task is {task.status}. Edit it to reopen.
                </Text>
              )}
            </View>

            {/* ── Delete ── */}
            <TouchableOpacity
              onPress={handleDelete}
              style={[styles.deleteBtn, confirmingDelete && styles.deleteBtnConfirm]}
            >
              <Text style={[styles.deleteBtnText, confirmingDelete && styles.deleteBtnTextConfirm]}>
                {confirmingDelete ? 'Tap again to confirm delete' : 'Delete task'}
              </Text>
            </TouchableOpacity>

          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Edit form — stacked on top */}
      <TaskFormModal
        visible={editOpen}
        task={task}
        selectedDate={task.startDateTime.split('T')[0]}
        onClose={() => setEditOpen(false)}
        onSave={(updated) => {
          onUpdate(updated);
          setEditOpen(false);
        }}
      />
    </>
  );
}

// ─── Info row ─────────────────────────────────────────────────────────────────

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoIcon}>{icon}</Text>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderColor: '#E0E0E0',
  },
  closeBtn: {
    fontSize: 16,
    color: '#888780',
  },
  editBtn: {
    fontSize: 16,
    fontWeight: '600',
    color: '#534AB7',
  },
  body: {
    padding: 20,
    paddingBottom: 48,
  },
  colorBar: {
    height: 4,
    borderRadius: 2,
    marginBottom: 16,
  },
  taskTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2C2C2A',
    marginBottom: 12,
    lineHeight: 28,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 20,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  infoBlock: {
    borderWidth: 0.5,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderBottomWidth: 0.5,
    borderColor: '#F1EFE8',
    gap: 10,
  },
  infoIcon: {
    fontSize: 15,
    width: 22,
    textAlign: 'center',
  },
  infoLabel: {
    fontSize: 13,
    color: '#888780',
    width: 64,
  },
  infoValue: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    color: '#2C2C2A',
    textAlign: 'right',
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#888780',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  subtaskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 7,
    borderBottomWidth: 0.5,
    borderColor: '#F1EFE8',
  },
  subtaskDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    flexShrink: 0,
  },
  subtaskText: {
    flex: 1,
    fontSize: 14,
    color: '#2C2C2A',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: '#D3D1C7',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FAFAF8',
  },
  actionBtnDisabled: {
    opacity: 0.45,
  },
  actionIcon: {
    fontSize: 20,
  },
  actionLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  finishedNote: {
    marginTop: 10,
    fontSize: 12,
    color: '#B4B2A9',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  deleteBtn: {
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: '#D3D1C7',
    alignItems: 'center',
    marginTop: 8,
  },
  deleteBtnConfirm: {
    borderColor: '#A32D2D',
    backgroundColor: '#FFF5F5',
  },
  deleteBtnText: {
    fontSize: 14,
    color: '#B4B2A9',
  },
  deleteBtnTextConfirm: {
    color: '#A32D2D',
    fontWeight: '600',
  },
});