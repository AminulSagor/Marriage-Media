import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const PaymentScreen = ({navigation}) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  // Error states
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let newErrors = {};

    // Card number must be 16 digits
    if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) {
      newErrors.cardNumber = 'Enter a valid 16-digit card number';
    }

    // Expiry MM/YY
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
      newErrors.expiry = 'Enter expiry as MM/YY';
    }

    // CVV 3–4 digits
    if (!/^\d{3,4}$/.test(cvv)) {
      newErrors.cvv = 'Enter a valid CVV';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handlePurchase = () => {
    Alert.alert('Success', 'Payment info is valid ✅');
    navigation.navigate('BottomTabs');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}>
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={22} color="#000" />
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.title}>Add Credit or Debit Card</Text>

        {/* Card Number */}
        <View style={styles.inputWrapper}>
          <Icon name="card-outline" size={22} color="#555" />
          <TextInput
            style={styles.input}
            placeholder="Card number"
            placeholderTextColor="#999"
            keyboardType="numeric"
            value={cardNumber}
            onChangeText={setCardNumber}
            maxLength={16}
          />
          <Icon name="help-circle-outline" size={20} color="#555" />
        </View>
        {errors.cardNumber && (
          <Text style={styles.error}>{errors.cardNumber}</Text>
        )}

        {/* Expiry + CVV */}
        <View style={styles.row}>
          <View style={[styles.inputWrapper, {flex: 1, marginRight: 10}]}>
            <TextInput
              style={styles.input}
              placeholder="MM/YY"
              placeholderTextColor="#999"
              keyboardType="numeric"
              value={expiry}
              onChangeText={setExpiry}
              maxLength={5}
            />
          </View>
          <View style={[styles.inputWrapper, {flex: 1}]}>
            <TextInput
              style={styles.input}
              placeholder="Security code"
              placeholderTextColor="#999"
              keyboardType="numeric"
              value={cvv}
              onChangeText={setCvv}
              maxLength={4}
            />
            <Icon name="help-circle-outline" size={20} color="#555" />
          </View>
        </View>
        {errors.expiry && <Text style={styles.error}>{errors.expiry}</Text>}
        {errors.cvv && <Text style={styles.error}>{errors.cvv}</Text>}

        {/* User Info */}
        <View style={styles.userInfo}>
          <Text style={styles.userName}>Mujtaba</Text>
          <Text style={styles.userAddress}>Decker Hill</Text>
          <Text style={styles.userAddress}>120</Text>
          <Text style={styles.userAddress}>Ajax ON L1XM04</Text>
          <Text style={[styles.userAddress, {fontWeight: 'bold'}]}>Canada</Text>
        </View>

        {/* Terms */}
        <Text style={styles.terms}>
          By continuing you agree to the Google Payments Terms of Service. The
          Privacy Notice describes how your data is handled.
        </Text>

        {/* Subscription Info */}
        <View style={styles.subscriptionRow}>
          <Text style={styles.planTitle}>AROOSI</Text>
          <View style={{alignItems: 'flex-end'}}>
            <Text style={styles.planPrice}>$50/month</Text>
            <Text style={styles.planTax}>includes tax of $2.47</Text>
          </View>
        </View>
        <Text style={styles.planSubtitle}>1 month vip</Text>

        {/* Purchase Button */}
        <TouchableOpacity style={styles.purchaseBtn} onPress={handlePurchase}>
          <Text style={styles.purchaseText}>Purchase</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: '#fff'},
  container: {padding: 20},
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {fontSize: 20, fontWeight: '600', marginBottom: 20, color: '#000'},

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    fontSize: 14,
    marginHorizontal: 8,
    color: '#000',
  },
  row: {flexDirection: 'row', marginBottom: 10},

  userInfo: {marginVertical: 20},
  userName: {fontSize: 16, fontWeight: '600', marginBottom: 4},
  userAddress: {fontSize: 14, color: '#555', marginBottom: 2},

  terms: {
    fontSize: 12,
    color: '#777',
    marginBottom: 20,
    lineHeight: 18,
  },

  subscriptionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  planTitle: {fontSize: 12, fontWeight: '700', color: '#E94057'},
  planSubtitle: {fontSize: 13, fontWeight: '600', marginBottom: 20},
  planPrice: {fontSize: 14, fontWeight: '600', color: '#000'},
  planTax: {fontSize: 12, color: '#777'},

  purchaseBtn: {
    backgroundColor: '#FF3B6A',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
  },
  purchaseText: {color: '#fff', fontSize: 16, fontWeight: '700'},

  error: {
    color: 'red',
    fontSize: 12,
    marginBottom: 6,
    marginLeft: 4,
  },
});
