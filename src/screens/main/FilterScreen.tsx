// src/screens/FilterScreen.tsx
import React, {useEffect, useMemo, useState} from 'react';
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
import {
  useFilterStore,
  DEFAULT_FILTERS,
  FilterValues,
} from '../../state/filterStore';
import {fetchCountries, fetchCitiesByCountry} from '../../api/country';

const {width, height} = Dimensions.get('window');

const DropdownModal = ({
  visible,
  title,
  options = [],
  selected,
  onSelect,
  onClose,
}: {
  visible: boolean;
  title: string;
  options: string[];
  selected?: string;
  onSelect: (v: string) => void;
  onClose: () => void;
}) => (
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

const FilterScreen = ({navigation}: any) => {
  const {filters: initial, replace, reset} = useFilterStore();

  const [activeTab, setActiveTab] = useState<'Basic' | 'Advanced'>('Basic');

  // Basic
  const [gender, setGender] = useState<FilterValues['gender']>(
    initial.gender ?? DEFAULT_FILTERS.gender,
  );
  const [ageMin, setAgeMin] = useState<number>(
    initial.ageMin ?? DEFAULT_FILTERS.ageMin,
  );
  const [ageMax, setAgeMax] = useState<number>(
    initial.ageMax ?? DEFAULT_FILTERS.ageMax,
  );
  const [distance, setDistance] = useState<number>(
    initial.distance ?? DEFAULT_FILTERS.distance,
  );

  // Advanced
  const [country, setCountry] = useState<string>(
    initial.country ?? DEFAULT_FILTERS.country,
  );
  const [city, setCity] = useState<string>(
    initial.city ?? DEFAULT_FILTERS.city,
  );
  const [maritalStatus, setMaritalStatus] = useState<string>(
    initial.maritalStatus ?? DEFAULT_FILTERS.maritalStatus,
  );
  const [religion, setReligion] = useState<string>(
    initial.religion ?? DEFAULT_FILTERS.religion,
  );
  const [ethnicity, setEthnicity] = useState<string>(
    initial.ethnicity ?? DEFAULT_FILTERS.ethnicity,
  );
  const [sect, setSect] = useState<string>(
    initial.sect ?? DEFAULT_FILTERS.sect,
  );
  const [occupation, setOccupation] = useState<string>(
    initial.occupation ?? DEFAULT_FILTERS.occupation,
  );
  const [education, setEducation] = useState<string>(
    initial.education ?? DEFAULT_FILTERS.education,
  );
  const [bodyType, setBodyType] = useState<string>(
    initial.bodyType ?? DEFAULT_FILTERS.bodyType,
  );

  const [height, setHeight] = useState<string>(
    String(initial.height ?? DEFAULT_FILTERS.height),
  );
  const [heightUnit, setHeightUnit] = useState<'cm' | 'ft'>(
    initial.heightUnit ?? DEFAULT_FILTERS.heightUnit,
  );
  const [weight, setWeight] = useState<string>(
    String(initial.weight ?? DEFAULT_FILTERS.weight),
  );
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>(
    initial.weightUnit ?? DEFAULT_FILTERS.weightUnit,
  );

  const [hair, setHair] = useState<string>(
    initial.hair ?? DEFAULT_FILTERS.hair,
  );
  const [eye, setEye] = useState<string>(initial.eye ?? DEFAULT_FILTERS.eye);
  const [skin, setSkin] = useState<string>(
    initial.skin ?? DEFAULT_FILTERS.skin,
  );

  // Dynamic country/city options
  const [countryOptions, setCountryOptions] = useState<string[]>(['Any']);
  const [cityOptions, setCityOptions] = useState<string[]>(['Any']);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: '',
    options: [] as string[],
    valueKey: '',
  });

  const staticOptions = useMemo(
    () => ({
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

  // helpers
  const uniq = (arr: string[]) => Array.from(new Set(arr.filter(Boolean)));

  const loadCountries = async (): Promise<string[]> => {
    try {
      const list = await fetchCountries();
      const opts = ['Any', ...uniq(list)];
      setCountryOptions(opts);
      return opts;
    } catch {
      const fallback = ['Any'];
      setCountryOptions(fallback);
      return fallback;
    }
  };

  const loadCitiesForCountry = async (c: string): Promise<string[]> => {
    if (!c || c.toLowerCase() === 'any') {
      const opts = ['Any'];
      setCityOptions(opts);
      return opts;
    }
    try {
      const cities = await fetchCitiesByCountry(c);
      const names = cities.map(x => x.city_name);
      const opts = ['Any', ...uniq(names)];
      setCityOptions(opts);
      return opts;
    } catch {
      const fallback = ['Any'];
      setCityOptions(fallback);
      return fallback;
    }
  };

  useEffect(() => {
    // prefetch countries so the modal opens with data
    void loadCountries();
  }, []);

  // NEW: open static modal helper (fixes the TS void truthiness error)
  const openStaticModal = (
    title: string,
    options: string[],
    valueKey: string,
  ) => {
    setModalConfig({title, options, valueKey});
    setModalVisible(true);
  };

  const openModal = async (title: string, valueKey: string) => {
    if (valueKey === 'country') {
      const opts =
        countryOptions.length > 1 ? countryOptions : await loadCountries();
      setModalConfig({title, options: opts, valueKey});
      setModalVisible(true);
      return;
    }
    if (valueKey === 'city') {
      const opts = await loadCitiesForCountry(country);
      setModalConfig({title, options: opts, valueKey});
      setModalVisible(true);
      return;
    }
  };

  const closeModal = () => setModalVisible(false);

  const handleModalSelect = (value: string) => {
    switch (modalConfig.valueKey) {
      case 'country': {
        if (value !== country) {
          setCountry(value);
          // reset city when country changes
          setCity('Any');
        }
        break;
      }
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
    }
  };

  const setSafeMin = (v: number) => setAgeMin(Math.min(v, ageMax));
  const setSafeMax = (v: number) => setAgeMax(Math.max(v, ageMin));

  const onReset = () => {
    reset();
    navigation.goBack();
  };

  const onApply = () => {
    const next: FilterValues = {
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
    replace(next);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top header */}
      <View style={styles.topArea}>
        <View style={styles.topRow}>
          <View style={styles.avatarBox}>
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
          </View>
          <Text style={styles.title}>Filters</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="close" size={22} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabRow}>
          {(['Basic', 'Advanced'] as const).map(t => (
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
            {/* Gender */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Gender</Text>
              <View style={styles.genderRow}>
                {(['Female', 'Male', 'Any'] as const).map(g => (
                  <TouchableOpacity
                    key={g}
                    style={[
                      styles.genderBox,
                      gender === g && styles.genderBoxActive,
                    ]}
                    onPress={() => setGender(g)}>
                    <Text
                      style={[
                        styles.genderLabel,
                        gender === g && styles.genderLabelActive,
                      ]}>
                      {g}
                    </Text>
                    <View
                      style={[styles.radio, gender === g && styles.radioActive]}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Age range */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Age range</Text>
              <View style={styles.rangeBox}>
                <Text style={styles.rangeLabel}>From: {ageMin} years</Text>
                <Text style={styles.rangeSelected}>
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

            {/* Distance */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Distance range</Text>
              <View style={styles.rangeBox}>
                <Text style={styles.rangeLabel}>1 km</Text>
                <Text style={styles.rangeSelected}>{distance} km</Text>
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
            {/* Advanced */}
            <View style={styles.cardList}>
              <Row
                label="Country"
                value={country}
                onPress={() => openModal('Country', 'country')}
              />
              <Row
                label="City"
                value={city}
                onPress={() => openModal('City', 'city')}
              />
              <Row
                label="Partner marital status"
                value={maritalStatus}
                onPress={() =>
                  openStaticModal(
                    'Partner marital status',
                    staticOptions.marital,
                    'marital',
                  )
                }
              />
              <Row
                label="Partner religion"
                value={religion}
                onPress={() =>
                  openStaticModal(
                    'Partner religion',
                    staticOptions.religions,
                    'religion',
                  )
                }
              />
              <Row
                label="Partner Ethnicity"
                value={ethnicity}
                onPress={() =>
                  openStaticModal(
                    'Partner Ethnicity',
                    staticOptions.ethnicities,
                    'ethnicity',
                  )
                }
              />
              <Row
                label="Partner Sect"
                value={sect}
                onPress={() =>
                  openStaticModal('Partner Sect', staticOptions.sects, 'sect')
                }
              />
              <Row
                label="Partner occupation"
                value={occupation}
                onPress={() =>
                  openStaticModal(
                    'Partner occupation',
                    staticOptions.occupations,
                    'occupation',
                  )
                }
              />
              <Row
                label="Partner education level"
                value={education}
                onPress={() =>
                  openStaticModal(
                    'Partner education level',
                    staticOptions.education,
                    'education',
                  )
                }
              />
              <Row
                label="Select your Body type"
                value={bodyType}
                onPress={() =>
                  openStaticModal(
                    'Select your Body type',
                    staticOptions.bodyTypes,
                    'bodyType',
                  )
                }
              />

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

              <Row
                label="Select your Hair colour"
                value={hair}
                onPress={() =>
                  openStaticModal(
                    'Select your Hair colour',
                    staticOptions.hairColors,
                    'hair',
                  )
                }
              />
              <Row
                label="Select your Eye colour"
                value={eye}
                onPress={() =>
                  openStaticModal(
                    'Select your Eye colour',
                    staticOptions.eyeColors,
                    'eye',
                  )
                }
              />
              <Row
                label="Select your Skin colour"
                value={skin}
                onPress={() =>
                  openStaticModal(
                    'Select your Skin colour',
                    staticOptions.skinColors,
                    'skin',
                  )
                }
              />
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
        options={
          modalConfig.valueKey === 'country'
            ? countryOptions
            : modalConfig.valueKey === 'city'
            ? cityOptions
            : modalConfig.options
        }
        onSelect={handleModalSelect}
        selected={
          {
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
          }[modalConfig.valueKey] as string
        }
        onClose={closeModal}
      />
    </SafeAreaView>
  );
};

export default FilterScreen;

/* Row helper */
const Row = ({
  label,
  value,
  onPress,
}: {
  label: string;
  value: string;
  onPress: () => void;
}) => (
  <TouchableOpacity style={styles.optionRow} onPress={onPress}>
    <Text style={styles.optionText}>{label}</Text>
    <View style={styles.optionRight}>
      <Text style={styles.optionValue}>{value}</Text>
      <Ionicons name="chevron-forward" size={18} color="#888" />
    </View>
  </TouchableOpacity>
);

/* Styles unchanged from your base (trimmed for brevity) */
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
  genderBoxActive: {borderColor: '#f1499d', backgroundColor: '#fff0f6'},
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
