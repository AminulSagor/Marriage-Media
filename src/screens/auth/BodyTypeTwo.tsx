import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Picker} from '@react-native-picker/picker';

const BodyTypeTwo = ({navigation}) => {
  // Separate states for each dropdown
  const [religion, setReligion] = useState('');
  const [sect, setSect] = useState('');
  const [prayer, setPrayer] = useState('');
  const [dressCode, setDressCode] = useState('');
  const [diet, setDiet] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Icon name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          Add more details to attract the right matches
        </Text>
        <TouchableOpacity>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Sidebar Image */}
      <Image
        source={require('../../assets/images/sideIcon1.png')}
        style={styles.sidebarImage}
      />

      {/* Content Row */}
      <View style={styles.bodyRow}>
        <View style={styles.contentWrapper}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}>
            <Text style={styles.sectionTitle}>Religious Identity</Text>

            {/* Religion */}
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={religion}
                style={styles.picker}
                dropdownIconColor="#999"
                onValueChange={setReligion}>
                <Picker.Item label="Select your religion" value="" />
                <Picker.Item label="Islam" value="Islam" />
                <Picker.Item label="Christianity" value="Christianity" />
                <Picker.Item label="Hinduism" value="Hinduism" />
                <Picker.Item label="Buddhism" value="Buddhism" />
                <Picker.Item label="Judaism" value="Judaism" />
                <Picker.Item label="Other" value="Other" />
              </Picker>
            </View>

            {/* Sect */}
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={sect}
                style={styles.picker}
                dropdownIconColor="#999"
                onValueChange={setSect}>
                <Picker.Item label="Select your sect" value="" />
                <Picker.Item label="Sunni" value="Sunni" />
                <Picker.Item label="Shia" value="Shia" />
                <Picker.Item label="Orthodox" value="Orthodox" />
                <Picker.Item label="Protestant" value="Protestant" />
                <Picker.Item label="Catholic" value="Catholic" />
                <Picker.Item label="Other" value="Other" />
              </Picker>
            </View>

            {/* Prayer Frequency */}
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={prayer}
                style={styles.picker}
                dropdownIconColor="#999"
                onValueChange={setPrayer}>
                <Picker.Item label="Select prayer frequency" value="" />
                <Picker.Item label="5 times daily" value="5 times daily" />
                <Picker.Item label="Often" value="Often" />
                <Picker.Item label="Sometimes" value="Sometimes" />
                <Picker.Item label="Occasionally" value="Occasionally" />
                <Picker.Item label="Rarely" value="Rarely" />
                <Picker.Item label="Never" value="Never" />
              </Picker>
            </View>

            {/* Dress Code */}
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={dressCode}
                style={styles.picker}
                dropdownIconColor="#999"
                onValueChange={setDressCode}>
                <Picker.Item label="Select your dress code" value="" />
                <Picker.Item label="Modern/Western" value="Modern/Western" />
                <Picker.Item label="Traditional" value="Traditional" />
                <Picker.Item label="Mixed" value="Mixed" />
                <Picker.Item label="Conservative" value="Conservative" />
              </Picker>
            </View>

            {/* Diet */}
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={diet}
                style={styles.picker}
                dropdownIconColor="#999"
                onValueChange={setDiet}>
                <Picker.Item label="Select your dietary preference" value="" />
                <Picker.Item label="Halal" value="Halal" />
                <Picker.Item label="Vegetarian" value="Vegetarian" />
                <Picker.Item label="Vegan" value="Vegan" />
                <Picker.Item label="Pescatarian" value="Pescatarian" />
                <Picker.Item label="Non-Vegetarian" value="Non-Vegetarian" />
                <Picker.Item label="Kosher" value="Kosher" />
              </Picker>
            </View>

            <TouchableOpacity
              onPress={() =>
                navigation?.navigate('BodyTypeThree', {
                  religion,
                  sect,
                  prayer,
                  dressCode,
                  diet,
                })
              }
              style={styles.confirmButton}>
              <Text style={styles.confirmText}>Confirm</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#fff',
  },
  headerTitle: {
    flex: 1,
    marginHorizontal: 10,
    fontSize: 14,
    color: '#000',
    textAlign: 'center',
    fontWeight: '500',
  },
  skipText: {color: '#FF4081', fontWeight: 'bold'},
  bodyRow: {flex: 1, flexDirection: 'row'},
  sidebarImage: {
    width: '100%',
    resizeMode: 'contain',
    height: 80,
    alignSelf: 'center',
  },
  contentWrapper: {flex: 1, padding: 16, paddingBottom: 0},
  scrollContent: {paddingBottom: 20},
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#000',
  },
  pickerContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 12,
    marginTop: 10,
    justifyContent: 'center',
  },
  picker: {color: '#333', fontSize: 14, flex: 1},
  confirmButton: {
    backgroundColor: '#FF4081',
    paddingVertical: 14,
    marginTop: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    marginHorizontal: 4,
  },
  confirmText: {color: '#fff', fontWeight: 'bold', fontSize: 16},
});

export default BodyTypeTwo;
