import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const ProfileVisitedScreen = ({navigation}) => {
  const visitedProfiles = [
    {id: '1', name: 'Ayesha Malik', date: 'Sep 20, 2025'},
    {id: '2', name: 'Bilal Ahmed', date: 'Sep 19, 2025'},
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile I Visited</Text>
      </View>

      <FlatList
        data={visitedProfiles}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={styles.profileRow}>
            <Text style={styles.userName}>{item.name}</Text>
            <Text style={styles.date}>{item.date}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{textAlign: 'center', marginTop: 20}}>
            You haven’t visited any profiles yet
          </Text>
        }
      />
    </View>
  );
};

export default ProfileVisitedScreen;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff', paddingTop: 40},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  headerTitle: {fontSize: 18, fontWeight: '600', marginLeft: 10},
  profileRow: {
    padding: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
  userName: {fontSize: 16, fontWeight: '500'},
  date: {fontSize: 12, color: '#888'},
});
