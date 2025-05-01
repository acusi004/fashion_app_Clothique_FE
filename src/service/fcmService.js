import messaging from '@react-native-firebase/messaging';
import { Alert, Platform } from 'react-native';

class FCMService {
  async requestPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    return enabled;
  }

  async getFcmToken() {
    const hasPermission = await this.requestPermission();
    if (!hasPermission) {
      Alert.alert('Thông báo', 'Bạn cần cấp quyền thông báo để nhận tin nhắn.');
      return null;
    }

    const token = await messaging().getToken();
    console.log('🔥 FCM Token:', token);
    return token;
  }
}

const fcmService = new FCMService();
export default fcmService;