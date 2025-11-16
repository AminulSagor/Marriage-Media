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

interface BodyTypeTwoProps {
  navigation: any;
}

const BodyTypeTwo: React.FC<BodyTypeTwoProps> = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const {data, update} = useSignupFlow();
  const [religion, setReligion] = useState('');
  const [sect, setSect] = useState('');
  const [prayer, setPrayer] = useState('');
  const [dressCode, setDressCode] = useState('');
  const [diet, setDiet] = useState('');
  console.log(data);
  const goNext = () => {
    update({
      religion: religion || undefined,
      religion_section: sect || undefined,
      prayer_frequency: prayer || undefined,
      dress_code: dressCode || undefined,
      dietary_preference: diet || undefined,
    });
    navigation.navigate('BodyTypeThree');
  };

  const handleSkip = () => {
    navigation.navigate('BodyTypeThree');
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

      {/* Sidebar Image */}
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
              paddingBottom: (insets.bottom || 16) + 90, // room for fixed button
            }}>
            <Text style={styles.sectionTitle}>Religious Identity</Text>

            {/* Religion */}
            <View style={styles.pickerContainer}>
              <Picker
                mode="dropdown"
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
                mode="dropdown"
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
                mode="dropdown"
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
                mode="dropdown"
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
                mode="dropdown"
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
          </ScrollView>
        </View>
      </View>

      {/* Fixed Confirm Button */}
      <TouchableOpacity
        onPress={goNext}
        style={[styles.confirmButton, {bottom: (insets.bottom || 16) + 16}]}>
        <Text style={styles.confirmText}>Confirm</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default BodyTypeTwo;

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
  skipText: {color: '#FF4081', fontWeight: 'bold'},
  bodyRow: {flex: 1, flexDirection: 'row'},
  sidebarImage: {
    width: '100%',
    resizeMode: 'contain',
    height: 80,
    alignSelf: 'center',
  },
  contentWrapper: {flex: 1, paddingHorizontal: 16},
  scrollContent: {},
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
  picker: {color: '#333', flex: 1},
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
  confirmText: {color: '#fff', fontWeight: 'bold', fontSize: 16},
});
