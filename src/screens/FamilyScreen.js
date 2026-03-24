import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import { loadMembers, saveMembers, setCurrentUser, getCurrentUser } from '../utils/storage';

export default function FamilyScreen({ navigation }) {
  const [members, setMembers] = useState([]);
  const [currentUser, setCurrentUserState] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const [loadedMembers, user] = await Promise.all([
      loadMembers(),
      getCurrentUser(),
    ]);
    setMembers(loadedMembers);
    setCurrentUserState(user);
  }

  async function handleAddMember() {
    if (!newMemberName.trim()) return;

    const colors = ['#4A90D9', '#E94560', '#0FBCF9', '#FFC300', '#22A6B3'];
    const newMember = {
      id: String(Date.now()),
      name: newMemberName,
      role: 'member',
      color: colors[members.length % colors.length],
    };

    const updatedMembers = [...members, newMember];
    await saveMembers(updatedMembers);
    setMembers(updatedMembers);
    setNewMemberName('');
    setModalVisible(false);
  }

  async function handleSwitchUser(member) {
    await setCurrentUser(member);
    setCurrentUserState(member);
  }

  const renderMember = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.memberCard,
        currentUser?.id === item.id && styles.memberCardActive,
      ]}
      onPress={() => handleSwitchUser(item)}
    >
      <View style={[styles.avatar, { backgroundColor: item.color }]}>
        <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
      </View>
      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>{item.name}</Text>
        <Text style={styles.memberRole}>
          {item.role === 'parent' ? '家长' : '成员'}
        </Text>
      </View>
      {currentUser?.id === item.id && (
        <View style={styles.activeBadge}>
          <Text style={styles.activeBadgeText}>当前</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>家庭成员</Text>
        <Text style={styles.headerSubtitle}>
          当前用户：{currentUser?.name || '-'}
        </Text>
      </View>

      <FlatList
        data={members}
        renderItem={renderMember}
        keyExtractor={item => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+ 添加成员</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>添加家庭成员</Text>
            
            <TextInput
              style={styles.input}
              placeholder="成员称呼（如：爷爷、奶奶）"
              value={newMemberName}
              onChangeText={setNewMemberName}
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
                onPress={handleAddMember}
              >
                <Text style={styles.saveButtonText}>添加</Text>
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
  header: {
    backgroundColor: '#4A90D9',
    padding: 20,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
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
  memberCardActive: {
    borderWidth: 2,
    borderColor: '#4A90D9',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  memberRole: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
  activeBadge: {
    backgroundColor: '#4A90D9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  activeBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#4A90D9',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 28,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
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
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
