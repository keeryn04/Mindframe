import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { ScheduledTask } from '../../types/Task.types';
import { TaskStatus } from '../../types/calendar/Calendar.types';
import { Badge } from '../ui/Badge';
import { colors } from '../../styling/theme';
import { styles } from '../../styling/components/calendar/TaskDetailModal.styles';

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
    in_progress: { label: 'In Progress', color: colors.brand, bg: colors.brandSoft },
    complete:    { label: 'Complete',    color: colors.energy, bg: colors.energySoft },
    delayed:     { label: 'Delayed',     color: colors.momentum, bg: colors.momentumSoft },
    skipped:     { label: 'Skipped',     color: colors.stress, bg: colors.stressSoft },
    failed:      { label: 'Failed',      color: colors.stress, bg: colors.stressSoft },
};

const PRIORITY_COLOR: Record<string, string> = {
  low:    colors.energy,
  medium: colors.momentum,
  high:   colors.stress,
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
      <Text style={[styles.actionIcon, { color: disabled ? colors.inkFaint : color }]}>
        {icon}
      </Text>
      <Text style={[styles.actionLabel, { color: disabled ? colors.inkFaint : color }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────
//
// This modal never opens another <Modal> itself — every action that needs a
// follow-up UI (edit, delay, delete) hands the task back to the parent via a
// callback instead. The parent (Calendar) closes this modal first and then
// opens the next one, so only one native Modal is ever visible at a time.
// Stacking multiple <Modal>s at once is what previously froze touch input.

interface TaskDetailModalProps {
  visible: boolean;
  task: ScheduledTask | null;
  onClose: () => void;
  onComplete: (id: string) => void;
  onSkip:     (id: string) => void;
  onEdit:          (task: ScheduledTask) => void;
  onRequestDelay:  (task: ScheduledTask) => void;
  onRequestDelete: (task: ScheduledTask) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function TaskDetailModal({
  visible,
  task,
  onClose,
  onComplete,
  onSkip,
  onEdit,
  onRequestDelay,
  onRequestDelete,
}: TaskDetailModalProps) {
  if (!task) return null;

  const statusCfg = STATUS_CONFIG[task.status];
  const isActionable = task.status === 'in_progress' || task.status === 'delayed';
  const isFinished   = task.status === 'complete' || task.status === 'skipped';

  const handleAction = (action: () => void) => {
    action();
    onClose();
  };

  return (
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
          <TouchableOpacity onPress={() => onEdit(task)} hitSlop={HIT_SLOP}>
            <Text style={styles.editBtn}>Edit</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.body}>

          {/* ── Color bar + title ── */}
          <View style={[styles.colorBar, { backgroundColor: task.color }]} />
          <Text style={styles.taskTitle}>{task.title}</Text>

          {/* ── Badges ── */}
          <View style={styles.badgeRow}>
            <Badge label={statusCfg.label} color={statusCfg.color} backgroundColor={statusCfg.bg} />
            <Badge
              label={`${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} priority`}
              color={PRIORITY_COLOR[task.priority] ?? colors.inkMuted}
              backgroundColor={colors.surfaceAlt}
            />
            {task.isRecommended && (
              <Badge label="Recommended" color={colors.brand} backgroundColor={colors.brandSoft} />
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
                color={colors.energy}
                onPress={() => handleAction(() => onComplete(task.id))}
                disabled={!isActionable}
              />
              <ActionButton
                label="Delay"
                icon="↷"
                color={colors.momentum}
                onPress={() => onRequestDelay(task)}
                disabled={!isActionable}
              />
              <ActionButton
                label="Skip"
                icon="✕"
                color={colors.stress}
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
          <TouchableOpacity onPress={() => onRequestDelete(task)} style={styles.deleteBtn}>
            <Text style={styles.deleteBtnText}>Delete task</Text>
          </TouchableOpacity>

        </ScrollView>
      </SafeAreaView>
    </Modal>
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

const HIT_SLOP = { top: 12, bottom: 12, left: 12, right: 12 };
