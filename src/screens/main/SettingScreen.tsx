// SettingsScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  ImageBackground,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useQuery} from '@tanstack/react-query';

import {logout} from '../../api/auth';
import {fetchProfile, UserProfile} from '../../api/profile';

import {stopPresenceIfAny} from '../../services/presence';

type SettingsScreenProps = {
  navigation: any;
  route?: {params?: {profile?: UserProfile}};
};

const formatDate = (iso?: string | null) => {
  if (!iso) return '—';
  const d = new Date(iso);
  return isNaN(d.getTime())
    ? '—'
    : d.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
};

const SettingsScreen: React.FC<SettingsScreenProps> = ({navigation, route}) => {
  const incoming = route?.params?.profile;
  const {data: fetchedProfile} = useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
    enabled: !incoming,
  });
  const profile: UserProfile | undefined = incoming ?? fetchedProfile;

  const [matchNoti, setMatchNoti] = React.useState(false);
  const [chatNoti, setChatNoti] = React.useState(false);
  const [emailSms, setEmailSms] = React.useState(false);
  const [logoutModal, setLogoutModal] = React.useState(false);
  const [audioMute, setAudioMute] = React.useState(false);

  const handleLogout = async () => {
    setLogoutModal(false);

    // stop presence tracking & mark offline
    stopPresenceIfAny();

    await logout();
    const rootNav = navigation.getParent()?.getParent() ?? navigation;
    rootNav.reset({index: 0, routes: [{name: 'Auth'}]});
  };

  // Always shows chevron and makes the whole row tappable
  const renderItem = (
    icon: React.ReactNode,
    label: string,
    value: string = '',
    danger = false,
    tapable: boolean = true,
    onPress?: () => void,
  ) => (
    <TouchableOpacity
      style={styles.item}
      onPress={tapable ? onPress ?? (() => {}) : undefined}
      activeOpacity={0.7}
      disabled={!tapable} // ✅ prevents touch highlight
    >
      <View style={styles.itemLeft}>
        {icon}
        <View style={{marginLeft: 10, flexShrink: 1}}>
          <Text
            style={[styles.itemText, danger && {color: 'red'}]}
            numberOfLines={1}>
            {label}
          </Text>
          {!!value && (
            <Text style={styles.subText} numberOfLines={1}>
              {value}
            </Text>
          )}
        </View>
      </View>

      {tapable && <Icon name="chevron-forward" size={20} color="#999" />}
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require('../../assets/images/bg.png')}
      style={styles.bg}
      resizeMode="cover">
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation?.goBack()}>
            <Icon name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>General</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Personal Information */}
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <View style={styles.section}>
            {renderItem(
              <Icon name="person-outline" size={20} />,
              'Name',
              profile?.name || '—',
              false,
              true,
              () =>
                navigation.navigate('EditPersonalInfo', {
                  profile,
                  openSection: 'name',
                }),
            )}
            {renderItem(
              <Icon name="calendar-outline" size={20} />,
              'Date Of Birth',
              formatDate(profile?.dob),
              false,
              true,
              () =>
                navigation.navigate('EditPersonalInfo', {
                  profile,
                  openSection: 'dob',
                }),
            )}
            {renderItem(
              <Icon name="male-outline" size={20} />,
              'Gender',
              profile?.gender || '—',
              false,
              true,
              () =>
                navigation.navigate('EditPersonalInfo', {
                  profile,
                  openSection: 'gender',
                }),
            )}
            {renderItem(
              <Icon name="mail-outline" size={20} />,
              'Email Address',
              (profile as any)?.email || '—',
              false,
              false,
              () => {},
            )}
            {renderItem(
              <Icon name="call-outline" size={20} />,
              'Phone Number',
              (profile as any)?.phone || '—',
              false,
              false,
              () => {},
            )}
            {renderItem(
              <Icon name="key-outline" size={20} />,
              'Change Password',
              'Change your password if you forgot it',
              false,
              true,
              () => navigation.navigate('ChangePasswordScreen'),
            )}
          </View>

          {/* App Settings (COMMENTED FOR NOW)*/}
          {/* <Text style={styles.sectionTitle}>App Settings</Text>
          <View style={styles.section}>
            <View style={styles.item}>
              <View style={styles.itemLeft}>
                <Icon name="mic-off-outline" size={20} />
                <View style={{marginLeft: 10}}>
                  <Text style={styles.itemText}>Audio / Video Mute</Text>
                  <Text style={styles.subText}>
                    Mute unnecessary audio and video calls
                  </Text>
                </View>
              </View>
              <Switch value={audioMute} onValueChange={setAudioMute} />
            </View>
          </View> */}

          {/* Privacy & Safety */}
          <Text style={styles.sectionTitle}>Privacy & Safety</Text>
          <View style={styles.section}>
            {renderItem(
              <Icon name="lock-closed-outline" size={20} />,
              'Block / Unblock Users',
              '',
              false,
              true,
              () => navigation.navigate('BlockUnblockUsers'),
            )}
            {renderItem(
              <Icon name="person-circle-outline" size={20} />,
              'Profile I Visited',
              '',
              false,
              true,
              () => navigation.navigate('ProfileVisited'),
            )}
            {renderItem(
              <Icon name="location-outline" size={20} />,
              'Locations Setting',
              '',
              false,
              true,
              () => navigation.navigate('LocationSetting'),
            )}
          </View>

          {/* Notifications */}
          <Text style={styles.sectionTitle}>Notifications</Text>
          {/* Commented for now */}
          <View style={styles.section}>
            {/* <View style={styles.item}>
              <View style={styles.itemLeft}>
                <MaterialIcon name="bell-outline" size={20} />
                <Text style={styles.itemText}>
                  Turn On/Off Matches Notifications
                </Text>
              </View>
              <Switch value={matchNoti} onValueChange={setMatchNoti} />
            </View> */}
            <View style={styles.item}>
              <View style={styles.itemLeft}>
                <MaterialIcon name="chat-outline" size={20} />
                <Text style={styles.itemText}>
                  Turn On/Off Chat Notifications
                </Text>
              </View>
              <Switch value={chatNoti} onValueChange={setChatNoti} />
            </View>
            {/* Commented for now */}
            {/* <View style={styles.item}>
              <View style={styles.itemLeft}>
                <MaterialIcon name="email-outline" size={20} />
                <Text style={styles.itemText}>Email & SMS Alerts</Text>
              </View>
              <Switch value={emailSms} onValueChange={setEmailSms} />
            </View> */}
          </View>

          {/* Subscription & Payments (Commented For now)*/}
          {/* <Text style={styles.sectionTitle}>Subscription & Payments</Text>
          <View style={styles.section}>
            {renderItem(
              <Icon name="card-outline" size={20} />,
              'Manage Subscription',
              '',
              false,
              () => navigation.navigate('SubscriptionScreen'),
            )}
            {renderItem(
              <Icon name="receipt-outline" size={20} />,
              'View Payment History',
            )}
            {renderItem(
              <Icon name="star-outline" size={20} />,
              'Upgrade To Premium',
              '',
              false,
              () => navigation.navigate('PaymentScreen'),
            )}
          </View> */}

          {/* Language & Region (commented for now)*/}
          {/* <Text style={styles.sectionTitle}>Language & Region</Text>
          <View style={styles.section}>
            {renderItem(
              <Icon name="language-outline" size={20} />,
              'Select App Language',
            )}
            {renderItem(
              <Icon name="earth-outline" size={20} />,
              'Change Region Or Location',
            )}
          </View> */}

          {/* Help & Support */}
          <Text style={styles.sectionTitle}>Help & Support</Text>
          <View style={styles.section}>
            {renderItem(<Icon name="help-circle-outline" size={20} />, 'FAQ')}
            {renderItem(
              <Icon name="chatbubbles-outline" size={20} />,
              'Contact Support',
            )}
            {renderItem(
              <Icon name="alert-circle-outline" size={20} />,
              'Report A Problem',
            )}
          </View>

          {/* Safety Tips */}
          <Text style={styles.sectionTitle}>Safety Tips</Text>
          <View style={styles.section}>
            {/* Commented For now */}
            {/* {renderItem(
              <Icon name="shield-checkmark-outline" size={20} />,
              'Respect Islamic Values',
              'Keep your intentions pure for Nikah (marriage)',
            )} */}
            {renderItem(
              <Icon name="eye-outline" size={20} />,
              'Protect Your Privacy',
              'Do not share personal details too quickly',
            )}
            {/* Commented For now */}
            {/* {renderItem(
              <Icon name="chatbubble-ellipses-outline" size={20} />,
              'Safe Communication',
              'Use in-app chat instead of external apps initially',
            )}
            {renderItem(
              <Icon name="hand-left-outline" size={20} />,
              'Report Suspicious Behavior',
              'Block and report if someone makes you uncomfortable',
            )}
            {renderItem(
              <Icon name="people-outline" size={20} />,
              'Family Involvement',
              'Consider involving a Wali (guardian) in conversations',
            )}
            {renderItem(
              <Icon name="location-outline" size={20} />,
              'Meet Safely',
              'If meeting, choose a public and safe location',
            )} */}
          </View>

          {/* Legal & Policies */}
          <Text style={styles.sectionTitle}>Legal & Policies</Text>
          <View style={styles.section}>
            {renderItem(
              <Icon name="document-text-outline" size={20} />,
              'Terms Of Use',
            )}
            {renderItem(
              <Icon name="shield-checkmark-outline" size={20} />,
              'Privacy Policy',
            )}
            {renderItem(
              <Icon name="book-outline" size={20} />,
              'Community Guidelines',
            )}
          </View>

          {/* Manage Account */}
          <Text style={styles.sectionTitle}>Manage Account</Text>
          <View style={styles.section}>
            {renderItem(
              <Icon name="warning-outline" size={20} color="red" />,
              'Delete Account',
              "Once you delete it, you can't get it back",
              true,
              true,
              () => navigation.navigate('DeleteAccountScreen'),
            )}
            {renderItem(
              <Icon name="log-out-outline" size={20} />,
              'Log Out',
              '',
              false,
              true,
              () => setLogoutModal(true),
            )}
          </View>
        </ScrollView>
      </View>

      {/* Logout Confirmation Modal */}
      <Modal transparent visible={logoutModal} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>
              Are you sure you want to log out?
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.noBtn}
                onPress={() => setLogoutModal(false)}>
                <Text style={{color: '#000', fontWeight: '600'}}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.yesBtn} onPress={handleLogout}>
                <Text style={{color: '#fff', fontWeight: '600'}}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  bg: {flex: 1},
  container: {flex: 1, paddingTop: 40},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 10,
    gap: 100,
  },
  headerTitle: {fontSize: 18, fontWeight: '600', marginLeft: 10},
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'black',
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 7,
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 10,
    borderRadius: 40,
    marginBottom: 30,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
  },
  itemLeft: {flexDirection: 'row', alignItems: 'center', flexShrink: 1},
  itemText: {fontSize: 14, fontWeight: '500'},
  subText: {fontSize: 12, color: '#888', marginTop: 2},
  // Modal
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalActions: {flexDirection: 'row', gap: 20},
  noBtn: {
    backgroundColor: '#eee',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  yesBtn: {
    backgroundColor: '#f00',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
});
