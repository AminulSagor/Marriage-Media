// SettingsScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';

const SectionItem = ({icon, title, subtitle, onPress, color}) => (
  <TouchableOpacity onPress={onPress} style={styles.itemRow}>
    <Icon
      name={icon}
      size={20}
      color={color || '#000'}
      style={styles.itemIcon}
    />
    <View style={{flex: 1}}>
      <Text style={styles.itemTitle}>{title}</Text>
      {subtitle && <Text style={styles.itemSubtitle}>{subtitle}</Text>}
    </View>
    <Icon name="chevron-right" size={22} color="#ccc" />
  </TouchableOpacity>
);

const GernalScreen = ({navigation}) => {
  const handleDelete = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account?',
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFEFF1" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>General</Text>
        <TouchableOpacity>
          <Feather name="log-out" size={24} color="#f04b60" />
        </TouchableOpacity>
      </View>

      {/* Background shape (simulated as pink rounded view) */}
      <View style={styles.topCurve} />

      {/* Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollContent}>
        {/* Personal Info */}
        <Text style={styles.sectionHeader}>Personal Information</Text>
        <View style={styles.section}>
          <SectionItem
            icon="account"
            title="First Name"
            subtitle="Niaz Ahmed"
          />
          <SectionItem
            icon="calendar"
            title="Date Of Birth"
            subtitle="February 14, 2000"
          />
          <SectionItem icon="gender-male" title="Gender" subtitle="Male" />
          <SectionItem
            icon="email"
            title="Email Address"
            subtitle="Yourgmail@Mail.Com"
          />
          <SectionItem
            icon="phone"
            title="Phone Number"
            subtitle="0823491521"
          />
        </View>

        {/* App Settings */}
        <Text style={styles.sectionHeader}>App Settings</Text>
        <View style={styles.section}>
          <SectionItem icon="translate" title="Language" subtitle="English" />
          <SectionItem
            icon="shopping"
            title="Manage Purchases"
            subtitle="Review Or Restore Your Previous Purchases"
          />
          <SectionItem
            icon="lock"
            title="Passcode"
            subtitle="Require A Passcode Every Time You Open The App"
          />
          <SectionItem
            icon="volume-off"
            title="Audio / Video Mute"
            subtitle="Mute Unnecessary Audio And Video Calls"
          />
          <SectionItem icon="bell" title="Notifications" />
        </View>

        {/* Privacy */}
        <Text style={styles.sectionHeader}>Privacy</Text>
        <View style={styles.section}>
          <SectionItem icon="block-helper" title="Blocked Accounts" />
          <SectionItem icon="eye" title="Profile I Visited" />
          <SectionItem icon="volume-mute" title="Muted Accounts" />
        </View>

        {/* Manage Account */}
        <Text style={styles.sectionHeader}>Manage Account</Text>
        <View style={styles.section}>
          <SectionItem icon="translate" title="Language" subtitle="English" />
          <SectionItem
            icon="alert-circle"
            title="Delete Your Account"
            subtitle="Once You Delete It You Can't Get It Back"
            onPress={handleDelete}
            color="#f04b60"
          />
          <SectionItem icon="logout" title="Log Out" />
        </View>
      </ScrollView>
    </View>
  );
};

export default GernalScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFEFF1',
    paddingBottom: 90,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFEFF1',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  topCurve: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: 160,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
    zIndex: -1,
  },
  scrollContent: {
    paddingHorizontal: 15,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 25,
    marginBottom: 10,
    color: '#000',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  itemIcon: {
    width: 25,
    marginRight: 10,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
  },
  itemSubtitle: {
    fontSize: 12,
    color: '#666',
  },
});
