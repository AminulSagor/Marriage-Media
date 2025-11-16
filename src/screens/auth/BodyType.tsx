import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Picker} from '@react-native-picker/picker';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {useSignupFlow} from '../../context/SignupFlowContext';

interface BodyTypeProps {
  navigation: any;
}

const BodyType: React.FC<BodyTypeProps> = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const {data, update} = useSignupFlow();

  const [bodyType, setBodyType] = useState('');
  const [hairColor, setHairColor] = useState('');
  const [eyeColor, setEyeColor] = useState('');
  const [skinColor, setSkinColor] = useState('');
  const [heightValue, setHeightValue] = useState('');
  const [heightUnit, setHeightUnit] = useState<'cm' | 'ft'>('cm');
  const [weightValue, setWeightValue] = useState('');
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>('kg');
  console.log(data);
  const goNext = () => {
    let height: number | undefined;
    let weight: number | undefined;

    const hv = parseFloat(heightValue);
    if (!Number.isNaN(hv)) {
      height = heightUnit === 'cm' ? hv : Math.round(hv * 30.48);
    }

    const wv = parseFloat(weightValue);
    if (!Number.isNaN(wv)) {
      weight = weightUnit === 'kg' ? wv : Math.round(wv * 0.453592);
    }
    update({
      body_type: bodyType || undefined,
      hair_color: hairColor || undefined,
      eye_color: eyeColor || undefined,
      skin_color: skinColor || undefined,
      height,
      weight,
    });
    navigation.navigate('BodyTypeTwo');
  };

  const handleSkip = () => {
    navigation.navigate('BodyTypeTwo');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}>
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

        {/* Top Graphic */}
        <Image
          source={require('../../assets/images/sideIcon1.png')}
          style={styles.sidebarImage}
        />

        {/* Content */}
        <View style={styles.bodyRow}>
          <View style={styles.contentWrapper}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={[
                styles.scrollContent,
                {paddingBottom: (insets.bottom || 16) + 90}, // space for button
              ]}>
              {/* Body Type */}
              <Text style={styles.sectionTitle}>Body Type</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  mode="dropdown"
                  selectedValue={bodyType}
                  style={styles.picker}
                  dropdownIconColor="#999"
                  onValueChange={setBodyType}>
                  <Picker.Item label="Select your body type" value="" />
                  <Picker.Item label="Slim" value="Slim" />
                  <Picker.Item label="Athletic" value="Athletic" />
                  <Picker.Item label="Average" value="Average" />
                  <Picker.Item label="Heavy" value="Heavy" />
                </Picker>
              </View>

              {/* Height */}
              <Text style={styles.sectionLabel}>Select your height</Text>
              <View style={styles.row}>
                <TextInput
                  style={styles.smallInput}
                  placeholder="175"
                  keyboardType="numeric"
                  value={heightValue}
                  onChangeText={setHeightValue}
                  placeholderTextColor="grey"
                />
                <View style={[styles.smallInput, {paddingHorizontal: 0}]}>
                  <Picker
                    mode="dropdown"
                    selectedValue={heightUnit}
                    style={styles.unitPicker}
                    dropdownIconColor="#999"
                    onValueChange={val => setHeightUnit(val as 'cm' | 'ft')}>
                    <Picker.Item label="cm" value="cm" />
                    <Picker.Item label="ft" value="ft" />
                  </Picker>
                </View>
              </View>

              {/* Weight */}
              <Text style={styles.sectionLabel}>Select your weight</Text>
              <View style={styles.row}>
                <TextInput
                  style={styles.smallInput}
                  placeholder="70"
                  keyboardType="numeric"
                  value={weightValue}
                  onChangeText={setWeightValue}
                  placeholderTextColor="grey"
                />
                <View style={[styles.smallInput, {paddingHorizontal: 0}]}>
                  <Picker
                    mode="dropdown"
                    selectedValue={weightUnit}
                    style={styles.unitPicker}
                    dropdownIconColor="#999"
                    onValueChange={val => setWeightUnit(val as 'kg' | 'lbs')}>
                    <Picker.Item label="kg" value="kg" />
                    <Picker.Item label="lbs" value="lbs" />
                  </Picker>
                </View>
              </View>

              {/* Hair Color */}
              <View style={styles.pickerContainer}>
                <Picker
                  mode="dropdown"
                  selectedValue={hairColor}
                  style={styles.picker}
                  dropdownIconColor="#999"
                  onValueChange={setHairColor}>
                  <Picker.Item label="Select your hair colour" value="" />
                  <Picker.Item label="Black" value="Black" />
                  <Picker.Item label="Brown" value="Brown" />
                  <Picker.Item label="Blonde" value="Blonde" />
                  <Picker.Item label="Other" value="Other" />
                </Picker>
              </View>

              {/* Eye Color */}
              <View style={styles.pickerContainer}>
                <Picker
                  mode="dropdown"
                  selectedValue={eyeColor}
                  style={styles.picker}
                  dropdownIconColor="#999"
                  onValueChange={setEyeColor}>
                  <Picker.Item label="Select your eye colour" value="" />
                  <Picker.Item label="Black" value="Black" />
                  <Picker.Item label="Brown" value="Brown" />
                  <Picker.Item label="Blue" value="Blue" />
                  <Picker.Item label="Green" value="Green" />
                </Picker>
              </View>

              {/* Skin Color */}
              <View style={styles.pickerContainer}>
                <Picker
                  mode="dropdown"
                  selectedValue={skinColor}
                  style={styles.picker}
                  dropdownIconColor="#999"
                  onValueChange={setSkinColor}>
                  <Picker.Item label="Select your skin colour" value="" />
                  <Picker.Item label="Fair" value="Fair" />
                  <Picker.Item label="Medium" value="Medium" />
                  <Picker.Item label="Dark" value="Dark" />
                </Picker>
              </View>
            </ScrollView>
          </View>
        </View>

        {/* Confirm pinned to bottom, stays above keyboard */}
        <TouchableOpacity
          onPress={goNext}
          style={[styles.confirmButton, {bottom: (insets.bottom || 16) + 16}]}>
          <Text style={styles.confirmText}>Confirm</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default BodyType;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingBottom: 8,
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
  scrollContent: {
    paddingTop: 4,
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
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  smallInput: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 14,
    color: '#000',
    height: 56,
    justifyContent: 'center',
  },
  unitPicker: {
    flex: 1,
    color: '#000',
  },
  pickerContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginTop: 14,
    justifyContent: 'center',
  },
  picker: {
    flex: 1,
    color: '#333',
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
