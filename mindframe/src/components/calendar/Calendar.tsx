import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Platform,
} from 'react-native';
import {
  CalendarProvider,
  ExpandableCalendar,
} from 'react-native-calendars';
import { useTaskStore } from '../../store/useTaskStore';
import { getTasksForDay } from '../../utils/calendarUtils';
import { ScheduledTask } from '../../types/Task.types';
import { TaskFormModal } from './TaskFormModal';
import { TaskDetailModal } from './TaskDetailModal';

export function Calendar() {
  const [formOpen, setFormOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<ScheduledTask | null>(null);

    const openCreate = () => {
      setSelectedTask(null);
      setFormOpen(true);
    };

    const openDetail = (task: ScheduledTask) => {
      setSelectedTask(task);
      setDetailOpen(true);
    };


  const {
    tasks,
    selectedDate,
    setSelectedDate,
    addTask,
    updateTask,
    completeTask,
    delayTask,
    skipTask,
  } = useTaskStore();

  const markedDates = getMarkedDates(tasks, selectedDate);
  const dailyTasks = getTasksForDay(tasks, selectedDate);

  return (
      <CalendarProvider
        date={selectedDate}
        onDateChanged={(date) => setSelectedDate(date)}
      >
        <ExpandableCalendar
          markingType="multi-dot"
          markedDates={markedDates}
          theme={{
            todayTextColor: '#534AB7',
            selectedDayBackgroundColor: '#534AB7',
            dotColor: '#534AB7',
            arrowColor: '#534AB7',
          }}
        />

        <TouchableOpacity style={styles.addBtn} onPress={openCreate}>
          <Text style={styles.addBtnText}>+ Add Task</Text>
        </TouchableOpacity>

        <FlatList
          data={dailyTasks}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.empty}>No tasks for this day.</Text>
          }
          renderItem={({ item }) => (
            
              <TouchableOpacity
                style={styles.taskRow}
                onPress={() => openDetail(item)}
              >

              <TouchableOpacity onPress={() => openDetail(item)} style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <View style={[styles.colorDot, { backgroundColor: item.color }]} />
              </TouchableOpacity>

              <Text style={[
                styles.taskText,
                item.status === 'complete' && styles.taskTextDone,
                item.status === 'skipped'  && styles.taskTextDone,
              ]}>
                {item.title}
              </Text>

              {item.status === 'in_progress' ? (
                <>
                  <TouchableOpacity onPress={() => completeTask(item.id)} style={styles.action}>
                    <Text style={styles.complete}>✓</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => delayTask(item.id)} style={styles.action}>
                    <Text style={styles.delay}>↷</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => skipTask(item.id)} style={styles.action}>
                    <Text style={styles.skip}>✕</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <Text style={styles.statusLabel}>
                  {item.status}
                </Text>
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
          onUpdate={(updated) => {
            console.log('Updated:', updated);
          }}
          onComplete={(id) => completeTask(id)}
          onDelay={(id) => delayTask(id)}
          onSkip={(id) => skipTask(id)}
          onDelete={(id) => {
            console.log('Delete:', id);
          }}
        />
      </CalendarProvider>
  );
}

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

  // highlight selected
  if (selectedDate) {
    marks[selectedDate] = {
      ...(marks[selectedDate] || {}),
      selected: true,
      selectedColor: '#DDD',
    };
  }

  return marks;
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  toggleRow: {
    flexDirection: 'row',
    margin: 12,
    backgroundColor: '#F1EFE8',
    borderRadius: 10,
    padding: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 2,
      },
      android: { elevation: 2 },
    }),
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#888780',
  },
  tabTextActive: {
    color: '#2C2C2A',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  list: {
  padding: 12,
},

taskRow: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: 10,
  borderBottomWidth: 1,
  borderColor: '#eee',
},

colorDot: {
  width: 10,
  height: 10,
  borderRadius: 5,
  marginRight: 10,
},

taskText: {
  flex: 1,
  fontSize: 16,
},

complete: {
  fontSize: 18,
  color: 'green',
},
taskTextSkipped: {
  textDecorationLine: 'line-through',
  color: '#B4B2A9',
  opacity: 0.6,
},
action:      { paddingHorizontal: 6 },
delay:       { fontSize: 18, color: '#B8860B' },
skip:        { fontSize: 18, color: '#CC3333' },
taskTextDone: { textDecorationLine: 'line-through', color: '#B4B2A9' },
statusLabel: { fontSize: 11, color: '#888780', fontStyle: 'italic' },
empty:       { padding: 16, color: '#999', fontStyle: 'italic', textAlign: 'center' },
addBtn: {
  margin: 12,
  paddingVertical: 12,
  borderRadius: 10,
  backgroundColor: '#534AB7',
  alignItems: 'center',
},

addBtnText: {
  color: '#fff',
  fontSize: 14,
  fontWeight: '600',
},
});