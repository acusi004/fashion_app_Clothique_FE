import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

const HTScreen = () => {
  
      const handleLogin = async () => {
          console.log('Username:', username);  // Log giá trị username
          console.log('Password:', password);  // Log giá trị password
  
          // Kiểm tra xem username và password có hợp lệ hay không
          if (!username || username.trim() === '') {
              Alert.alert('Lỗi', 'Vui lòng nhập email');
              return;
          }else  if (!password || password.trim() === '') {
              Alert.alert('Lỗi', 'Vui lòng nhập mật khẩu');
              console.log('pass'+password)
              return;
          }else {
              try {
                  // Gọi hàm loginUser từ authService
                  const result = await authService.loginUser(username, password);
                  // Nếu thành công điều hướng sang màn hình Home
                  Alert.alert('Đăng nhập thành công', `Chào, ${result.username?.full_name || 'bạn'}`);
                  // Ví dụ điều hướng:
                  navigation.navigate('BottomNavigation');
              } catch (error) {
                  // Tuỳ vào error trả về từ backend, bạn hiển thị phù hợp
                  Alert.alert('Đăng nhập thất bại');
  
                  console.error(error);
              }
          }
          
  const navigation = useNavigation(); // ✅ Đúng! Gọi hook bên trong function component
  return (
    <View style={styles.container}>
      {/* Tiêu đề */}
      <Text style={styles.title}>Thành Công!</Text>

      {/* Icon Check */}
      <View >
        <Image source={require("../Image/checked.png")} style={styles.icon} />
      </View>

      {/* Nội dung thông báo */}
      <Text style={styles.message}>
        Đơn hàng của bạn sẽ được giao sớm. Cảm ơn bạn đã chọn ứng dụng của chúng tôi!
      </Text>

      {/* Nút quay lại trang chủ */}
      <TouchableOpacity style={styles.button}  
      onPress={() => navigation.navigate("HomeScreen")}>
        <Text style={styles.buttonText}>Trở lại trang chủ</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },

  icon: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    marginBottom: 20,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    color: "#555",
    marginBottom: 30,
  },
  button: {
    borderWidth: 1,
    borderColor: "#000",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default HTScreen;
