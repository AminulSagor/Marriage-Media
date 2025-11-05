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
import {Navigation} from 'lucide-react-native';

const BodyType = ({navigation}) => {
  const [bodyType, setBodyType] = useState('');
  const [hairColor, setHairColor] = useState('');
  const [eyeColor, setEyeColor] = useState('');
  const [skinColor, setSkinColor] = useState('');
  const [heightValue, setHeightValue] = useState('');
  const [heightUnit, setHeightUnit] = useState('cm');
  const [weightValue, setWeightValue] = useState('');
  const [weightUnit, setWeightUnit] = useState('kg');

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
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}>
            <Text style={styles.sectionTitle}>Body Type</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={bodyType}
                style={styles.picker}
                dropdownIconColor="#999"
                onValueChange={setBodyType}>
                <Picker.Item label="Select your Body type" value="" />
                <Picker.Item label="Slim" value="Slim" />
                <Picker.Item label="Athletic" value="Athletic" />
                <Picker.Item label="Average" value="Average" />
                <Picker.Item label="Heavy" value="Heavy" />
              </Picker>
            </View>

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
                  selectedValue={heightUnit}
                  style={{flex: 1, color: 'black'}}
                  dropdownIconColor="#999"
                  onValueChange={setHeightUnit}>
                  <Picker.Item label="cm" value="cm" />
                  <Picker.Item label="ft" value="ft" />
                </Picker>
              </View>
            </View>

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
                  selectedValue={weightUnit}
                  style={{flex: 1}}
                  dropdownIconColor="#999"
                  onValueChange={setWeightUnit}>
                  <Picker.Item label="kg" value="kg" />
                  <Picker.Item label="lbs" value="lbs" />
                </Picker>
              </View>
            </View>

            <View style={styles.pickerContainer1}>
              <Picker
                selectedValue={hairColor}
                style={styles.picker}
                dropdownIconColor="#999"
                onValueChange={setHairColor}>
                <Picker.Item label="Select your Hair colour" value="" />
                <Picker.Item label="Black" value="Black" />
                <Picker.Item label="Brown" value="Brown" />
                <Picker.Item label="Blonde" value="Blonde" />
                <Picker.Item label="Other" value="Other" />
              </Picker>
            </View>

            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={eyeColor}
                style={styles.picker}
                dropdownIconColor="#999"
                onValueChange={setEyeColor}>
                <Picker.Item label="Select your Eye colour" value="" />
                <Picker.Item label="Black" value="Black" />
                <Picker.Item label="Brown" value="Brown" />
                <Picker.Item label="Blue" value="Blue" />
                <Picker.Item label="Green" value="Green" />
              </Picker>
            </View>

            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={skinColor}
                style={styles.picker}
                dropdownIconColor="#999"
                onValueChange={setSkinColor}>
                <Picker.Item label="Select your Skin colour" value="" />
                <Picker.Item label="Fair" value="Fair" />
                <Picker.Item label="Medium" value="Medium" />
                <Picker.Item label="Dark" value="Dark" />
              </Picker>
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate('BodyTypeTwo')}
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

export default BodyType;
