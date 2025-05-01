import axios from 'axios';
import tokenService from './tokenService'; // file tokenService.js bạn đã có
import messaging from '@react-native-firebase/messaging';

const API_BASE_URL = 'http://10.0.2.2:5000/v1/auth';

// 🔐 Hàm đăng nhập
const loginUser = async (email, password) => {
  try {
    const fcmToken = await getFcmToken();

    const response = await axios.post(`${API_BASE_URL}/login`, {
      email,
      password,
      fcmToken,
    });
    console.log('📌 Response từ API login:', response.data); // Debug

    const {accessToken, userId} = response.data;
    if (!accessToken) throw new Error('Không nhận được accessToken!');

    await tokenService.setToken(accessToken);

    // Debug kiểm tra lại token sau khi lưu
    const checkToken = await tokenService.getToken();
    console.log('✅ Token sau khi lưu:', checkToken);
    await updateFcmToken(fcmToken, accessToken);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Hàm lấy FCM token
const getFcmToken = async () => {
  try {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (!enabled) {
      console.warn('🙅‍♂️ Người dùng từ chối quyền thông báo');
      return null;
    }

    const token = await messaging().getToken();
    console.log('📲 FCM Token:', token);
    return token;
  } catch (error) {
    console.error('❌ Lỗi khi lấy FCM token:', error);
    return null;
  }
};

// 🔔 Hàm gửi FCM token về server
const updateFcmToken = async (fcmToken, accessToken) => {
  return axios.post(
    'http://10.0.2.2:5000/v1/notifications/update-fcm',
    {fcmToken},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
};

export default {
  loginUser,
  updateFcmToken,
};
