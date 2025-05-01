import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import { Checkbox, ActivityIndicator } from 'react-native-paper';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authService from '../service/authService';
import CustomAlert from '../styles/CustomAlert.tsx';

function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertHeader, setAlertHeader] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const showAlert = (header, message) => {
    setAlertHeader(header);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập email và mật khẩu');
      return;
    }

    setLoading(true);
    try {
      // Gọi API login
      const result = await authService.loginUser(username, password);
      console.log('[LoginScreen] Login result:', result);

      // Lưu thông tin đăng nhập
      if (isSelected) {
        await AsyncStorage.setItem('savedUsername', username);
        await AsyncStorage.setItem('savedPassword', password);
      } else {
        await AsyncStorage.removeItem('savedUsername');
        await AsyncStorage.removeItem('savedPassword');
      }
      await AsyncStorage.setItem('hasLoggedInBefore', 'true');
      await AsyncStorage.setItem('token', result.accessToken);

      // Lấy và gửi FCM token
      try {
        const permission = await messaging().requestPermission();
        if (
          permission === messaging.AuthorizationStatus.AUTHORIZED ||
          permission === messaging.AuthorizationStatus.PROVISIONAL
        ) {
          const fcmToken = await messaging().getToken();
          console.log('[FCM] Token:', fcmToken);
          if (fcmToken && result.accessToken) {
            const response = await fetch('http://10.0.2.2:5000/v1/notifications/update-fcm', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${result.accessToken}`,
              },
              body: JSON.stringify({ fcmToken }),
            });
            const responseData = await response.json();
            console.log('[FCM] Kết quả lưu token:', responseData);
            if (!response.ok) {
              throw new Error(responseData.message || 'Lưu token thất bại');
            }
          } else {
            console.warn('[FCM] Thiếu thông tin:', { fcmToken, accessToken: result.accessToken });
          }
        } else {
          console.warn('[FCM] Quyền thông báo bị từ chối');
        }
      } catch (err) {
        console.error('[FCM] Lỗi khi lưu token:', err.message);
      }

      navigation.reset({ index: 0, routes: [{ name: 'BottomNavigation' }] });
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Tài khoản hoặc mật khẩu không đúng';
      showAlert('Đăng nhập thất bại', message);
      console.error('[LoginScreen] Lỗi login:', JSON.stringify(error, null, 2));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadCredentials = async () => {
      try {
        const savedUsername = await AsyncStorage.getItem('savedUsername');
        const savedPassword = await AsyncStorage.getItem('savedPassword');
        if (savedUsername && savedPassword) {
          setUsername(savedUsername);
          setPassword(savedPassword);
          setIsSelected(true);
        }
      } catch (error) {
        console.error('Lỗi khi tải thông tin đăng nhập:', error);
      }
    };
    loadCredentials();

  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../Image/logo.png')} style={styles.logo} />
      </View>
      <Text style={styles.title}>Clothique</Text>
      <View style={styles.inputWrapper}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={username}
            onChangeText={text => setUsername(text)}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputPassword}
            placeholder="Mật khẩu"
            secureTextEntry={secureText}
            value={password}
            onChangeText={text => setPassword(text)}
          />
          <TouchableOpacity
            onPress={() => setSecureText(!secureText)}
            style={styles.eyeIcon}>
            <Image
              source={
                secureText
                  ? require('../Image/visibility.png')
                  : require('../Image/hide.png')
              }
              style={styles.eyeImage}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.checkboxRow}>
          <Checkbox
            status={isSelected ? 'checked' : 'unchecked'}
            onPress={() => setIsSelected(!isSelected)}
          />
          <Text style={styles.checkboxText}>Ghi nhớ đăng nhập</Text>
        </View>
        <View style={styles.footerContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('ChangePassScreen')}>
            <Text style={styles.footerText}>Quên mật khẩu?</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')}>
            <Text style={styles.footerText}>Tạo tài khoản</Text>
          </TouchableOpacity>
        </View>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Đăng nhập</Text>
        </TouchableOpacity>
      )}
      <CustomAlert
        visible={alertVisible}
        header={alertHeader}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: { width: 100, height: 100 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 170 },
  inputWrapper: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#000',
    marginBottom: 40,
  },
  inputContainer: {
    backgroundColor: '#FFFBFB',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 50,
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  input: { flex: 1 },
  inputPassword: { flex: 1 },
  eyeIcon: { padding: 10 },
  eyeImage: { width: 24, height: 24 },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkboxText: { marginLeft: 8 },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 15,
  },
  footerText: { color: '#000', fontSize: 14, fontWeight: 'bold' },
  button: {
    backgroundColor: '#000',
    paddingVertical: 15,
    width: '100%',
    alignItems: 'center',
    borderRadius: 25,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default LoginScreen;