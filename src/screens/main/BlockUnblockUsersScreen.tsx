import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const BlockUnblockUsersScreen = ({navigation}) => {
  const [blockedUsers, setBlockedUsers] = useState([
    {id: '1', name: 'Ahmed Khan'},
    {id: '2', name: 'Sara Ali'},
  ]);

  const unblockUser = id => {
    setBlockedUsers(prev => prev.filter(user => user.id !== id));
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Block / Unblock Users</Text>
      </View>

      <FlatList
        data={blockedUsers}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={styles.userRow}>
            <Text style={styles.userName}>{item.name}</Text>
            <TouchableOpacity
              style={styles.unblockBtn}
              onPress={() => unblockUser(item.id)}>
              <Text style={{color: '#fff'}}>Unblock</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{textAlign: 'center', marginTop: 20}}>
            No blocked users
          </Text>
        }
      />
    </View>
  );
};

export default BlockUnblockUsersScreen;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff', paddingTop: 40},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  headerTitle: {fontSize: 18, fontWeight: '600', marginLeft: 10},
  userRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
  userName: {fontSize: 16},
  unblockBtn: {
    backgroundColor: '#f00',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
});
