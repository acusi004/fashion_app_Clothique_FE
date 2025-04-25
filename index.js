/**
 * @format
 */

import { AppRegistry } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import App from './App'; // File App.js hoặc App.tsx của bạn
import { name as appName } from './app.json';

// Đăng ký background message handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('[FCM] Background message:', remoteMessage);
  try {
    await notifee.displayNotification({
      title: remoteMessage.notification?.title || 'Thông báo mới',
      body: remoteMessage.notification?.body || 'Bạn có thông báo mới',
      android: {
        channelId: 'default',
        smallIcon: 'ic_launcher',
        pressAction: { id: 'default' },
      },
    });
    console.log('[Notifee] Hiển thị thông báo background thành công');
  } catch (error) {
    console.error('[Notifee] Lỗi hiển thị thông báo background:', error);
  }
});

AppRegistry.registerComponent(appName, () => App);
