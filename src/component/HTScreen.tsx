import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

const HTScreen = () => {
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
      <TouchableOpacity style={styles.button}>
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
