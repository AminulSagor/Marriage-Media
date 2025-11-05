import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  Platform,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/Ionicons';

const BodyTypeFour = ({navigation}) => {
  const [age, setAge] = useState(41);
  const [distance, setDistance] = useState(50);
  const [maritalStatus, setMaritalStatus] = useState('');
  const [religion, setReligion] = useState('');
  const [ethnicity, setEthnicity] = useState('');
  const [sect, setSect] = useState('');
  const [occupation, setOccupation] = useState('');
  const [education, setEducation] = useState('');

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
      <Image
        source={require('../../assets/images/sideIcon1.png')}
        style={styles.sidebarImage}
      />
      {/* Body Row with Sidebar */}
      <View style={styles.bodyRow}>
        <View style={styles.contentWrapper}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}>
            <Text style={styles.sectionTitle}>Partner Preferences</Text>

            {/* Partner Marital Status */}
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={maritalStatus}
                style={styles.picker}
                dropdownIconColor="#999"
                onValueChange={setMaritalStatus}>
                <Picker.Item label="partner marital status" value="" />
                <Picker.Item label="Single" value="Single" />
                <Picker.Item label="Divorced" value="Divorced" />
                <Picker.Item label="Widowed" value="Widowed" />
              </Picker>
            </View>

            {/* Age Range */}
            <View style={styles.pickerContainer}>
              <Text style={styles.label}>Age range</Text>
              <Slider
                value={age}
                onValueChange={value => setAge(value)}
                minimumValue={18}
                maximumValue={60}
                step={1}
                minimumTrackTintColor="#FF4081"
                maximumTrackTintColor="#eee"
                thumbTintColor="#FF4081"
              />
              <Text style={styles.rangeText}>36 - {age} years</Text>
            </View>

            {/* Distance Range */}
            <View style={styles.pickerContainer}>
              <Text style={styles.label}>Distance range</Text>
              <Slider
                value={distance}
                onValueChange={value => setDistance(value)}
                minimumValue={5}
                maximumValue={200}
                step={1}
                minimumTrackTintColor="#FF4081"
                maximumTrackTintColor="#eee"
                thumbTintColor="#FF4081"
              />
              <Text style={styles.rangeText}>{distance} km</Text>
            </View>

            {/* Partner Religion */}
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={religion}
                style={styles.picker}
                dropdownIconColor="#999"
                onValueChange={setReligion}>
                <Picker.Item label="partner religion" value="" />
                <Picker.Item label="Islam" value="Islam" />
                <Picker.Item label="Christianity" value="Christianity" />
                <Picker.Item label="Hinduism" value="Hinduism" />
              </Picker>
            </View>

            {/* Partner Ethnicity */}
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={ethnicity}
                style={styles.picker}
                dropdownIconColor="#999"
                onValueChange={setEthnicity}>
                <Picker.Item label="partner Ethnicity" value="" />
                <Picker.Item label="Asian" value="Asian" />
                <Picker.Item label="Arab" value="Arab" />
                <Picker.Item label="African" value="African" />
              </Picker>
            </View>

            {/* Partner Sect */}
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={sect}
                style={styles.picker}
                dropdownIconColor="#999"
                onValueChange={setSect}>
                <Picker.Item label="partner Sect" value="" />
                <Picker.Item label="Sunni" value="Sunni" />
                <Picker.Item label="Shia" value="Shia" />
              </Picker>
            </View>

            {/* Partner Occupation */}
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={occupation}
                style={styles.picker}
                dropdownIconColor="#999"
                onValueChange={setOccupation}>
                <Picker.Item label="partner occupation" value="" />
                <Picker.Item label="Engineer" value="Engineer" />
                <Picker.Item label="Doctor" value="Doctor" />
                <Picker.Item label="Teacher" value="Teacher" />
              </Picker>
            </View>

            {/* Partner Education */}
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={education}
                style={styles.picker}
                dropdownIconColor="#999"
                onValueChange={setEducation}>
                <Picker.Item label="partner education level" value="" />
                <Picker.Item label="High School" value="High School" />
                <Picker.Item label="Bachelor's" value="Bachelor" />
                <Picker.Item label="Master's" value="Master" />
              </Picker>
            </View>

            {/* Confirm Button */}
            <TouchableOpacity
              onPress={() => navigation?.navigate('PhotoUpload')}
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
  },
  headerTitle: {
    flex: 1,
    marginHorizontal: 10,
    fontSize: 14,
    color: '#000',
    textAlign: 'center',
    fontWeight: '500',
  },
  skipText: {
    color: '#FF4081',
    fontWeight: 'bold',
  },
  bodyRow: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebarImage: {
    width: '100%',
    resizeMode: 'contain',
    height: 80,
    alignSelf: 'center',
  },
  contentWrapper: {
    flex: 1,
    padding: 16,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#000',
  },
  label: {
    fontSize: 14,
    color: '#000',
    marginBottom: 10,
  },
  pickerContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 12,
    paddingHorizontal: 10,
    paddingTop: Platform.OS === 'ios' ? 10 : 0,
  },
  picker: {
    color: '#333',
    fontSize: 14,
    height: 50,
  },
  rangeText: {
    textAlign: 'center',
    color: '#FF4081',
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 4,
  },
  confirmButton: {
    backgroundColor: '#FF4081',
    paddingVertical: 14,
    marginTop: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  confirmText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default BodyTypeFour;
