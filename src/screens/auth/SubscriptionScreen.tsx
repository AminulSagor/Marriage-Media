import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const {width} = Dimensions.get('window');

const plans = [
  {
    label: 'Original',
    duration: '1 month',
    price: '$10/month',
    tax: '$2.47',
    highlightColor: '#FF3B6A',
  },
  {
    label: 'Save 44%',
    duration: '3 months',
    price: '$25/month',
    tax: '$6.20',
    highlightColor: '#FFA726',
  },
  {
    label: 'Save 75%',
    duration: '12 months',
    price: '$8/month',
    tax: '$1.95',
    highlightColor: '#F44336',
  },
];

const SubscriptionScreen = ({navigation}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

  const handleSelectPlan = index => {
    setSelectedIndex(index);
  };

  const handlePurchase = () => {
    setShowPopup(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}>
        <TouchableOpacity style={styles.backButton}>
          <Icon name="chevron-back" size={24} color="#E94057" />
        </TouchableOpacity>
        <Text style={styles.title}>Subscription</Text>
        <Text style={styles.subTitle}>
          Subscribe to stay updated on exclusive offers, new arrivals, and
          delicious surprises.
        </Text>

        {/* Features */}
        <View style={styles.featuresBox}>
          {[
            {title: 'No Ads – Enjoy a distraction-free experience.'},
            {title: 'Unlimited Text Messages – Chat without limits.'},
            {
              title:
                'Voice & Video Calls – Connect face-to-face or voice-to-voice.',
            },
            {
              title:
                'Voice Messaging – Send and receive audio messages anytime.',
            },
            {
              title:
                'Unlimited Photo Sharing – Share as many pictures as you like.',
            },
            {title: 'Profile boosts – Get seen by more potential matches.'},
            {title: 'Advanced Filters – Find exactly who you’re looking for.'},
          ].map((item, index) => (
            <View style={styles.featureItem} key={index}>
              <Text style={styles.checkMark}>✔</Text>
              <View style={{flex: 1}}>
                <Text style={styles.featureTitle}>{item.title}</Text>
              </View>
            </View>
          ))}
          <Text style={styles.noteText}>
            Use diamonds for gifts and boosts feature
          </Text>
        </View>

        {/* Plans */}
        <View style={styles.planRow}>
          {plans.map((plan, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.planBox,
                selectedIndex === index && {
                  borderColor: plan.highlightColor,
                  borderWidth: 2,
                },
              ]}
              onPress={() => handleSelectPlan(index)}>
              <Text style={[styles.planLabel, {color: plan.highlightColor}]}>
                {plan.label}
              </Text>
              <Text style={styles.planDuration}>{plan.duration}</Text>
              <Text style={styles.planPrice}>{plan.price}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Purchase Button */}
        <TouchableOpacity onPress={handlePurchase} style={styles.purchaseBtn}>
          <Text style={styles.purchaseText}>Purchase</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Popup Modal */}
      <Modal transparent={true} visible={showPopup} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Google Play</Text>
            <Text style={styles.modalSubTitle}>1 month VIP</Text>
            <Text style={styles.modalPrice}>
              Starting today {plans[selectedIndex].price}
              {'\n'}
              includes tax of {plans[selectedIndex].tax}
            </Text>
            <Text style={styles.modalText}>
              Cancel anytime in subscription on Google Play
            </Text>
            <Text style={styles.modalText}>Visa-8215</Text>
            <Text style={styles.modalSmall}>
              By tapping "Subscribe", you agree that your subscription
              automatically renews until canceled.
            </Text>

            <TouchableOpacity
              style={styles.confirmBtn}
              onPress={() => {
                setShowPopup(false);
                navigation?.navigate('PaymentScreen');
              }}>
              <Text style={styles.confirmText}>Subscribe</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowPopup(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default SubscriptionScreen;

const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: '#FFEFF2'},
  container: {padding: 24, paddingBottom: 40},
  title: {fontSize: 28, fontWeight: '700', color: '#000', marginTop: 10},
  subTitle: {fontSize: 14, color: '#555', marginBottom: 20},
  featuresBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FF3B6A',
    padding: 16,
    marginBottom: 30,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  checkMark: {color: '#FF3B6A', fontSize: 18, marginRight: 12, marginTop: 2},
  featureTitle: {fontSize: 12, fontWeight: '600', color: '#000'},
  noteText: {fontSize: 12, color: '#999', marginTop: 12, textAlign: 'center'},
  planRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  planBox: {
    width: (width - 72) / 3,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
  },
  planLabel: {fontWeight: '600', fontSize: 13, marginBottom: 8},
  planDuration: {fontSize: 12, fontWeight: '500', color: '#333'},
  planPrice: {fontSize: 12, fontWeight: '600', color: '#000'},
  purchaseBtn: {
    backgroundColor: '#FF3B6A',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  purchaseText: {color: '#fff', fontSize: 16, fontWeight: '700'},
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'grey',
    borderWidth: 0.5,
  },

  // Popup styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalBox: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
  },
  modalTitle: {fontSize: 16, fontWeight: '600', marginBottom: 8},
  modalSubTitle: {fontSize: 14, color: '#E94057', marginBottom: 12},
  modalPrice: {fontSize: 14, fontWeight: '500', marginBottom: 12},
  modalText: {fontSize: 13, color: '#555', marginBottom: 8},
  modalSmall: {fontSize: 11, color: '#777', marginBottom: 16},
  confirmBtn: {
    backgroundColor: '#E94057',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 10,
  },
  confirmText: {color: '#fff', fontSize: 16, fontWeight: '700'},
  cancelText: {fontSize: 14, color: '#E94057', textAlign: 'center'},
});
