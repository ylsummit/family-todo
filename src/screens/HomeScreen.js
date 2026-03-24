import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  Switch,
  Platform,
} from 'react-native';
import { loadTasks, saveTask, toggleTaskComplete, deleteTask, getTodayTasks, getStats, loadMembers, getCurrentUser } from '../utils/storage';
import TaskItem from '../components/TaskItem';

export default function HomeScreen({ navigation }) {
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [selectedMember, setSelectedMember] = useState('1');
  const [reminderTime, setReminderTime] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const [loadedTasks, loadedMembers, user] = await Promise.all([
      loadTasks(),
      loadMembers(),
      getCurrentUser(),
    ]);
    setTasks(loadedTasks);
    setMembers(loadedMembers);
    setCurrentUser(user);
  }

  async function handleAddTask() {
    if (!newTaskTitle.trim()) return;

    const newTask = {
      title: newTaskTitle,
      description: newTaskDesc,
      memberId: selectedMember,
      reminderTime: reminderTime ? new Date(reminderTime).toISOString() : null,
    };

    const saved = await saveTask(newTask);
    if (saved) {
      setTasks([...tasks, saved]);
      setNewTaskTitle('');
      setNewTaskDesc('');
      setReminderTime('');
      setModalVisible(false);
    }
  }

  async function handleToggleComplete(taskId) {
    const updated = await toggleTaskComplete(taskId);
    if (updated) {
      setTasks(tasks.map(t => t.id === taskId ? updated : t));
    }
  }

  async function handleDeleteTask(taskId) {
    const success = await deleteTask(taskId);
    if (success) {
      setTasks(tasks.filter(t => t.id !== taskId));
    }
  }

  const todayTasks = getTodayTasks(tasks);
  const stats = getStats(tasks);

  const renderTask = ({ item }) => (
    <TaskItem
      task={item}
      members={members}
      onToggle={() => handleToggleComplete(item.id)}
      onDelete={() => handleDeleteTask(item.id)}
      onPress={() => navigation.navigate('TaskDetail', { task: item })}
    />
  );

  return (
    <View style={styles.container}>
      {/* 统计卡片 */}
      <View style={styles.statsCard}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats.total}</Text>
          <Text style={styles.statLabel}>总任务</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats.completed}</Text>
          <Text style={styles.statLabel}>已完成</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats.rate}%</Text>
          <Text style={styles.statLabel}>完成率</Text>
        </View>
      </View>

      {/* 今日任务 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📅 今日任务 ({todayTasks.length})</Text>
      </View>

      {/* 任务列表 */}
      <FlatList
        data={tasks}
        renderItem={renderTask}
        keyExtractor={item => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
      />

      {/* 添加按钮 */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      {/* 添加任务弹窗 */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>新建任务</Text>
            
            <TextInput
              style={styles.input}
              placeholder="任务标题"
              value={newTaskTitle}
              onChangeText={setNewTaskTitle}
              placeholderTextColor="#999"
            />
            
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="任务描述（可选）"
              value={newTaskDesc}
              onChangeText={setNewTaskDesc}
              multiline
              placeholderTextColor="#999"
            />

            <Text style={styles.label}>分配给:</Text>
            <View style={styles.memberSelector}>
              {members.map(member => (
                <TouchableOpacity
                  key={member.id}
                  style={[
                    styles.memberChip,
                    selectedMember === member.id && styles.memberChipSelected,
                    { borderColor: member.color }
                  ]}
                  onPress={() => setSelectedMember(member.id)}
                >
                  <Text style={styles.memberChipText}>{member.name}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>提醒时间:</Text>
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD HH:MM"
              value={reminderTime}
              onChangeText={setReminderTime}
              placeholderTextColor="#999"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleAddTask}
              >
                <Text style={styles.saveButtonText}>保存</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#4A90D9',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 12,
    color: '#fff',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4A90D9',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  addButtonText: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '85%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  memberSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  memberChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    marginRight: 8,
    marginBottom: 8,
  },
  memberChipSelected: {
    backgroundColor: '#4A90D9',
  },
  memberChipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#4A90D9',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
