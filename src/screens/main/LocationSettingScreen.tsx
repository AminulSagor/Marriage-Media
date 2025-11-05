import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Switch} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const LocationSettingScreen = ({navigation}) => {
  const [locationAccess, setLocationAccess] = useState(true);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Location Settings</Text>
      </View>

      <View style={styles.optionRow}>
        <Text style={styles.optionText}>Allow Location Access</Text>
        <Switch value={locationAccess} onValueChange={setLocationAccess} />
      </View>

      <Text style={styles.note}>
        Enabling location access helps us show better matches near you.
      </Text>
    </View>
  );
};

export default LocationSettingScreen;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff', paddingTop: 40},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  headerTitle: {fontSize: 18, fontWeight: '600', marginLeft: 10},
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
  optionText: {fontSize: 16, fontWeight: '500'},
  note: {
    padding: 16,
    fontSize: 14,
    color: '#555',
  },
});
