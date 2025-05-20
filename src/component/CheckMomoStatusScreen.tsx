import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const BASE_URL = 'http://10.0.2.2:5000';

const CheckMomoStatusScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { orderId } = route.params || {};

  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        const response = await fetch(`${BASE_URL}/v1/order/status/${orderId}`);
        const data = await response.json();

        if (response.ok && data?.order?.paymentStatus === 'Paid') {
          navigation.reset({ index: 0, routes: [{ name: 'HTScreen' }] });
        } else {
          navigation.reset({ index: 0, routes: [{ name: 'CancelledPaymentScreen' }] });
        }
      } catch (err) {
        console.error('[CheckMomoStatusScreen] Lỗi:', err);
        navigation.reset({ index: 0, routes: [{ name: 'CancelledPaymentScreen' }] });
      } finally {
        setChecking(false);
      }
    };

    checkPaymentStatus();
  }, [orderId]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#000" />
      <Text style={styles.text}>Đang kiểm tra trạng thái thanh toán...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    color: '#333',
  },
});

export default CheckMomoStatusScreen;
