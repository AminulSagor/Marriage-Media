import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  ScrollView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Picker} from '@react-native-picker/picker';

const BodyTypeThree = ({navigation}) => {
  const [bodyType, setBodyType] = useState('');
  const [hairColor, setHairColor] = useState('');
  const [eyeColor, setEyeColor] = useState('');
  const [skinColor, setSkinColor] = useState('');
  const [heightValue, setHeightValue] = useState('');
  const [heightUnit, setHeightUnit] = useState('cm');
  const [weightValue, setWeightValue] = useState('');
  const [weightUnit, setWeightUnit] = useState('kg');
  const [haveChildren, setHaveChildren] = useState(null);
  const [wantChildren, setWantChildren] = useState(null);
  const [maritalStatus, setMaritalStatus] = useState('');
  const [duration, setDuration] = useState('');
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
      {/* Content Row */}
      <View style={styles.bodyRow}>
        {/* Sidebar Image */}

        {/* Main Content */}
        <View style={styles.contentWrapper}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}>
            <Text style={styles.sectionTitle}>Marital History</Text>
            {/* Marital Status Picker */}
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={maritalStatus}
                style={styles.picker}
                dropdownIconColor="#999"
                onValueChange={setMaritalStatus}>
                <Picker.Item label="Select your marital status" value="" />
                <Picker.Item label="Single" value="Single" />
                <Picker.Item label="Married" value="Married" />
                <Picker.Item label="Divorced" value="Divorced" />
                <Picker.Item label="Widowed" value="Widowed" />
              </Picker>
            </View>

            {/* Duration Picker */}
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={duration}
                style={styles.picker}
                dropdownIconColor="#999"
                onValueChange={setDuration}>
                <Picker.Item label="Select duration" value="" />
                <Picker.Item label="1 Month" value="1_month" />
                <Picker.Item label="3 Months" value="3_months" />
                <Picker.Item label="6 Months" value="6_months" />
                <Picker.Item label="1 Year" value="1_year" />
              </Picker>
            </View>

            <Text style={styles.sectionLabel}>Do you have children?</Text>
            <View style={styles.yesNoContainer}>
              <TouchableOpacity
                style={[
                  styles.yesNoButton,
                  haveChildren === 'No' && styles.selectedButton,
                ]}
                onPress={() => setHaveChildren('No')}>
                <Text
                  style={
                    haveChildren === 'No'
                      ? styles.selectedText
                      : styles.buttonText
                  }>
                  No
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.yesNoButton,
                  haveChildren === 'Yes' && styles.selectedButton,
                ]}
                onPress={() => setHaveChildren('Yes')}>
                <Text
                  style={
                    haveChildren === 'Yes'
                      ? styles.selectedText
                      : styles.buttonText
                  }>
                  Yes
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionLabel}>Do you want children?</Text>
            <View style={styles.yesNoContainer}>
              <TouchableOpacity
                style={[
                  styles.yesNoButton,
                  wantChildren === 'No' && styles.selectedButton,
                ]}
                onPress={() => setWantChildren('No')}>
                <Text
                  style={
                    wantChildren === 'No'
                      ? styles.selectedText
                      : styles.buttonText
                  }>
                  No
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.yesNoButton,
                  wantChildren === 'Yes' && styles.selectedButton,
                ]}
                onPress={() => setWantChildren('Yes')}>
                <Text
                  style={
                    wantChildren === 'Yes'
                      ? styles.selectedText
                      : styles.buttonText
                  }>
                  Yes
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => navigation?.navigate('BodyTypeFour')}
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
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
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
    paddingBottom: 0,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#000',
  },
  yesNoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 10,
  },
  yesNoButton: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  selectedButton: {
    borderColor: '#007AFF',
    backgroundColor: '#E6F0FF',
  },
  buttonText: {
    fontSize: 16,
    color: '#333',
  },
  selectedText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: 'bold',
  },

  sectionLabel: {
    marginTop: 20,
    marginBottom: 8,
    fontSize: 14,
    color: '#000',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  smallInput: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 14,
    color: '#000',
    height: 60,
  },
  pickerContainer1: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 12,
    marginTop: 20,
    justifyContent: 'center',
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
  picker: {
    color: '#333',
    fontSize: 14,
    flex: 1,
  },
  confirmButton: {
    backgroundColor: '#FF4081',
    paddingVertical: 14,
    marginTop: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    marginHorizontal: 4,
  },
  confirmText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default BodyTypeThree;
