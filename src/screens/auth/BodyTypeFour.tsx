import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Platform,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/Ionicons';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {useSignupFlow} from '../../context/SignupFlowContext';

interface BodyTypeFourProps {
  navigation: any;
}

const BodyTypeFour: React.FC<BodyTypeFourProps> = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const {data, update} = useSignupFlow();

  const [ageEnd, setAgeEnd] = useState(28);
  const partnerAgeStart = 18;

  const [distance, setDistance] = useState(50);
  const [maritalStatus, setMaritalStatus] = useState('');
  const [religion, setReligion] = useState('');
  const [ethnicity, setEthnicity] = useState('');
  const [sect, setSect] = useState('');
  const [occupation, setOccupation] = useState('');
  const [education, setEducation] = useState('');
  console.log(data);
  const handleBack = () => navigation.goBack();

  const handleSkip = () => {
    navigation.navigate('PhotoUpload');
  };

  const handleConfirm = () => {
    update({
      partner_age_start: partnerAgeStart,
      partner_age_end: ageEnd,
      partner_distance_range: distance,
      // partner_marital_status: maritalStatus || undefined,
      partner_religion: religion || undefined,
      // partner_ethnicity: ethnicity || undefined,
      partner_religion_section: sect || undefined,
      partner_occupation: occupation || undefined,
      partner_education: education || undefined,
    });

    navigation.navigate('PhotoUpload');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Icon name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>

        <Text style={styles.headerTitle} numberOfLines={2} ellipsizeMode="tail">
          Add more details to attract the right matches
        </Text>

        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Top pill / icons image */}
      <Image
        source={require('../../assets/images/sideIcon1.png')}
        style={styles.sidebarImage}
      />

      {/* Content */}
      <View style={styles.bodyRow}>
        <View style={styles.contentWrapper}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: (insets.bottom || 16) + 90, // room for Confirm button
            }}>
            <Text style={styles.sectionTitle}>Partner Preferences</Text>

            {/* Partner marital status */}
            <View style={styles.pickerContainer}>
              <Picker
                mode="dropdown"
                selectedValue={maritalStatus}
                onValueChange={setMaritalStatus}
                dropdownIconColor="#999"
                style={styles.picker}>
                <Picker.Item label="Partner marital status" value="" />
                <Picker.Item label="Single" value="Single" />
                <Picker.Item label="Divorced" value="Divorced" />
                <Picker.Item label="Widowed" value="Widowed" />
              </Picker>
            </View>

            {/* Age range */}
            <View style={styles.pickerContainer}>
              <Text style={styles.label}>Age range</Text>
              <Slider
                value={ageEnd}
                onValueChange={setAgeEnd}
                minimumValue={partnerAgeStart}
                maximumValue={99}
                step={1}
                minimumTrackTintColor="#FF4081"
                maximumTrackTintColor="#eee"
                thumbTintColor="#FF4081"
              />
              <Text style={styles.rangeText}>
                {partnerAgeStart} - {ageEnd} years
              </Text>
            </View>

            {/* Distance range */}
            <View style={styles.pickerContainer}>
              <Text style={styles.label}>Distance range</Text>
              <Slider
                value={distance}
                onValueChange={setDistance}
                minimumValue={5}
                maximumValue={200}
                step={1}
                minimumTrackTintColor="#FF4081"
                maximumTrackTintColor="#eee"
                thumbTintColor="#FF4081"
              />
              <Text style={styles.rangeText}>{distance} km</Text>
            </View>

            {/* Partner religion */}
            <View style={styles.pickerContainer}>
              <Picker
                mode="dropdown"
                selectedValue={religion}
                onValueChange={setReligion}
                dropdownIconColor="#999"
                style={styles.picker}>
                <Picker.Item label="Partner religion" value="" />
                <Picker.Item label="Islam" value="Islam" />
                <Picker.Item label="Christianity" value="Christianity" />
                <Picker.Item label="Hinduism" value="Hinduism" />
                <Picker.Item label="Other" value="Other" />
              </Picker>
            </View>

            {/* Partner ethnicity */}
            <View style={styles.pickerContainer}>
              <Picker
                mode="dropdown"
                selectedValue={ethnicity}
                onValueChange={setEthnicity}
                dropdownIconColor="#999"
                style={styles.picker}>
                <Picker.Item label="Partner ethnicity" value="" />
                <Picker.Item label="Asian" value="Asian" />
                <Picker.Item label="Arab" value="Arab" />
                <Picker.Item label="African" value="African" />
                <Picker.Item label="European" value="European" />
                <Picker.Item label="Other" value="Other" />
              </Picker>
            </View>

            {/* Partner sect */}
            <View style={styles.pickerContainer}>
              <Picker
                mode="dropdown"
                selectedValue={sect}
                onValueChange={setSect}
                dropdownIconColor="#999"
                style={styles.picker}>
                <Picker.Item label="Partner sect" value="" />
                <Picker.Item label="Sunni" value="Sunni" />
                <Picker.Item label="Shia" value="Shia" />
                <Picker.Item label="Other" value="Other" />
              </Picker>
            </View>

            {/* Partner occupation */}
            <View style={styles.pickerContainer}>
              <Picker
                mode="dropdown"
                selectedValue={occupation}
                onValueChange={setOccupation}
                dropdownIconColor="#999"
                style={styles.picker}>
                <Picker.Item label="Partner occupation" value="" />
                <Picker.Item label="Engineer" value="Engineer" />
                <Picker.Item label="Doctor" value="Doctor" />
                <Picker.Item label="Teacher" value="Teacher" />
                <Picker.Item label="Business" value="Business" />
                <Picker.Item label="Other" value="Other" />
              </Picker>
            </View>

            {/* Partner education */}
            <View style={styles.pickerContainer}>
              <Picker
                mode="dropdown"
                selectedValue={education}
                onValueChange={setEducation}
                dropdownIconColor="#999"
                style={styles.picker}>
                <Picker.Item label="Partner education level" value="" />
                <Picker.Item label="High School" value="High School" />
                <Picker.Item label="Bachelor's" value="Bachelor" />
                <Picker.Item label="Master's" value="Master" />
                <Picker.Item label="PhD" value="PhD" />
              </Picker>
            </View>
          </ScrollView>
        </View>
      </View>

      {/* Fixed confirm button */}
      <TouchableOpacity
        onPress={handleConfirm}
        style={[styles.confirmButton, {bottom: (insets.bottom || 16) + 16}]}>
        <Text style={styles.confirmText}>Confirm</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default BodyTypeFour;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingBottom: 6,
  },
  headerTitle: {
    flex: 1,
    marginHorizontal: 10,
    fontSize: 13,
    color: '#000',
    textAlign: 'center',
    fontWeight: '500',
  },
  skipText: {
    color: '#FF4081',
    fontWeight: 'bold',
  },
  sidebarImage: {
    width: '100%',
    resizeMode: 'contain',
    height: 80,
    alignSelf: 'center',
  },
  bodyRow: {
    flex: 1,
    flexDirection: 'row',
  },
  contentWrapper: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingTop: 4,
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
    marginBottom: 6,
  },
  pickerContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 12,
    paddingHorizontal: 8,
    paddingTop: Platform.OS === 'ios' ? 6 : 0,
  },
  picker: {
    color: '#333',
    height: 56,
  },
  rangeText: {
    textAlign: 'center',
    color: '#FF4081',
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 4,
  },
  confirmButton: {
    position: 'absolute',
    left: 16,
    right: 16,
    backgroundColor: '#FF4081',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 4,
  },
  confirmText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
