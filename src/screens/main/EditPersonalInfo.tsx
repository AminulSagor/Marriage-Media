// EditPersonalInfo.tsx
import React, {useEffect, useMemo, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  ScrollView,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Picker} from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {fetchCountries, fetchCitiesByCountry} from '../../api/country';
import {updateProfile} from '../../api/profile';

const CAST = [
  'Tajik',
  'Pashtun',
  'Uzbek',
  'Hazara',
  'Turkman',
  'Baloch',
  'Sayed',
  'Sadat',
  'Khalil',
  'Durrani',
  'Ghilzai',
  'Shinwari',
  'Mohmand',
  'Afridi',
  'Khattak',
  'Wazir',
  'Mehsud',
  'Kakar',
  'Mandal',
  'Bangash',
  'Qureshi',
  'Ansari',
  'Mughal',
  'Sheikh',
  'Rajput',
  'Jatt',
  'Awan',
  'Gujjar',
  'Kashmiri',
  'Arain',
  'Brahui',
  'Pathan',
  'Punjabi',
  'Sindhi',
  'Saraiki',
  'Hindko',
  'Other',
];
const SCHOOL = [
  'Primary School',
  'Middle School',
  'High School / Secondary School',
  'Intermediate / Higher Secondary',
  'Diploma / Vocational Training',
  'Associate Degree',
  'Bachelor’s Degree',
  'Master’s Degree',
  'MPhil',
  'PhD / Doctorate',
  'Postdoctoral',
  'Other',
];
const INDUSTRIES = [
  'Healthcare',
  'Technology',
  'Education',
  'Business',
  'Finance',
  'Engineering',
  'Arts & Design',
  'Media & Communication',
  'Science & Research',
  'Law & Legal Services',
  'Government & Public Administration',
  'Agriculture & Farming',
  'Hospitality & Tourism',
  'Transportation & Logistics',
  'Construction & Real Estate',
  'Energy & Utilities',
  'Manufacturing',
  'Retail & Sales',
  'Non-Profit & NGOs',
  'Other',
];

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

type SectionKey =
  | 'gender'
  | 'name'
  | 'dob'
  | 'country'
  | 'city'
  | 'ethnicity'
  | 'education'
  | 'profession'
  | 'religion'
  | 'marital'
  | 'partner'
  | null;

interface EditPersonalInfoProps {
  navigation: any;
  route: {params?: {profile?: any; openSection?: Exclude<SectionKey, null>}};
}

const mapMonthsToKey = (n?: number | null): string => {
  if (n === 1) return '1_month';
  if (n === 3) return '3_months';
  if (n === 6) return '6_months';
  if (n === 12) return '1_year';
  return '';
};
const mapKeyToMonths = (key: string): number | undefined => {
  switch (key) {
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

const EditPersonalInfo: React.FC<EditPersonalInfoProps> = ({
  navigation,
  route,
}) => {
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const passedProfile = route?.params?.profile;
  const initiallyOpen = route?.params?.openSection ?? null;

  // Accordion
  const [activeSection, setActiveSection] = useState<SectionKey>(initiallyOpen);
  const toggleSection = (key: Exclude<SectionKey, null>) =>
    setActiveSection(curr => (curr === key ? null : key));
  const isOpen = (key: Exclude<SectionKey, null>) => activeSection === key;

  // Gender
  const [gender, setGender] = useState<'Male' | 'Female' | ''>(
    passedProfile?.gender === 'Male' || passedProfile?.gender === 'Female'
      ? passedProfile.gender
      : '',
  );

  // Full name
  const [fullName, setFullName] = useState<string>(passedProfile?.name ?? '');

  // DOB (defaults if not present)
  const initialDobParts = (() => {
    const dob: string | undefined = passedProfile?.dob;
    if (!dob) return null;
    // expect YYYY-MM-DD
    const [y, m, d] = dob.split('-').map(Number);
    if (!y || !m || !d) return null;
    return {y, m: m - 1, d};
  })();
  const [selectedYear, setSelectedYear] = useState<number>(
    initialDobParts?.y ?? 1995,
  );
  const [selectedMonth, setSelectedMonth] = useState<number>(
    initialDobParts?.m ?? 5,
  ); // 0-index
  const [selectedDate, setSelectedDate] = useState<number>(
    initialDobParts?.d ?? 4,
  );
  const [showYearModal, setShowYearModal] = useState(false);

  const daysInMonth = useMemo(
    () => new Date(selectedYear, selectedMonth + 1, 0).getDate(),
    [selectedYear, selectedMonth],
  );
  const decMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(y => y - 1);
    } else {
      setSelectedMonth(m => m - 1);
    }
    setSelectedDate(1);
  };
  const incMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(y => y + 1);
    } else {
      setSelectedMonth(m => m + 1);
    }
    setSelectedDate(1);
  };
  const dobString = useMemo(() => {
    const mm = `${selectedMonth + 1}`.padStart(2, '0');
    const dd = `${selectedDate}`.padStart(2, '0');
    return `${selectedYear}-${mm}-${dd}`;
  }, [selectedYear, selectedMonth, selectedDate]);

  // Country / City
  const [countrySearch, setCountrySearch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string | null>(
    passedProfile?.country ?? null,
  );
  const [citySearch, setCitySearch] = useState('');
  const [selectedCity, setSelectedCity] = useState<string | null>(
    passedProfile?.city ?? null,
  );

  // Ethnicity / Education / Profession
  const [ethnicitySearch, setEthnicitySearch] = useState('');
  const [selectedEthnicity, setSelectedEthnicity] = useState<string | null>(
    passedProfile?.ethnicity ?? null,
  );
  const [educationSearch, setEducationSearch] = useState('');
  const [selectedEducation, setSelectedEducation] = useState<string | null>(
    passedProfile?.education ?? null,
  );
  const [professionSearch, setProfessionSearch] = useState('');
  const [selectedProfession, setSelectedProfession] = useState<string | null>(
    passedProfile?.profession ?? null,
  );

  // Religious identity
  const [religion, setReligion] = useState<string>(
    passedProfile?.religion ?? '',
  );
  const [sect, setSect] = useState<string>(
    passedProfile?.religion_section ?? '',
  );
  const [prayer, setPrayer] = useState<string>(
    (passedProfile?.prayer_frequency ?? '')?.toString(),
  );
  const [dressCode, setDressCode] = useState<string>(
    passedProfile?.dress_code ?? '',
  );
  const [diet, setDiet] = useState<string>(
    passedProfile?.dietary_preference ?? '',
  );

  // Marital history
  const [maritalStatus, setMaritalStatus] = useState<string>(
    passedProfile?.marital_status ?? '',
  );
  const [durationKey, setDurationKey] = useState<string>(
    mapMonthsToKey(passedProfile?.marital_duration ?? null),
  );
  const [haveChildren, setHaveChildren] = useState<'Yes' | 'No' | null>(() => {
    const v = passedProfile?.have_child;
    if (v === 1 || v === '1') return 'Yes';
    if (v === 0 || v === '0') return 'No';
    return null;
  });
  const [wantChildren, setWantChildren] = useState<'Yes' | 'No' | null>(() => {
    const v = passedProfile?.want_child;
    if (v === 1 || v === '1') return 'Yes';
    if (v === 0 || v === '0') return 'No';
    return null;
  });

  // Partner prefs
  const partnerStartFromProfile =
    typeof passedProfile?.prefered_partner_age_start === 'number'
      ? passedProfile?.prefered_partner_age_start
      : 18;
  const [ageEnd, setAgeEnd] = useState<number>(
    typeof passedProfile?.prefered_partner_age_end === 'number'
      ? passedProfile.prefered_partner_age_end
      : 28,
  );
  const partnerAgeStart = partnerStartFromProfile;
  const [distance, setDistance] = useState<number>(
    typeof passedProfile?.prefered_partner_distance_range === 'number'
      ? passedProfile.prefered_partner_distance_range
      : 50,
  );
  const [partnerMaritalStatus, setPartnerMaritalStatus] = useState<string>('');
  const [partnerReligion, setPartnerReligion] = useState<string>(
    passedProfile?.prefered_partner_religion ?? '',
  );
  const [partnerEthnicity, setPartnerEthnicity] = useState<string>('');
  const [partnerSect, setPartnerSect] = useState<string>(
    passedProfile?.prefered_partner_religion_section ?? '',
  );
  const [partnerOccupation, setPartnerOccupation] = useState<string>(
    passedProfile?.prefered_partner_occupation ?? '',
  );
  const [partnerEducation, setPartnerEducation] = useState<string>(
    passedProfile?.prefered_partner_education ?? '',
  );

  // Queries
  const {
    data: countries,
    isLoading: isCountriesLoading,
    isError: isCountriesError,
  } = useQuery({
    queryKey: ['countries'],
    queryFn: fetchCountries,
  });
  const filteredCountries =
    countries?.filter(item =>
      item.toLowerCase().includes(countrySearch.toLowerCase()),
    ) || [];

  const countryForQuery = selectedCountry || passedProfile?.country || '';
  const {
    data: cities,
    isLoading: isCitiesLoading,
    isError: isCitiesError,
  } = useQuery({
    queryKey: ['cities', countryForQuery],
    queryFn: () => fetchCitiesByCountry(countryForQuery),
    enabled: !!countryForQuery,
  });
  const cityNames = useMemo(
    () => cities?.map(c => c.city_name).filter(Boolean) ?? [],
    [cities],
  );
  const filteredCities = useMemo(
    () =>
      cityNames.filter(name =>
        name.toLowerCase().includes(citySearch.toLowerCase()),
      ),
    [cityNames, citySearch],
  );

  useEffect(() => {
    if (selectedCountry && selectedCountry !== passedProfile?.country) {
      setSelectedCity(null);
      setCitySearch('');
    }
  }, [selectedCountry, passedProfile?.country]);

  const filteredCasts = CAST.filter(i =>
    i.toLowerCase().includes(ethnicitySearch.toLowerCase()),
  );
  const filteredEducation = SCHOOL.filter(i =>
    i.toLowerCase().includes(educationSearch.toLowerCase()),
  );
  const filteredProfessions = INDUSTRIES.filter(i =>
    i.toLowerCase().includes(professionSearch.toLowerCase()),
  );

  const resolvedCountry = selectedCountry || passedProfile?.country || null;
  const resolvedCity = selectedCity || passedProfile?.city || null;
  const resolvedEthnicity =
    selectedEthnicity || passedProfile?.ethnicity || null;
  const resolvedEducation =
    selectedEducation || passedProfile?.education || null;
  const resolvedProfession =
    selectedProfession || passedProfile?.profession || null;

  const confirmEnabled = !!resolvedCountry && !!resolvedCity;

  const {mutate: doUpdate, isPending: isSaving} = useMutation({
    mutationFn: () =>
      updateProfile({
        gender: gender || undefined,
        name: fullName || undefined,
        dob: dobString || undefined,
        country: resolvedCountry ?? undefined,
        city: resolvedCity ?? undefined,
        ethnicity: resolvedEthnicity ?? undefined,
        education: resolvedEducation ?? undefined,
        profession: resolvedProfession ?? undefined,
        religion: religion || undefined,
        religion_section: sect || undefined,
        prayer_frequency: prayer || undefined,
        dress_code: dressCode || undefined,
        dietary_preference: diet || undefined,
        marital_status: maritalStatus || undefined,
        marital_duration: mapKeyToMonths(durationKey),
        have_child:
          haveChildren == null ? undefined : haveChildren === 'Yes' ? '1' : '0',
        want_child:
          wantChildren == null ? undefined : wantChildren === 'Yes' ? '1' : '0',
        prefered_partner_age_start: partnerAgeStart,
        prefered_partner_age_end: ageEnd,
        prefered_partner_distance_range: distance,
        prefered_partner_religion: partnerReligion || undefined,
        prefered_partner_religion_section: partnerSect || undefined,
        prefered_partner_occupation: partnerOccupation || undefined,
        prefered_partner_education: partnerEducation || undefined,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({queryKey: ['profile']});
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

  const handleConfirm = () => {
    if (!confirmEnabled || isSaving) return;
    doUpdate();
  };

  // Non-virtualized selectable list
  const SelectableList = ({
    items,
    selected,
    onSelect,
    maxHeight = 250,
  }: {
    items: string[];
    selected: string | null;
    onSelect: (v: string) => void;
    maxHeight?: number;
  }) => (
    <View style={[styles.listBox, {maxHeight}]}>
      <ScrollView
        nestedScrollEnabled
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{paddingBottom: 4}}
        showsVerticalScrollIndicator={false}>
        {items.length === 0 ? (
          <Text style={[styles.statusText, {textAlign: 'center'}]}>
            No results
          </Text>
        ) : (
          items.map(item => (
            <TouchableOpacity
              key={item}
              style={styles.listItem}
              onPress={() => onSelect(item)}
              activeOpacity={0.7}>
              <Text style={styles.itemText}>{item}</Text>
              <View style={styles.radioCircle}>
                {selected === item && <View style={styles.selectedDot} />}
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );

  // Day pill renderer for DOB
  const DayPill = ({day}: {day: number}) => {
    const selected = selectedDate === day;
    return (
      <TouchableOpacity
        key={day}
        onPress={() => setSelectedDate(day)}
        style={[styles.dayCircle, selected && styles.selectedDayCircle]}>
        <Text style={[styles.dayText, selected && styles.selectedDayText]}>
          {day}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <ImageBackground
      source={require('../../assets/images/country.png')}
      style={styles.background}
      resizeMode="cover">
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={insets.top || 0}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.flex}>
            <SafeAreaView
              style={styles.safeArea}
              edges={['top', 'left', 'right']}>
              {/* Header */}
              <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Icon name="chevron-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.title}>Update Personal Info</Text>
                <View style={{width: 24}} />
              </View>

              {/* Scrollable content */}
              <ScrollView
                nestedScrollEnabled
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  paddingBottom: (insets.bottom || 16) + 120,
                }}>
                {/* Full name */}
                <TouchableOpacity
                  style={styles.sectionToggle}
                  onPress={() => toggleSection('name')}
                  activeOpacity={0.7}>
                  <Text style={styles.sectionTitle}>Full name</Text>
                  <Icon
                    name={isOpen('name') ? 'chevron-down' : 'chevron-forward'}
                    size={18}
                    color="#000"
                  />
                </TouchableOpacity>
                {isOpen('name') && (
                  <TextInput
                    placeholder="Full name"
                    placeholderTextColor="#f472b6"
                    value={fullName}
                    onChangeText={setFullName}
                    style={styles.input}
                    returnKeyType="done"
                  />
                )}

                {/* Gender */}
                <TouchableOpacity
                  style={styles.sectionToggle}
                  onPress={() => toggleSection('gender')}
                  activeOpacity={0.7}>
                  <Text style={styles.sectionTitle}>Gender</Text>
                  <Icon
                    name={isOpen('gender') ? 'chevron-down' : 'chevron-forward'}
                    size={18}
                    color="#000"
                  />
                </TouchableOpacity>
                {isOpen('gender') && (
                  <View style={{gap: 12}}>
                    {(['Female', 'Male'] as const).map(g => {
                      const selected = gender === g;
                      return (
                        <TouchableOpacity
                          key={g}
                          style={[
                            styles.genderOption,
                            selected && styles.genderOptionSelected,
                          ]}
                          onPress={() => setGender(g)}>
                          <Text
                            style={[
                              styles.genderText,
                              selected && styles.genderTextSelected,
                            ]}>
                            {g}
                          </Text>
                          <View
                            style={[
                              styles.genderRadio,
                              selected && styles.genderRadioSelected,
                            ]}>
                            {selected && <View style={styles.genderRadioDot} />}
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}

                {/* DOB */}
                <TouchableOpacity
                  style={styles.sectionToggle}
                  onPress={() => toggleSection('dob')}
                  activeOpacity={0.7}>
                  <Text style={styles.sectionTitle}>Date of birth</Text>
                  <Icon
                    name={isOpen('dob') ? 'chevron-down' : 'chevron-forward'}
                    size={18}
                    color="#000"
                  />
                </TouchableOpacity>
                {isOpen('dob') && (
                  <>
                    <View style={styles.dateHeader}>
                      <TouchableOpacity onPress={decMonth}>
                        <Icon name="chevron-back" size={20} color="#000" />
                      </TouchableOpacity>

                      <View style={styles.dateLabel}>
                        <TouchableOpacity
                          onPress={() => setShowYearModal(true)}>
                          <Text style={styles.yearText}>{selectedYear}</Text>
                        </TouchableOpacity>
                        <Text style={styles.monthText}>
                          {MONTHS[selectedMonth]}
                        </Text>
                      </View>

                      <TouchableOpacity onPress={incMonth}>
                        <Icon name="chevron-forward" size={20} color="#000" />
                      </TouchableOpacity>
                    </View>

                    <View style={styles.calendarGrid}>
                      {Array.from({length: daysInMonth}, (_, i) => i + 1).map(
                        d => (
                          <DayPill key={d} day={d} />
                        ),
                      )}
                    </View>

                    <Text style={styles.helperText}>Selected: {dobString}</Text>
                  </>
                )}

                {/* Nationality */}
                <TouchableOpacity
                  style={styles.sectionToggle}
                  onPress={() => toggleSection('country')}
                  activeOpacity={0.7}>
                  <Text style={styles.sectionTitle}>Nationality</Text>
                  <Icon
                    name={
                      isOpen('country') ? 'chevron-down' : 'chevron-forward'
                    }
                    size={18}
                    color="#000"
                  />
                </TouchableOpacity>
                {isOpen('country') && (
                  <>
                    <View style={styles.searchBox}>
                      <Icon
                        name="search"
                        size={20}
                        color="#f472b6"
                        style={styles.searchIcon}
                      />
                      <TextInput
                        placeholder="Search here..."
                        placeholderTextColor="#aaa"
                        value={countrySearch}
                        onChangeText={setCountrySearch}
                        style={styles.searchInput}
                        returnKeyType="search"
                      />
                    </View>
                    {isCountriesLoading ? (
                      <View style={styles.center}>
                        <ActivityIndicator />
                        <Text style={styles.statusText}>
                          Loading countries...
                        </Text>
                      </View>
                    ) : isCountriesError ? (
                      <View style={styles.center}>
                        <Text style={styles.errorText}>
                          Failed to load countries. Please try again.
                        </Text>
                      </View>
                    ) : (
                      <SelectableList
                        items={filteredCountries}
                        selected={selectedCountry ?? null}
                        onSelect={setSelectedCountry}
                      />
                    )}
                  </>
                )}

                {/* Where do you live? */}
                <TouchableOpacity
                  style={[styles.sectionToggle, {marginTop: 28}]}
                  onPress={() => toggleSection('city')}
                  activeOpacity={0.7}>
                  <Text style={styles.sectionTitle}>Where do you live?</Text>
                  <Icon
                    name={isOpen('city') ? 'chevron-down' : 'chevron-forward'}
                    size={18}
                    color="#000"
                  />
                </TouchableOpacity>
                {isOpen('city') &&
                  !(selectedCountry || passedProfile?.country) && (
                    <Text style={styles.helperText}>
                      Please select your country first.
                    </Text>
                  )}
                {isOpen('city') && (
                  <>
                    <View style={styles.searchBox}>
                      <Icon
                        name="search"
                        size={20}
                        color="#f472b6"
                        style={styles.searchIcon}
                      />
                      <TextInput
                        placeholder="Search city"
                        placeholderTextColor="#aaa"
                        value={citySearch}
                        onChangeText={setCitySearch}
                        style={styles.searchInput}
                        returnKeyType="search"
                      />
                    </View>
                    {isCitiesLoading &&
                    !!(selectedCountry || passedProfile?.country) ? (
                      <View style={styles.center}>
                        <ActivityIndicator />
                        <Text style={styles.statusText}>Loading cities...</Text>
                      </View>
                    ) : isCitiesError &&
                      !!(selectedCountry || passedProfile?.country) ? (
                      <View style={styles.center}>
                        <Text style={styles.errorText}>
                          Failed to load cities. Please try again.
                        </Text>
                      </View>
                    ) : (
                      <SelectableList
                        items={filteredCities}
                        selected={selectedCity ?? null}
                        onSelect={setSelectedCity}
                      />
                    )}
                  </>
                )}

                {/* Ethnicity */}
                <TouchableOpacity
                  style={[styles.sectionToggle, {marginTop: 28}]}
                  onPress={() => toggleSection('ethnicity')}
                  activeOpacity={0.7}>
                  <Text style={styles.sectionTitle}>Ethnicity</Text>
                  <Icon
                    name={
                      isOpen('ethnicity') ? 'chevron-down' : 'chevron-forward'
                    }
                    size={18}
                    color="#000"
                  />
                </TouchableOpacity>
                {isOpen('ethnicity') && (
                  <>
                    <View style={styles.searchBox}>
                      <Icon
                        name="search"
                        size={20}
                        color="#f472b6"
                        style={styles.searchIcon}
                      />
                      <TextInput
                        placeholder="Search here..."
                        placeholderTextColor="#aaa"
                        value={ethnicitySearch}
                        onChangeText={setEthnicitySearch}
                        style={styles.searchInput}
                        returnKeyType="search"
                      />
                    </View>
                    <SelectableList
                      items={filteredCasts}
                      selected={selectedEthnicity ?? null}
                      onSelect={setSelectedEthnicity}
                    />
                  </>
                )}

                {/* Education */}
                <TouchableOpacity
                  style={[styles.sectionToggle, {marginTop: 28}]}
                  onPress={() => toggleSection('education')}
                  activeOpacity={0.7}>
                  <Text style={styles.sectionTitle}>Education</Text>
                  <Icon
                    name={
                      isOpen('education') ? 'chevron-down' : 'chevron-forward'
                    }
                    size={18}
                    color="#000"
                  />
                </TouchableOpacity>
                {isOpen('education') && (
                  <>
                    <View style={styles.searchBox}>
                      <Icon
                        name="search"
                        size={20}
                        color="#f472b6"
                        style={styles.searchIcon}
                      />
                      <TextInput
                        placeholder="Select education level"
                        placeholderTextColor="#aaa"
                        value={educationSearch}
                        onChangeText={setEducationSearch}
                        style={styles.searchInput}
                        returnKeyType="search"
                      />
                    </View>
                    <SelectableList
                      items={filteredEducation}
                      selected={selectedEducation ?? null}
                      onSelect={setSelectedEducation}
                    />
                  </>
                )}

                {/* Profession */}
                <TouchableOpacity
                  style={[styles.sectionToggle, {marginTop: 28}]}
                  onPress={() => toggleSection('profession')}
                  activeOpacity={0.7}>
                  <Text style={styles.sectionTitle}>Profession</Text>
                  <Icon
                    name={
                      isOpen('profession') ? 'chevron-down' : 'chevron-forward'
                    }
                    size={18}
                    color="#000"
                  />
                </TouchableOpacity>
                {isOpen('profession') && (
                  <>
                    <View style={styles.searchBox}>
                      <Icon
                        name="search"
                        size={20}
                        color="#f472b6"
                        style={styles.searchIcon}
                      />
                      <TextInput
                        placeholder="Select your occupation"
                        placeholderTextColor="#aaa"
                        value={professionSearch}
                        onChangeText={setProfessionSearch}
                        style={styles.searchInput}
                        returnKeyType="search"
                      />
                    </View>
                    <SelectableList
                      items={filteredProfessions}
                      selected={selectedProfession ?? null}
                      onSelect={setSelectedProfession}
                    />
                  </>
                )}

                {/* Marital History */}
                <TouchableOpacity
                  style={[styles.sectionToggle, {marginTop: 28}]}
                  onPress={() => toggleSection('marital')}
                  activeOpacity={0.7}>
                  <Text style={styles.sectionTitle}>Marital History</Text>
                  <Icon
                    name={
                      isOpen('marital') ? 'chevron-down' : 'chevron-forward'
                    }
                    size={18}
                    color="#000"
                  />
                </TouchableOpacity>
                {isOpen('marital') && (
                  <>
                    <View style={styles.pickerContainer}>
                      <Picker
                        mode="dropdown"
                        selectedValue={maritalStatus}
                        style={styles.picker}
                        dropdownIconColor="#999"
                        onValueChange={setMaritalStatus}>
                        <Picker.Item
                          label="Select your marital status"
                          value=""
                        />
                        <Picker.Item label="Single" value="Single" />
                        <Picker.Item label="Married" value="Married" />
                        <Picker.Item label="Divorced" value="Divorced" />
                        <Picker.Item label="Widowed" value="Widowed" />
                      </Picker>
                    </View>

                    <View style={styles.pickerContainer}>
                      <Picker
                        mode="dropdown"
                        selectedValue={durationKey}
                        style={styles.picker}
                        dropdownIconColor="#999"
                        onValueChange={setDurationKey}>
                        <Picker.Item label="Select duration" value="" />
                        <Picker.Item label="1 Month" value="1_month" />
                        <Picker.Item label="3 Months" value="3_months" />
                        <Picker.Item label="6 Months" value="6_months" />
                        <Picker.Item label="1 Year" value="1_year" />
                      </Picker>
                    </View>

                    <Text style={styles.sectionLabel}>
                      Do you have children?
                    </Text>
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

                    <Text style={styles.sectionLabel}>
                      Do you want children?
                    </Text>
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
                  </>
                )}

                {/* Partner Preferences */}
                <TouchableOpacity
                  style={[styles.sectionToggle, {marginTop: 28}]}
                  onPress={() => toggleSection('partner')}
                  activeOpacity={0.7}>
                  <Text style={styles.sectionTitle}>Partner Preferences</Text>
                  <Icon
                    name={
                      isOpen('partner') ? 'chevron-down' : 'chevron-forward'
                    }
                    size={18}
                    color="#000"
                  />
                </TouchableOpacity>
                {isOpen('partner') && (
                  <>
                    <View style={styles.pickerContainerPP}>
                      <Picker
                        mode="dropdown"
                        selectedValue={partnerMaritalStatus}
                        onValueChange={setPartnerMaritalStatus}
                        dropdownIconColor="#999"
                        style={styles.pickerPP}>
                        <Picker.Item label="Partner marital status" value="" />
                        <Picker.Item label="Single" value="Single" />
                        <Picker.Item label="Divorced" value="Divorced" />
                        <Picker.Item label="Widowed" value="Widowed" />
                      </Picker>
                    </View>

                    <View style={styles.pickerContainerPP}>
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

                    <View style={styles.pickerContainerPP}>
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

                    <View style={styles.pickerContainerPP}>
                      <Picker
                        mode="dropdown"
                        selectedValue={partnerReligion}
                        onValueChange={setPartnerReligion}
                        dropdownIconColor="#999"
                        style={styles.pickerPP}>
                        <Picker.Item label="Partner religion" value="" />
                        <Picker.Item label="Islam" value="Islam" />
                        <Picker.Item
                          label="Christianity"
                          value="Christianity"
                        />
                        <Picker.Item label="Hinduism" value="Hinduism" />
                        <Picker.Item label="Other" value="Other" />
                      </Picker>
                    </View>

                    <View style={styles.pickerContainerPP}>
                      <Picker
                        mode="dropdown"
                        selectedValue={partnerEthnicity}
                        onValueChange={setPartnerEthnicity}
                        dropdownIconColor="#999"
                        style={styles.pickerPP}>
                        <Picker.Item label="Partner ethnicity" value="" />
                        <Picker.Item label="Asian" value="Asian" />
                        <Picker.Item label="Arab" value="Arab" />
                        <Picker.Item label="African" value="African" />
                        <Picker.Item label="European" value="European" />
                        <Picker.Item label="Other" value="Other" />
                      </Picker>
                    </View>

                    <View style={styles.pickerContainerPP}>
                      <Picker
                        mode="dropdown"
                        selectedValue={partnerSect}
                        onValueChange={setPartnerSect}
                        dropdownIconColor="#999"
                        style={styles.pickerPP}>
                        <Picker.Item label="Partner sect" value="" />
                        <Picker.Item label="Sunni" value="Sunni" />
                        <Picker.Item label="Shia" value="Shia" />
                        <Picker.Item label="Other" value="Other" />
                      </Picker>
                    </View>

                    <View style={styles.pickerContainerPP}>
                      <Picker
                        mode="dropdown"
                        selectedValue={partnerOccupation}
                        onValueChange={setPartnerOccupation}
                        dropdownIconColor="#999"
                        style={styles.pickerPP}>
                        <Picker.Item label="Partner occupation" value="" />
                        <Picker.Item label="Engineer" value="Engineer" />
                        <Picker.Item label="Doctor" value="Doctor" />
                        <Picker.Item label="Teacher" value="Teacher" />
                        <Picker.Item label="Business" value="Business" />
                        <Picker.Item label="Other" value="Other" />
                      </Picker>
                    </View>

                    <View style={styles.pickerContainerPP}>
                      <Picker
                        mode="dropdown"
                        selectedValue={partnerEducation}
                        onValueChange={setPartnerEducation}
                        dropdownIconColor="#999"
                        style={styles.pickerPP}>
                        <Picker.Item label="Partner education level" value="" />
                        <Picker.Item label="High School" value="High School" />
                        <Picker.Item label="Bachelor's" value="Bachelor" />
                        <Picker.Item label="Master's" value="Master" />
                        <Picker.Item label="PhD" value="PhD" />
                      </Picker>
                    </View>
                  </>
                )}
              </ScrollView>
            </SafeAreaView>

            {/* Confirm */}
            <TouchableOpacity
              disabled={!confirmEnabled || isSaving}
              onPress={handleConfirm}
              style={[
                styles.confirmButton,
                {
                  bottom: insets.bottom,
                  backgroundColor:
                    confirmEnabled && !isSaving ? '#f472b6' : '#ddd',
                },
              ]}>
              <Text style={styles.confirmText}>
                {isSaving ? 'Saving…' : 'Update'}
              </Text>
            </TouchableOpacity>

            {/* Year picker modal for DOB */}
            <Modal
              visible={showYearModal}
              transparent
              animationType="fade"
              onRequestClose={() => setShowYearModal(false)}>
              <View style={styles.modalOverlay}>
                <View style={styles.yearModal}>
                  <ScrollView showsVerticalScrollIndicator={false}>
                    {Array.from({length: 100}, (_, i) => 1980 + i).map(year => (
                      <TouchableOpacity
                        key={year}
                        onPress={() => {
                          setSelectedYear(year);
                          setShowYearModal(false);
                        }}
                        style={[
                          styles.yearOption,
                          selectedYear === year && styles.selectedYearOption,
                        ]}>
                        <Text
                          style={[
                            styles.yearOptionText,
                            selectedYear === year &&
                              styles.selectedYearOptionText,
                          ]}>
                          {year}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>
            </Modal>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default EditPersonalInfo;

const styles = StyleSheet.create({
  flex: {flex: 1},
  background: {flex: 1},
  safeArea: {flex: 1, paddingHorizontal: 24},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {fontSize: 24, fontWeight: 'bold', color: '#000'},

  sectionToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitle: {fontSize: 14, fontWeight: '600', color: '#000'},
  helperText: {fontSize: 14, color: '#dc2626', marginTop: 8, marginBottom: 8},

  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    backgroundColor: '#fff',
    color: '#000',
    fontSize: 14,
  },

  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 20,
  },
  searchIcon: {marginRight: 8},
  searchInput: {flex: 1, height: 44, color: '#000', fontSize: 14},

  listBox: {
    flexShrink: 1,
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 6,
    paddingHorizontal: 10,
    maxHeight: 250,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderColor: '#eee',
  },
  itemText: {fontSize: 14, color: '#000'},
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#f472b6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedDot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#f472b6',
  },

  innerSectionTitle: {
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
  sectionLabel: {marginTop: 20, marginBottom: 8, fontSize: 14, color: '#000'},

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
  selectedButton: {borderColor: '#FF4081', backgroundColor: '#FFE6F0'},
  buttonText: {fontSize: 16, color: '#333'},
  selectedText: {fontSize: 16, color: '#FF4081', fontWeight: 'bold'},

  // Partner prefs
  pickerContainerPP: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 12,
    paddingHorizontal: 8,
    paddingTop: Platform.OS === 'ios' ? 6 : 0,
  },
  pickerPP: {color: '#333', height: 56},
  label: {fontSize: 14, color: '#000', marginBottom: 6},
  rangeText: {
    textAlign: 'center',
    color: '#FF4081',
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 4,
  },

  confirmButton: {
    position: 'absolute',
    left: 24,
    right: 24,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 5,
  },
  confirmText: {color: '#fff', fontWeight: 'bold', fontSize: 16},

  center: {paddingVertical: 16, alignItems: 'center', justifyContent: 'center'},
  statusText: {marginTop: 8, color: '#666', fontSize: 14},
  errorText: {color: '#dc2626', textAlign: 'center', fontSize: 14},

  // DOB styles
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateLabel: {alignItems: 'center'},
  yearText: {fontSize: 16, color: '#f472b6', fontWeight: 'bold'},
  monthText: {fontSize: 14, color: '#f472b6'},
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  dayCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
  },
  selectedDayCircle: {backgroundColor: '#f472b6', borderColor: '#f472b6'},
  dayText: {color: '#000', fontSize: 14},
  selectedDayText: {color: '#fff', fontWeight: 'bold'},

  // Year modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  yearModal: {
    width: 220,
    height: 320,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 10,
  },
  yearOption: {padding: 10, alignItems: 'center'},
  selectedYearOption: {backgroundColor: '#f472b6', borderRadius: 6},
  yearOptionText: {fontSize: 14, color: '#000'},
  selectedYearOptionText: {color: '#fff', fontWeight: 'bold'},

  // Gender tiles (14px scale)
  genderOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#f6f6f6',
  },
  genderOptionSelected: {borderColor: '#FF2D7A', backgroundColor: '#fff'},
  genderText: {fontSize: 14, fontWeight: '600', color: '#aaa'},
  genderTextSelected: {color: '#000'},
  genderRadio: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  genderRadioSelected: {borderColor: '#FF2D7A'},
  genderRadioDot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: '#FF2D7A',
  },
});
