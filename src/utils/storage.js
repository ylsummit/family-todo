import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { v4 as uuidv4 } from 'uuid';

// 配置通知
Notifications.setNotificationHandler({
  handleNotificationReceived: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// 数据结构
export const defaultFamilyMembers = [
  { id: '1', name: '爸爸', role: 'parent', color: '#4A90D9' },
  { id: '2', name: '妈妈', role: 'parent', color: '#E94560' },
  { id: '3', name: '孩子', role: 'child', color: '#0FBCF9' },
];

// 存储键
const STORAGE_KEYS = {
  TASKS: '@family_todo_tasks',
  MEMBERS: '@family_todo_members',
  CURRENT_USER: '@family_todo_current_user',
};

// 任务管理
export async function loadTasks() {
  try {
    const tasks = await AsyncStorage.getItem(STORAGE_KEYS.TASKS);
    return tasks ? JSON.parse(tasks) : [];
  } catch (error) {
    console.error('加载任务失败:', error);
    return [];
  }
}

export async function saveTask(task) {
  try {
    const tasks = await loadTasks();
    const newTask = {
      id: uuidv4(),
      title: '',
      description: '',
      memberId: '1',
      reminderTime: null,
      completed: false,
      recurring: 'none', // none, daily, weekly
      createdAt: new Date().toISOString(),
      ...task,
    };
    tasks.push(newTask);
    await AsyncStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    
    // 设置提醒
    if (newTask.reminderTime) {
      await scheduleReminder(newTask);
    }
    
    return newTask;
  } catch (error) {
    console.error('保存任务失败:', error);
    return null;
  }
}

export async function updateTask(updatedTask) {
  try {
    const tasks = await loadTasks();
    const index = tasks.findIndex(t => t.id === updatedTask.id);
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...updatedTask };
      await AsyncStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
      
      // 重新设置提醒
      if (updatedTask.reminderTime) {
        await scheduleReminder(updatedTask);
      }
      
      return tasks[index];
    }
    return null;
  } catch (error) {
    console.error('更新任务失败:', error);
    return null;
  }
}

export async function deleteTask(taskId) {
  try {
    const tasks = await loadTasks();
    const filtered = tasks.filter(t => t.id !== taskId);
    await AsyncStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('删除任务失败:', error);
    return false;
  }
}

export async function toggleTaskComplete(taskId) {
  try {
    const tasks = await loadTasks();
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      task.completed = !task.completed;
      task.completedAt = task.completed ? new Date().toISOString() : null;
      await AsyncStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
      return task;
    }
    return null;
  } catch (error) {
    console.error('切换任务状态失败:', error);
    return null;
  }
}

// 家庭成员管理
export async function loadMembers() {
  try {
    const members = await AsyncStorage.getItem(STORAGE_KEYS.MEMBERS);
    return members ? JSON.parse(members) : defaultFamilyMembers;
  } catch (error) {
    console.error('加载成员失败:', error);
    return defaultFamilyMembers;
  }
}

export async function saveMembers(members) {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
    return true;
  } catch (error) {
    console.error('保存成员失败:', error);
    return false;
  }
}

export async function getCurrentUser() {
  try {
    const user = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return user ? JSON.parse(user) : defaultFamilyMembers[0];
  } catch (error) {
    console.error('加载当前用户失败:', error);
    return defaultFamilyMembers[0];
  }
}

export async function setCurrentUser(user) {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    return true;
  } catch (error) {
    console.error('设置当前用户失败:', error);
    return false;
  }
}

// 通知提醒
export async function scheduleReminder(task) {
  try {
    if (!task.reminderTime) return;
    
    const trigger = new Date(task.reminderTime);
    if (trigger > new Date()) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '⏰ 待办提醒',
          body: task.title,
          data: { taskId: task.id },
        },
        trigger,
      });
    }
  } catch (error) {
    console.error('设置提醒失败:', error);
  }
}

export async function requestNotificationPermission() {
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('请求通知权限失败:', error);
    return false;
  }
}

// 获取今日任务
export function getTodayTasks(tasks) {
  const today = new Date().toDateString();
  return tasks.filter(task => {
    if (task.completed) return false;
    if (!task.reminderTime) return false;
    return new Date(task.reminderTime).toDateString() === today;
  });
}

// 获取统计信息
export function getStats(tasks) {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
  return { total, completed, rate };
}
