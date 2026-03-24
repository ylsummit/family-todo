import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { updateTask, deleteTask } from '../utils/storage';

export default function TaskDetailScreen({ route, navigation }) {
  const { task } = route.params;
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');

  async function handleSave() {
    const updated = await updateTask({
      ...task,
      title,
      description,
    });
    if (updated) {
      setEditing(false);
      navigation.setParams({ task: updated });
    }
  }

  async function handleDelete() {
    const success = await deleteTask(task.id);
    if (success) {
      navigation.goBack();
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        {editing ? (
          <>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="任务标题"
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="任务描述"
              multiline
            />
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  setEditing(false);
                  setTitle(task.title);
                  setDescription(task.description || '');
                }}
              >
                <Text style={styles.cancelButtonText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleSave}
              >
                <Text style={styles.saveButtonText}>保存</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.title}>{task.title}</Text>
            {task.description ? (
              <Text style={styles.description}>{task.description}</Text>
            ) : null}
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>状态:</Text>
              <Text style={styles.infoValue}>
                {task.completed ? '✅ 已完成' : '⏳ 未完成'}
              </Text>
            </View>

            {task.reminderTime && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>提醒时间:</Text>
                <Text style={styles.infoValue}>
                  {new Date(task.reminderTime).toLocaleString('zh-CN')}
                </Text>
              </View>
            )}

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>创建时间:</Text>
              <Text style={styles.infoValue}>
                {new Date(task.createdAt).toLocaleString('zh-CN')}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setEditing(true)}
            >
              <Text style={styles.editButtonText}>✏️ 编辑</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDelete}
            >
              <Text style={styles.deleteButtonText}>🗑️ 删除</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  card: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 14,
    color: '#999',
    width: 80,
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
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
    height: 100,
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
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
  editButton: {
    backgroundColor: '#4A90D9',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: '#E94560',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
