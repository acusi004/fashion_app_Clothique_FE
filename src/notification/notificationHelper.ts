import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const requestUserPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('✅ Quyền nhận thông báo đã được cấp');
    getFcmTokenAndSave();
  } else {
    console.log('❌ Người dùng chưa cấp quyền thông báo');
  }
};

// Lấy và lưu FCM token nếu chưa có
const getFcmTokenAndSave = async () => {
  try {
    const existingToken = await AsyncStorage.getItem('fcmToken');
    if (!existingToken) {
      const fcmToken = await messaging().getToken();
      if (fcmToken) {
        await AsyncStorage.setItem('fcmToken', fcmToken);
        console.log('✅ FCM Token mới:', fcmToken);
      }
    } else {
      console.log('📦 FCM Token đã tồn tại:', existingToken);
    }
  } catch (error) {
    console.error('❌ Lỗi khi lấy/lưu FCM token:', error);
  }
};
