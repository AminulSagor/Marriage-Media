import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Modal, ScrollView} from 'react-native'; // add to imports

const months = [
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

const DobScreen = ({navigation}) => {
  const [selectedDate, setSelectedDate] = useState(4);
  const [selectedMonth, setSelectedMonth] = useState(5); // 0-indexed
  const [selectedYear, setSelectedYear] = useState(1995);
  const [showYearModal, setShowYearModal] = useState(false);

  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();

  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(prev => prev - 1);
    } else {
      setSelectedMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(prev => prev + 1);
    } else {
      setSelectedMonth(prev => prev + 1);
    }
  };

  const renderDay = day => (
    <TouchableOpacity
      key={day}
      onPress={() => setSelectedDate(day)}
      style={[
        styles.dayCircle,
        selectedDate === day && styles.selectedDayCircle,
      ]}>
      <Text
        style={[
          styles.dayText,
          selectedDate === day && styles.selectedDayText,
        ]}>
        {day}
      </Text>
    </TouchableOpacity>
  );

  const renderCalendarDays = () => {
    let days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(renderDay(i));
    }
    return days;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/gender.png')}
        style={styles.backgroundImage}
        resizeMode="cover">
        <TouchableOpacity style={styles.backButton}>
          <Icon name="chevron-back" size={24} color="#000" />
          <Text style={styles.title}>Basic Identity</Text>
        </TouchableOpacity>

        <View style={styles.content}>
          <Text style={styles.subtitle}>Your birth date ?</Text>

          <View style={styles.dateHeader}>
            <TouchableOpacity onPress={handlePrevMonth}>
              <Icon name="chevron-back" size={24} color="#000" />
            </TouchableOpacity>
            <View style={styles.dateLabel}>
              <TouchableOpacity onPress={() => setShowYearModal(true)}>
                <Text style={styles.yearText}>{selectedYear}</Text>
              </TouchableOpacity>
              <Text style={styles.monthText}>{months[selectedMonth]}</Text>
            </View>
            <TouchableOpacity onPress={handleNextMonth}>
              <Icon name="chevron-forward" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <View style={styles.calendarGrid}>{renderCalendarDays()}</View>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('SelectCountry')}
          style={styles.confirmButton}>
          <Text style={styles.confirmText}>Confirm</Text>
        </TouchableOpacity>
      </ImageBackground>
      <Modal
        visible={showYearModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowYearModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.yearModal}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {Array.from({length: 100}, (_, i) => {
                const year = 1980 + i;
                return (
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
                        selectedYear === year && styles.selectedYearOptionText,
                      ]}>
                      {year}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default DobScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backgroundImage: {
    flex: 1,
    paddingHorizontal: 24,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 70,
  },
  content: {
    marginTop: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 30,
  },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  dateLabel: {
    alignItems: 'center',
  },
  yearText: {
    fontSize: 22,
    color: '#f472b6',
    fontWeight: 'bold',
  },
  monthText: {
    fontSize: 16,
    color: '#f472b6',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  dayCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  selectedDayCircle: {
    backgroundColor: '#f472b6',
  },
  dayText: {
    color: '#000',
  },
  selectedDayText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  confirmButton: {
    position: 'absolute',
    bottom: 30,
    left: 24,
    right: 24,
    backgroundColor: '#f472b6',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  yearModal: {
    width: 200,
    height: 300,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 10,
  },
  yearOption: {
    padding: 10,
    alignItems: 'center',
  },
  selectedYearOption: {
    backgroundColor: '#f472b6',
    borderRadius: 6,
  },
  yearOptionText: {
    fontSize: 16,
    color: '#000',
  },
  selectedYearOptionText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
