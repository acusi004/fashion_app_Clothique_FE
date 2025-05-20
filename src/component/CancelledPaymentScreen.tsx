import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";

import { useNavigation } from "@react-navigation/native";

function CancelledPaymentScreen  () {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Tiêu đề */}
      <Text style={styles.title}>Thanh Toán Bị Hủy</Text>

      {/* Lottie animation */}
      <LottieView
        source={require("../Animation/Animation - 1747473207246.json")}
        autoPlay
        loop={false}
        style={styles.lottie}
      />

      {/* Thông báo */}
      <Text style={styles.message}>
        Thanh toán bằng phương thức ngân hàng đã bị hủy. Vui lòng thử lại hoặc
        chọn phương thức thanh toán khác.
      </Text>

      {/* Nút quay lại trang chủ */}
      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          navigation.reset({
            index: 0,
            routes: [{ name: "BottomNavigation" }],
          })
        }
      >
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
    color: "#d9534f", // màu đỏ cảnh báo
  },
  lottie: {
    width: 150,
    height: 150,
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
    borderColor: "#d9534f",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#d9534f",
  },
});

export default CancelledPaymentScreen;
