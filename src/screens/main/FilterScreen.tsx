// FilterScreen.js
import React, {useState, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Modal,
  FlatList,
  TextInput,
  Dimensions,
  Platform,
} from 'react-native';
import Slider from '@react-native-community/slider';
import Ionicons from 'react-native-vector-icons/Ionicons';

const {width, height} = Dimensions.get('window');

/**
 * Reusable modal for dropdown-like selection
 */
const DropdownModal = ({
  visible,
  title,
  options = [],
  selected,
  onSelect,
  onClose,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalBox}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={22} color="#333" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={options}
            keyExtractor={(item, i) => `${item}-${i}`}
            keyboardShouldPersistTaps="handled"
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => {
                  onSelect(item);
                  onClose();
                }}>
                <Text style={styles.modalOptionText}>{item}</Text>
                {selected === item && (
                  <Ionicons name="checkmark" size={18} color="#f1499d" />
                )}
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={styles.modalSep} />}
          />
        </View>
      </View>
    </Modal>
  );
};

const DEFAULTS = {
  gender: 'Female',
  ageMin: 18,
  ageMax: 99,
  distance: 1,
  country: 'Any',
  city: 'Any',
  maritalStatus: 'Any',
  religion: 'Any',
  ethnicity: 'Any',
  sect: 'Any',
  occupation: 'Any',
  education: 'Any',
  bodyType: 'Any',
  height: '',
  heightUnit: 'cm',
  weight: '',
  weightUnit: 'kg',
  hair: 'Any',
  eye: 'Any',
  skin: 'Any',
};

const FilterScreen = ({navigation, route}) => {
  const [activeTab, setActiveTab] = useState('Basic');

  // Basic
  const [gender, setGender] = useState(DEFAULTS.gender);
  const [ageMin, setAgeMin] = useState(DEFAULTS.ageMin);
  const [ageMax, setAgeMax] = useState(DEFAULTS.ageMax);
  const [distance, setDistance] = useState(DEFAULTS.distance);

  // Advanced selections
  const [country, setCountry] = useState(DEFAULTS.country);
  const [city, setCity] = useState(DEFAULTS.city);
  const [maritalStatus, setMaritalStatus] = useState(DEFAULTS.maritalStatus);
  const [religion, setReligion] = useState(DEFAULTS.religion);
  const [ethnicity, setEthnicity] = useState(DEFAULTS.ethnicity);
  const [sect, setSect] = useState(DEFAULTS.sect);
  const [occupation, setOccupation] = useState(DEFAULTS.occupation);
  const [education, setEducation] = useState(DEFAULTS.education);
  const [bodyType, setBodyType] = useState(DEFAULTS.bodyType);

  const [height, setHeight] = useState(DEFAULTS.height);
  const [heightUnit, setHeightUnit] = useState(DEFAULTS.heightUnit);
  const [weight, setWeight] = useState(DEFAULTS.weight);
  const [weightUnit, setWeightUnit] = useState(DEFAULTS.weightUnit);

  const [hair, setHair] = useState(DEFAULTS.hair);
  const [eye, setEye] = useState(DEFAULTS.eye);
  const [skin, setSkin] = useState(DEFAULTS.skin);

  // modal control
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: '',
    options: [],
    valueKey: null,
  });

  // sample options (replace with your real lists)
  const options = useMemo(
    () => ({
      countries: [
        'Any',
        'Italy',
        'France',
        'Germany',
        'United Kingdom',
        'Pakistan',
        'USA',
      ],
      cities: [
        'Any',
        'Rome',
        'Paris',
        'Berlin',
        'London',
        'Lahore',
        'New York',
      ],
      marital: ['Any', 'Single', 'Divorced', 'Widowed'],
      religions: [
        'Any',
        'Islam',
        'Christianity',
        'Hinduism',
        'Buddhism',
        'Other',
      ],
      ethnicities: ['Any', 'Asian', 'Caucasian', 'African', 'Latino', 'Other'],
      sects: ['Any', 'Sunni', 'Shia', 'Other'],
      occupations: [
        'Any',
        'Student',
        'Engineer',
        'Doctor',
        'Teacher',
        'Business',
        'Other',
      ],
      education: ['Any', 'High School', 'Bachelor', 'Master', 'PhD', 'Other'],
      bodyTypes: ['Any', 'Slim', 'Average', 'Athletic', 'Heavy'],
      hairColors: ['Any', 'Black', 'Brown', 'Blonde', 'Red', 'Other'],
      eyeColors: ['Any', 'Brown', 'Blue', 'Green', 'Other'],
      skinColors: ['Any', 'Light', 'Medium', 'Dark', 'Other'],
    }),
    [],
  );

  const openModal = (title, optionsList, valueKey) => {
    setModalConfig({title, options: optionsList, valueKey});
    setModalVisible(true);
  };

  const closeModal = () => setModalVisible(false);

  const handleModalSelect = value => {
    switch (modalConfig.valueKey) {
      case 'country':
        setCountry(value);
        break;
      case 'city':
        setCity(value);
        break;
      case 'marital':
        setMaritalStatus(value);
        break;
      case 'religion':
        setReligion(value);
        break;
      case 'ethnicity':
        setEthnicity(value);
        break;
      case 'sect':
        setSect(value);
        break;
      case 'occupation':
        setOccupation(value);
        break;
      case 'education':
        setEducation(value);
        break;
      case 'bodyType':
        setBodyType(value);
        break;
      case 'hair':
        setHair(value);
        break;
      case 'eye':
        setEye(value);
        break;
      case 'skin':
        setSkin(value);
        break;
      default:
        break;
    }
  };

  const onReset = () => {
    setGender(DEFAULTS.gender);
    setAgeMin(DEFAULTS.ageMin);
    setAgeMax(DEFAULTS.ageMax);
    setDistance(DEFAULTS.distance);
    setCountry(DEFAULTS.country);
    setCity(DEFAULTS.city);
    setMaritalStatus(DEFAULTS.maritalStatus);
    setReligion(DEFAULTS.religion);
    setEthnicity(DEFAULTS.ethnicity);
    setSect(DEFAULTS.sect);
    setOccupation(DEFAULTS.occupation);
    setEducation(DEFAULTS.education);
    setBodyType(DEFAULTS.bodyType);
    setHeight(DEFAULTS.height);
    setHeightUnit(DEFAULTS.heightUnit);
    setWeight(DEFAULTS.weight);
    setWeightUnit(DEFAULTS.weightUnit);
    setHair(DEFAULTS.hair);
    setEye(DEFAULTS.eye);
    setSkin(DEFAULTS.skin);
  };

  const onApply = () => {
    const filters = {
      gender,
      ageMin,
      ageMax,
      distance,
      country,
      city,
      maritalStatus,
      religion,
      ethnicity,
      sect,
      occupation,
      education,
      bodyType,
      height,
      heightUnit,
      weight,
      weightUnit,
      hair,
      eye,
      skin,
    };

    // If caller provided onApply callback (recommended), call it
    if (route?.params?.onApply && typeof route.params.onApply === 'function') {
      route.params.onApply(filters);
    }

    // always go back
    navigation.goBack();
  };

  // ensure min <= max
  const setSafeMin = value => {
    const v = Math.min(value, ageMax);
    setAgeMin(v);
  };
  const setSafeMax = value => {
    const v = Math.max(value, ageMin);
    setAgeMax(v);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top header */}
      <View style={styles.topArea}>
        <View style={styles.topRow}>
          <View style={styles.avatarBox}>
            <ImagePlaceholder />
          </View>
          <Text style={styles.title}>Filters</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="close" size={22} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabRow}>
          {['Basic', 'Advanced'].map(t => (
            <TouchableOpacity
              key={t}
              onPress={() => setActiveTab(t)}
              style={styles.tabButton}>
              <Text
                style={[
                  styles.tabText,
                  activeTab === t && styles.activeTabText,
                ]}>
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.content}>
        {activeTab === 'Basic' ? (
          <>
            {/* Gender selection */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Gender</Text>
              <View style={styles.genderRow}>
                <TouchableOpacity
                  style={[
                    styles.genderBox,
                    gender === 'Female' && styles.genderBoxActive,
                  ]}
                  onPress={() => setGender('Female')}>
                  <Text
                    style={[
                      styles.genderLabel,
                      gender === 'Female' && styles.genderLabelActive,
                    ]}>
                    Female
                  </Text>
                  <View
                    style={[
                      styles.radio,
                      gender === 'Female' && styles.radioActive,
                    ]}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.genderBox,
                    gender === 'Male' && styles.genderBoxActive,
                  ]}
                  onPress={() => setGender('Male')}>
                  <Text
                    style={[
                      styles.genderLabel,
                      gender === 'Male' && styles.genderLabelActive,
                    ]}>
                    Male
                  </Text>
                  <View
                    style={[
                      styles.radio,
                      gender === 'Male' && styles.radioActive,
                    ]}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Age range (two sliders stacked to simulate range) */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Age range</Text>
              <View style={styles.rangeBox}>
                <Text style={styles.rangeLabel}>From: {ageMin} years</Text>
                <Text style={[styles.rangeSelected]}>
                  {ageMin} - {ageMax} years
                </Text>
                <Text style={styles.rangeLabelRight}>To: {ageMax} yrs</Text>
              </View>

              <View style={{marginTop: 6}}>
                <Slider
                  minimumValue={18}
                  maximumValue={99}
                  step={1}
                  value={ageMin}
                  minimumTrackTintColor="#f1499d"
                  maximumTrackTintColor="#eee"
                  onValueChange={setSafeMin}
                />
                <Slider
                  minimumValue={18}
                  maximumValue={99}
                  step={1}
                  value={ageMax}
                  minimumTrackTintColor="#f1499d"
                  maximumTrackTintColor="#eee"
                  onValueChange={setSafeMax}
                />
              </View>
            </View>

            {/* Distance range */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Distance range</Text>
              <View style={styles.rangeBox}>
                <Text style={styles.rangeLabel}>1 km</Text>
                <Text style={[styles.rangeSelected]}>{distance} km</Text>
                <Text style={styles.rangeLabelRight}>20000 km</Text>
              </View>
              <Slider
                minimumValue={1}
                maximumValue={20000}
                step={1}
                value={distance}
                minimumTrackTintColor="#f1499d"
                maximumTrackTintColor="#eee"
                onValueChange={setDistance}
              />
            </View>
          </>
        ) : (
          <>
            {/* Advanced - list of dropdowns */}
            <View style={styles.cardList}>
              <TouchableOpacity
                style={styles.optionRow}
                onPress={() =>
                  openModal('Country', options.countries, 'country')
                }>
                <Text style={styles.optionText}>Country</Text>
                <View style={styles.optionRight}>
                  <Text style={styles.optionValue}>{country}</Text>
                  <Ionicons name="chevron-forward" size={18} color="#888" />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.optionRow}
                onPress={() => openModal('City', options.cities, 'city')}>
                <Text style={styles.optionText}>City</Text>
                <View style={styles.optionRight}>
                  <Text style={styles.optionValue}>{city}</Text>
                  <Ionicons name="chevron-forward" size={18} color="#888" />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.optionRow}
                onPress={() =>
                  openModal(
                    'Partner marital status',
                    options.marital,
                    'marital',
                  )
                }>
                <Text style={styles.optionText}>Partner marital status</Text>
                <View style={styles.optionRight}>
                  <Text style={styles.optionValue}>{maritalStatus}</Text>
                  <Ionicons name="chevron-forward" size={18} color="#888" />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.optionRow}
                onPress={() =>
                  openModal('Partner religion', options.religions, 'religion')
                }>
                <Text style={styles.optionText}>Partner religion</Text>
                <View style={styles.optionRight}>
                  <Text style={styles.optionValue}>{religion}</Text>
                  <Ionicons name="chevron-forward" size={18} color="#888" />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.optionRow}
                onPress={() =>
                  openModal(
                    'Partner Ethnicity',
                    options.ethnicities,
                    'ethnicity',
                  )
                }>
                <Text style={styles.optionText}>Partner Ethnicity</Text>
                <View style={styles.optionRight}>
                  <Text style={styles.optionValue}>{ethnicity}</Text>
                  <Ionicons name="chevron-forward" size={18} color="#888" />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.optionRow}
                onPress={() =>
                  openModal('Partner Sect', options.sects, 'sect')
                }>
                <Text style={styles.optionText}>Partner Sect</Text>
                <View style={styles.optionRight}>
                  <Text style={styles.optionValue}>{sect}</Text>
                  <Ionicons name="chevron-forward" size={18} color="#888" />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.optionRow}
                onPress={() =>
                  openModal(
                    'Partner occupation',
                    options.occupations,
                    'occupation',
                  )
                }>
                <Text style={styles.optionText}>Partner occupation</Text>
                <View style={styles.optionRight}>
                  <Text style={styles.optionValue}>{occupation}</Text>
                  <Ionicons name="chevron-forward" size={18} color="#888" />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.optionRow}
                onPress={() =>
                  openModal(
                    'Partner education level',
                    options.education,
                    'education',
                  )
                }>
                <Text style={styles.optionText}>Partner education level</Text>
                <View style={styles.optionRight}>
                  <Text style={styles.optionValue}>{education}</Text>
                  <Ionicons name="chevron-forward" size={18} color="#888" />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.optionRow}
                onPress={() =>
                  openModal(
                    'Select your Body type',
                    options.bodyTypes,
                    'bodyType',
                  )
                }>
                <Text style={styles.optionText}>Select your Body type</Text>
                <View style={styles.optionRight}>
                  <Text style={styles.optionValue}>{bodyType}</Text>
                  <Ionicons name="chevron-forward" size={18} color="#888" />
                </View>
              </TouchableOpacity>

              {/* Height */}
              <View style={[styles.optionRow, styles.inlineRow]}>
                <Text style={styles.optionText}>Select your height</Text>
                <View style={styles.inlineInputs}>
                  <TextInput
                    style={styles.smallInput}
                    placeholder="175"
                    value={height}
                    onChangeText={t => setHeight(t.replace(/[^0-9]/g, ''))}
                    keyboardType="numeric"
                  />
                  <TouchableOpacity
                    style={styles.unitBtn}
                    onPress={() =>
                      setHeightUnit(heightUnit === 'cm' ? 'ft' : 'cm')
                    }>
                    <Text style={styles.unitText}>{heightUnit}</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Weight */}
              <View style={[styles.optionRow, styles.inlineRow]}>
                <Text style={styles.optionText}>Select your weight</Text>
                <View style={styles.inlineInputs}>
                  <TextInput
                    style={styles.smallInput}
                    placeholder="70"
                    value={weight}
                    onChangeText={t => setWeight(t.replace(/[^0-9]/g, ''))}
                    keyboardType="numeric"
                  />
                  <TouchableOpacity
                    style={styles.unitBtn}
                    onPress={() =>
                      setWeightUnit(weightUnit === 'kg' ? 'lbs' : 'kg')
                    }>
                    <Text style={styles.unitText}>{weightUnit}</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                style={styles.optionRow}
                onPress={() =>
                  openModal(
                    'Select your Hair colour',
                    options.hairColors,
                    'hair',
                  )
                }>
                <Text style={styles.optionText}>Select your Hair colour</Text>
                <View style={styles.optionRight}>
                  <Text style={styles.optionValue}>{hair}</Text>
                  <Ionicons name="chevron-forward" size={18} color="#888" />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.optionRow}
                onPress={() =>
                  openModal('Select your Eye colour', options.eyeColors, 'eye')
                }>
                <Text style={styles.optionText}>Select your Eye colour</Text>
                <View style={styles.optionRight}>
                  <Text style={styles.optionValue}>{eye}</Text>
                  <Ionicons name="chevron-forward" size={18} color="#888" />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.optionRow}
                onPress={() =>
                  openModal(
                    'Select your Skin colour',
                    options.skinColors,
                    'skin',
                  )
                }>
                <Text style={styles.optionText}>Select your Skin colour</Text>
                <View style={styles.optionRight}>
                  <Text style={styles.optionValue}>{skin}</Text>
                  <Ionicons name="chevron-forward" size={18} color="#888" />
                </View>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.resetBtn} onPress={onReset}>
            <Text style={styles.resetText}>Reset</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.applyBtn} onPress={onApply}>
            <Text style={styles.applyText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Dropdown modal */}
      <DropdownModal
        visible={modalVisible}
        title={modalConfig.title}
        options={modalConfig.options}
        onSelect={handleModalSelect}
        selected={
          modalConfig.valueKey
            ? {
                country,
                city,
                marital: maritalStatus,
                religion,
                ethnicity,
                sect,
                occupation,
                education,
                bodyType,
                hair,
                eye,
                skin,
              }[modalConfig.valueKey]
            : null
        }
        onClose={closeModal}
      />
    </SafeAreaView>
  );
};

export default FilterScreen;

/* ---------- Small placeholder avatar component (keeps file single-file) ---------- */
const ImagePlaceholder = () => (
  <View
    style={{
      width: 44,
      height: 44,
      borderRadius: 44,
      backgroundColor: '#f6dce6',
      borderWidth: 2,
      borderColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
    <Ionicons name="person" size={22} color="#f1499d" />
  </View>
);

/* ---------------------------- Styles ---------------------------- */
const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  topArea: {
    backgroundColor: '#ffe9f3',
    paddingBottom: 8,
    paddingTop: Platform.OS === 'android' ? 20 : 8,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    justifyContent: 'space-between',
  },
  avatarBox: {width: 44, height: 44, borderRadius: 22, overflow: 'hidden'},
  title: {fontSize: 20, fontWeight: '700', color: '#f1499d'},
  tabRow: {
    flexDirection: 'row',
    marginTop: 12,
    paddingHorizontal: 18,
    alignItems: 'center',
  },
  tabButton: {marginRight: 18},
  tabText: {fontSize: 16, color: '#999'},
  activeTabText: {
    color: '#f1499d',
    fontWeight: '700',
    borderBottomWidth: 2,
    borderBottomColor: '#f1499d',
    paddingBottom: 6,
  },
  content: {padding: 16, paddingBottom: 120},

  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#f1d9e5',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTitle: {fontSize: 15, fontWeight: '700', color: '#333', marginBottom: 8},

  genderRow: {flexDirection: 'row', justifyContent: 'space-between'},
  genderBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginHorizontal: 6,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  genderBoxActive: {
    borderColor: '#f1499d',
    backgroundColor: '#fff0f6',
  },
  genderLabel: {fontSize: 16, color: '#888', fontWeight: '600'},
  genderLabelActive: {color: '#f1499d'},
  radio: {
    width: 20,
    height: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    marginLeft: 8,
  },
  radioActive: {backgroundColor: '#f1499d', borderColor: '#f1499d'},

  rangeBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  rangeLabel: {fontSize: 12, color: '#999'},
  rangeLabelRight: {fontSize: 12, color: '#999'},
  rangeSelected: {fontSize: 13, color: '#f1499d', fontWeight: '700'},

  cardList: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f1d9e5',
  },

  optionRow: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f4ebef',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionText: {fontSize: 15, color: '#333'},
  optionRight: {flexDirection: 'row', alignItems: 'center'},
  optionValue: {color: '#888', marginRight: 8},

  inlineRow: {alignItems: 'center'},
  inlineInputs: {flexDirection: 'row', alignItems: 'center'},
  smallInput: {
    width: 84,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    paddingHorizontal: 10,
    marginRight: 8,
    backgroundColor: '#fff',
  },
  unitBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
  unitText: {color: '#666'},

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  resetBtn: {
    flex: 1,
    marginRight: 8,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f1d9e5',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetText: {color: '#f1499d', fontWeight: '700'},
  applyBtn: {
    flex: 1,
    marginLeft: 8,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#f1499d',
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyText: {color: '#fff', fontWeight: '700'},

  /* Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  modalBox: {
    height: Math.min(520, height * 0.75),
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 20,
  },
  modalHeader: {
    padding: 16,
    paddingBottom: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f4ebef',
  },
  modalTitle: {fontSize: 16, fontWeight: '700', color: '#333'},
  modalOption: {
    padding: 14,
    paddingHorizontal: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalOptionText: {fontSize: 15, color: '#333'},
  modalSep: {height: 1, backgroundColor: '#f6eef2'},
});
