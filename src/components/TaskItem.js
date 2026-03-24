import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Swipeable,
} from 'react-native';

export default function TaskItem({ task, members, onToggle, onDelete, onPress }) {
  const member = members.find(m => m.id === task.memberId) || members[0];

  const renderRightActions = () => (
    <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
      <Text style={styles.deleteButtonText}>删除</Text>
    </TouchableOpacity>
  );

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
        <TouchableOpacity onPress={onToggle} style={styles.checkbox}>
          <View style={[styles.checkboxInner, task.completed && styles.checkboxChecked]}>
            {task.completed && <Text style={styles.checkmark}>✓</Text>}
          </View>
        </TouchableOpacity>
        
        <View style={styles.content}>
          <Text style={[styles.title, task.completed && styles.titleCompleted]}>
            {task.title}
          </Text>
          {task.description ? (
            <Text style={styles.description} numberOfLines={2}>
              {task.description}
            </Text>
          ) : null}
          <View style={styles.meta}>
            <View style={[styles.memberBadge, { backgroundColor: member.color }]}>
              <Text style={styles.memberBadgeText}>{member.name}</Text>
            </View>
            {task.reminderTime && (
              <Text style={styles.time}>
                ⏰ {new Date(task.reminderTime).toLocaleString('zh-CN', {
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  checkbox: {
    marginRight: 12,
    justifyContent: 'center',
  },
  checkboxInner: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4A90D9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#4A90D9',
  },
  checkmark: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  memberBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  time: {
    fontSize: 12,
    color: '#999',
  },
  deleteButton: {
    backgroundColor: '#E94560',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    borderRadius: 12,
    marginLeft: 8,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
