import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import messaging from '@react-native-firebase/messaging';
import notifee, { EventType, AndroidImportance, NotificationEventType, AndroidStyle } from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WelcomeScreen from './src/component/WelcomeScreen.tsx';
import LoginScreen from './src/component/LoginScreen.tsx';
import RegisterScreen from './src/component/RegisterScreen.tsx';
import HomeScreen from './src/component/HomeScreen.tsx';
import BottomNavigation from './src/navigation/BottomNavigation.tsx';
import FavoriteScreen from './src/component/FavoriteScreen.tsx';
import NotificationScreen from './src/component/NotificationScreen.tsx';
import ProfileScreen from './src/component/ProfileScreen.tsx';
import CartScreen from './src/component/CartScreen.tsx';
import SuccessScreen from './src/component/SuccessScreen.tsx';
import ChoseScreen from './src/component/ChoseScreen.tsx';
import AddressScreen from './src/component/AddressScreen.tsx';
import EditProfileScreen from './src/component/EditProfileScreen.tsx';
import CheckoutScreen from './src/component/CheckOutScreen.tsx';
import FeedBackScreen from './src/component/FeedBackScreen.tsx';
import HTScreen from './src/component/HTScreen.tsx';
import DetailScreen from './src/component/DetailScreen.tsx';
import PaymentScreen from './src/component/PaymentScreen.tsx';
import ChoiceAddress from './src/component/ChoiceAddress.tsx';
import ResetPasswordScreen from './src/component/ResetPasswordScreen.tsx';
import ChangePassScreen from './src/component/ChangePassScreen.tsx';
import VerifyOtpScreen from './src/component/VerifyOtpScreen.tsx';
import SearchScreen from './src/component/SearchScreen.tsx';
import SettingScreen from './src/component/SettingScreen.tsx';
import ChatScreen from './src/component/ChatScreen.tsx';
import OrderScreen from './src/component/OrderScreen.tsx';
import OrderDetailTabs from './src/navigation/OrderDetailTabs.tsx';
import ChoXacNhan from './src/component/OrderScreens/ChoXacNhan.tsx';
import ChoGiaoHang from './src/component/OrderScreens/ChoGiaoHang.tsx';
import ChoThanhToan from './src/component/OrderScreens/ChoThanhToan.tsx';
import DangChuanBiHang from './src/component/OrderScreens/DangChuanBiHang.tsx';
import DaHuy from './src/component/OrderScreens/DaHuy.tsx';
import DaGiaoHang from './src/component/OrderScreens/DaGiaoHang.tsx';
import RatingScreen from './src/component/RatingScreen.tsx';
import FailedScreen from './src/component/FailedScreen.tsx';
import DetailOrderScreen from './src/component/OrderScreens/DetailOrderScreen.tsx';
import OrderRating from './src/component/OrderScreens/OrderRating.tsx';
import OrderRated from './src/component/OrderScreens/OrderRated.tsx';

function App() {
  const Stack = createNativeStackNavigator();
  const navigationRef = React.useRef(null);

  async function requestUserPermission() {
    try {
      const authStatus = await messaging().requestPermission({
        alert: true,
        badge: true,
        sound: true,
      });
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      if (enabled) {
        console.log('[FCM] Authorization status:', authStatus);
        return true;
      } else {
        console.warn('[FCM] Quyền thông báo bị từ chối:', authStatus);
        Alert.alert('Quyền thông báo', 'Vui lòng bật thông báo trong cài đặt để nhận thông báo đẩy.');
        return false;
      }
    } catch (error) {
      console.error('[FCM] Lỗi khi yêu cầu quyền:', error);
      return false;
    }
  }

  async function getToken() {
    try {
      const fcmToken = await messaging().getToken();
      if (fcmToken) {
        console.log('[FCM] Token:', fcmToken);
        const token = await AsyncStorage.getItem('token');
        if (token) {
          const response = await fetch('http://10.0.2.2:5000/v1/notifications/update-fcm', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ fcmToken }),
          });
          const responseData = await response.json();
          console.log('[FCM] Kết quả lưu token:', responseData);
          if (!response.ok) {
            console.error('[FCM] Lưu token thất bại:', responseData.message);
          }
        }
      } else {
        console.warn('[FCM] Không lấy được token');
      }
    } catch (error) {
      console.error('[FCM] Lỗi khi lấy token:', error);
    }
  }

  useEffect(() => {
    const initializeFCM = async () => {
      const permissionGranted = await requestUserPermission();
      if (permissionGranted) {
        await getToken();
        await notifee.requestPermission();
        await notifee.createChannel({
          id: 'default',
          name: 'Default Channel',
          importance: AndroidImportance.HIGH,
        });
      }
    };
    initializeFCM();

    // Xử lý thông báo khi ứng dụng ở foreground
    const unsubscribeMessage = messaging().onMessage(async remoteMessage => {
      console.log('[FCM] Nhận thông báo:', JSON.stringify(remoteMessage, null, 2));
      try {
        await notifee.displayNotification({
          title: remoteMessage.notification?.title || 'Thông báo mới',
          body: remoteMessage.notification?.body || 'Bạn có thông báo mới',
          android: {
            channelId: 'default',
            largeIcon :"anhlogo",
            // style: {
            //   type: AndroidStyle.,
            //   picture: "anhlogo",
            // },
            showTimestamp: true, // Hiển thị thời gian gửi thông báo
            pressAction: { id: 'default' },
          },
        });
        console.log('[Notifee] Hiển thị thông báo thành công');
      } catch (error) {
        console.error('[Notifee] Lỗi hiển thị thông báo:', error);
      }
    });

    // Xử lý khi người dùng nhấn thông báo
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('[FCM] Người dùng nhấn thông báo:', remoteMessage);
      if (remoteMessage?.data?.type === 'order' && remoteMessage?.data?.orderId) {
        navigationRef.current?.navigate('DetailOrderScreen', {
          orderId: remoteMessage.data.orderId,
        });
      } else {
        navigationRef.current?.reset({
          index: 2, // Màn hình đầu tiên sau khi reset
          routes: [{ name: 'BottomNavigation' }], // Điều hướng tới HTScreen
      })
      }
    });

    // Xử lý khi ứng dụng được mở từ thông báo (trạng thái quit)
    messaging().getInitialNotification().then(remoteMessage => {
      if (remoteMessage) {
        console.log('[FCM] Mở ứng dụng từ thông báo:', remoteMessage);
        if (remoteMessage?.data?.type === 'order' && remoteMessage?.data?.orderId) {
          navigationRef.current?.navigate('DetailOrderScreen', {
            orderId: remoteMessage.data.orderId,
          });
        } else {
          navigationRef.current?.reset({
            index: 2, // Màn hình đầu tiên sau khi reset
            routes: [{ name: 'BottomNavigation' }], // Điều hướng tới HTScreen
        })
        }
      }
    });

    // Xử lý sự kiện Notifee khi nhấn thông báo
    notifee.onForegroundEvent(({ type, detail }: { type: NotificationEventType; detail: any }) => {
      console.log('[Notifee] Foreground Event:', type, detail);
      console.log('[Notifee] EventType:', EventType); // Thêm log để kiểm tra
      if (type === EventType.PRESS) {
        console.log('[Notifee] Người dùng nhấn thông báo:', detail.notification);
        if (detail.notification?.data?.type === 'order' && detail.notification?.data?.orderId) {
          navigationRef.current?.navigate('DetailOrderScreen', {
            orderId: detail.notification.data.orderId,
          });
        } else {
          navigationRef.current?.reset({
            index: 2, // Màn hình đầu tiên sau khi reset
            routes: [{ name: 'BottomNavigation' }], // Điều hướng tới HTScreen
        })
        }
      }
    });

    return () => {
      unsubscribeMessage();
    };
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName="WelcomeScreen">
        <Stack.Screen
          name="WelcomeScreen"
          options={{ headerShown: false }}
          component={WelcomeScreen}
        />
        <Stack.Screen
          name="ChoiceAddress"
          options={{ headerTitle: '' }}
          component={ChoiceAddress}
        />
        <Stack.Screen
          name="PaymentScreen"
          options={{ headerShown: false }}
          component={PaymentScreen}
        />
        <Stack.Screen
          name="ChoseScreen"
          options={{ headerShown: false }}
          component={ChoseScreen}
        />
        <Stack.Screen
          name="CheckoutScreen"
          options={{ headerShown: false }}
          component={CheckoutScreen}
        />
        <Stack.Screen
          name="FeedBackScreen"
          options={{ headerShown: false }}
          component={FeedBackScreen}
        />
        <Stack.Screen
          name="HTScreen"
          options={{ headerShown: false }}
          component={HTScreen}
        />
        <Stack.Screen
          name="LoginScreen"
          options={{ headerShown: false }}
          component={LoginScreen}
        />
        <Stack.Screen
          name="AddressScreen"
          options={{ title: 'Address' }}
          component={AddressScreen}
        />
        <Stack.Screen
          name="EditProfileScreen"
          options={{ headerShown: false }}
          component={EditProfileScreen}
        />
        <Stack.Screen
          name="RegisterScreen"
          options={{ headerShown: false }}
          component={RegisterScreen}
        />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen
          name="BottomNavigation"
          options={{ headerShown: false }}
          component={BottomNavigation}
        />
        <Stack.Screen
          name="FavoriteScreen"
          options={{ headerShown: false }}
          component={FavoriteScreen}
        />
        <Stack.Screen
          name="NotificationScreen"
          options={{ headerShown: false }}
          component={NotificationScreen}
        />
        <Stack.Screen
          name="ProfileScreen"
          options={{ headerShown: false }}
          component={ProfileScreen}
        />
        <Stack.Screen
          name="DetailScreen"
          options={{ headerShown: false }}
          component={DetailScreen}
        />
        <Stack.Screen
          name="ResetPasswordScreen"
          options={{ headerTitle: 'Đổi Mật Khẩu', headerTitleAlign: 'center' }}
          component={ResetPasswordScreen}
        />
        <Stack.Screen
          name="ChangePassScreen"
          options={{ headerTitle: 'Đổi Mật Khẩu', headerTitleAlign: 'center' }}
          component={ChangePassScreen}
        />
        <Stack.Screen
          name="VerifyOtpScreen"
          options={{ headerTitle: 'Đổi Mật Khẩu', headerTitleAlign: 'center' }}
          component={VerifyOtpScreen}
        />
        <Stack.Screen
          name="SearchScreen"
          options={{ headerShown: false }}
          component={SearchScreen}
        />
        <Stack.Screen
          name="OrderScreen"
          options={{ headerTitle: 'Đơn hàng', headerTitleAlign: 'center' }}
          component={OrderScreen}
        />
        <Stack.Screen
          name="SettingScreen"
          options={{ headerShown: false }}
          component={SettingScreen}
        />
        <Stack.Screen
          name="ChatScreen"
          options={{ headerShown: false }}
          component={ChatScreen}
        />
        <Stack.Screen
          name="OrderDetailTabs"
          options={{ headerTitle: 'Đơn hàng', headerTitleAlign: 'center' }}
          component={OrderDetailTabs}
        />
        <Stack.Screen
          name="OrderRating"
          options={{ headerTitle: 'Đánh giá sản phẩm', headerTitleAlign: 'center' }}
          component={OrderRating}
        />
        <Stack.Screen
          name="CartScreen"
          options={{ headerTitle: 'Giỏ hàng', headerTitleAlign: 'center' }}
          component={CartScreen}
        />
        <Stack.Screen
          name="SuccessScreen"
          options={{ headerShown: false }}
          component={SuccessScreen}
        />
        <Stack.Screen
          name="DaHuy"
          options={{ headerShown: false }}
          component={DaHuy}
        />
        <Stack.Screen
          name="DangChuanBiHang"
          options={{ headerShown: false }}
          component={DangChuanBiHang}
        />
        <Stack.Screen
          name="ChoThanhToan"
          options={{ headerShown: false }}
          component={ChoThanhToan}
        />
        <Stack.Screen
          name="ChoGiaoHang"
          options={{ headerShown: false }}
          component={ChoGiaoHang}
        />
        <Stack.Screen
          name="ChoXacNhan"
          options={{ headerShown: false }}
          component={ChoXacNhan}
        />
        <Stack.Screen
          name="DaGiaoHang"
          options={{ headerShown: false }}
          component={DaGiaoHang}
        />
        <Stack.Screen
          name="RatingScreen"
          options={{ headerShown: false }}
          component={RatingScreen}
        />
        <Stack.Screen
          name="FailedScreen"
          options={{ headerShown: false }}
          component={FailedScreen}
        />
        <Stack.Screen
          name="DetailOrderScreen"
          options={{ headerTitle: 'Chi tiết đơn hàng' }}
          component={DetailOrderScreen}
        />
        <Stack.Screen
          name="OrderRated"
          options={{ headerTitle: 'Sản phẩm đã đánh giá' }}
          component={OrderRated}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;