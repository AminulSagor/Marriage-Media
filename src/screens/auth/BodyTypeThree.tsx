import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Picker} from '@react-native-picker/picker';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {useSignupFlow} from '../../context/SignupFlowContext';

interface BodyTypeThreeProps {
  navigation: any;
}

const BodyTypeThree: React.FC<BodyTypeThreeProps> = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const {data, update} = useSignupFlow();

  const [maritalStatus, setMaritalStatus] = useState('');
  const [duration, setDuration] = useState('');
  const [haveChildren, setHaveChildren] = useState<'Yes' | 'No' | null>(null);
  const [wantChildren, setWantChildren] = useState<'Yes' | 'No' | null>(null);
  console.log(data);
  const mapDurationToNumber = (value: string): number | undefined => {
    switch (value) {
      case '1_month':
        return 1;
      case '3_months':
        return 3;
      case '6_months':
        return 6;
      case '1_year':
        return 12;
      default:
        return undefined;
    }
  };

  const handleSkip = () => {
    navigation.navigate('BodyTypeFour');
  };

  const handleNext = () => {
    update({
      marital_status: maritalStatus || undefined,
      marital_duration: mapDurationToNumber(duration),
      have_child:
        haveChildren == null ? undefined : haveChildren === 'Yes' ? 1 : 0,
      want_child:
        wantChildren == null ? undefined : wantChildren === 'Yes' ? 1 : 0,
    });

    navigation.navigate('BodyTypeFour');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          Add more details to attract the right matches
        </Text>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Top Image */}
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
              paddingBottom: (insets.bottom || 16) + 90, // space for fixed Confirm
            }}>
            <Text style={styles.sectionTitle}>Marital History</Text>

            {/* Marital Status */}
            <View style={styles.pickerContainer}>
              <Picker
                mode="dropdown"
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

            {/* Duration */}
            <View style={styles.pickerContainer}>
              <Picker
                mode="dropdown"
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

            {/* Have Children */}
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

            {/* Want Children */}
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
          </ScrollView>
        </View>
      </View>

      {/* Fixed Confirm Button */}
      <TouchableOpacity
        onPress={handleNext}
        style={[styles.confirmButton, {bottom: (insets.bottom || 16) + 16}]}>
        <Text style={styles.confirmText}>Confirm</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default BodyTypeThree;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 6,
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#000',
  },
  sectionLabel: {
    marginTop: 20,
    marginBottom: 8,
    fontSize: 14,
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
  picker: {
    color: '#333',
    flex: 1,
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
    borderColor: '#FF4081',
    backgroundColor: '#FFE6F0',
  },
  buttonText: {
    fontSize: 16,
    color: '#333',
  },
  selectedText: {
    fontSize: 16,
    color: '#FF4081',
    fontWeight: 'bold',
  },
  confirmButton: {
    position: 'absolute',
    left: 16,
    right: 16,
    backgroundColor: '#FF4081',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 5,
  },
  confirmText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
