import React, {useMemo, useState} from 'react';
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
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Picker} from '@react-native-picker/picker';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {RouteProp, useRoute} from '@react-navigation/native';
import {
  updateProfile,
  UpdateProfilePayload,
  UserProfile,
} from '../../api/profile';

type RouteParams = {
  params: {profile: UserProfile};
};

const EditAppearanceScreen: React.FC<any> = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const route = useRoute<RouteProp<RouteParams, 'params'>>();
  const profile = route.params?.profile as UserProfile;

  // Prefill from profile (API stores cm/kg as numbers)
  const [bodyType, setBodyType] = useState(profile?.body_type ?? '');
  const [hairColor, setHairColor] = useState(profile?.hair_color ?? '');
  const [eyeColor, setEyeColor] = useState(profile?.eye_color ?? '');
  const [skinColor, setSkinColor] = useState(profile?.skin_color ?? '');

  const [heightUnit, setHeightUnit] = useState<'cm' | 'ft'>('cm');
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>('kg');

  const [heightValue, setHeightValue] = useState(
    profile?.height != null ? String(profile.height) : '',
  );
  const [weightValue, setWeightValue] = useState(
    profile?.weight != null ? String(profile.weight) : '',
  );

  const queryClient = useQueryClient();

  const {mutate: save, isPending} = useMutation({
    mutationFn: (payload: UpdateProfilePayload) => updateProfile(payload),
    onSuccess: () => {
      // refresh profile and go back
      queryClient.invalidateQueries({queryKey: ['profile']});
      navigation.goBack();
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to update profile.';
      Alert.alert('Update failed', msg);
    },
  });

  const onConfirm = () => {
    let height: number | undefined;
    let weight: number | undefined;

    const hv = parseFloat(heightValue);
    if (!Number.isNaN(hv))
      height = heightUnit === 'cm' ? hv : Math.round(hv * 30.48);

    const wv = parseFloat(weightValue);
    if (!Number.isNaN(wv))
      weight = weightUnit === 'kg' ? wv : Math.round(wv * 0.453592);

    const payload: UpdateProfilePayload = {
      body_type: bodyType || undefined,
      hair_color: hairColor || undefined,
      eye_color: eyeColor || undefined,
      skin_color: skinColor || undefined,
      height,
      weight,
    };

    save(payload);
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
          <Text style={styles.headerTitle}>Edit appearance</Text>
          {/* keep spacing symmetrical */}
          <View style={{width: 24}} />
        </View>

        {/* Top Graphic (optional, same as original) */}
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
                {paddingBottom: (insets.bottom || 16) + 90},
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

              {/* Hair */}
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

              {/* Eye */}
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

              {/* Skin */}
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

        {/* Confirm */}
        <TouchableOpacity
          onPress={onConfirm}
          disabled={isPending}
          style={[
            styles.confirmButton,
            {bottom: (insets.bottom || 16) + 16, opacity: isPending ? 0.8 : 1},
          ]}>
          {isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.confirmText}>Save</Text>
          )}
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EditAppearanceScreen;

const styles = StyleSheet.create({
  flex: {flex: 1},
  container: {flex: 1, backgroundColor: '#fff'},
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
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
    fontWeight: '600',
  },
  sidebarImage: {
    width: '100%',
    resizeMode: 'contain',
    height: 80,
    alignSelf: 'center',
  },
  bodyRow: {flex: 1, flexDirection: 'row'},
  contentWrapper: {flex: 1, paddingHorizontal: 16},
  scrollContent: {paddingTop: 4},
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#000',
  },
  sectionLabel: {marginTop: 20, marginBottom: 8, fontSize: 14, color: '#000'},
  row: {flexDirection: 'row', gap: 10},
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
  unitPicker: {flex: 1, color: '#000'},
  pickerContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginTop: 14,
    justifyContent: 'center',
  },
  picker: {flex: 1, color: '#333'},
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
