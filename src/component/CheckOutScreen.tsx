import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { RadioButton } from "react-native-paper";

const CheckOutScreen = ({ navigation }) => {
  const [paymentMethod, setPaymentMethod] = useState("zalopay");

  return (
    <View style={styles.container}>
      {/* Nút quay lại */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
       <Image source={require('../img/arrow.png')} style={{ width: 20, height: 20 }} />
      </TouchableOpacity>

      <Text style={styles.title}>Thanh toán</Text>

      {/* Địa chỉ giao hàng */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Địa chỉ giao hàng</Text>
        <View style={styles.addressBox}>
          <Text style={styles.name}>Nguyen Van A</Text>
          <Text style={styles.address}>CD Fpt Polytechnic</Text>
        </View>
      </View>

      {/* Phương thức thanh toán */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
        <View style={styles.paymentBox}>
          <RadioButton.Group
            onValueChange={(newValue) => setPaymentMethod(newValue)}
            value={paymentMethod}
          >
            <View style={styles.radioRow}>
            <Image
            source={require("../img/zalopay.png")}
            style={styles.zalopay}
          />
              <RadioButton value="zalopay" color="#007AFF" />
              <Text>ZaloPay</Text>
            </View>
            <View style={styles.radioRow}>
            <Image
            source={require("../img/cod.png")}
            style={styles.cod}/>
              <RadioButton value="cod" color="#007AFF" />
              <Text>Thanh toán khi nhận hàng</Text>
            </View>
          </RadioButton.Group>
        </View>
      </View>

      {/* Phương thức giao hàng */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Phương thức giao hàng</Text>
        <View style={styles.shippingBox}>
          <Image
            source={require("../img/ghtk.png")}
            style={styles.shippingIcon}
          />
          <Text>Giao hàng tiết kiệm (2-3 days)</Text>
        </View>
      </View>

      {/* Giá và phí vận chuyển */}
      <View style={styles.priceBox}>
        <Text style={styles.priceText}>Giá:</Text>
        <Text style={styles.priceValue}>$95</Text>
      </View>
      <View style={styles.priceBox}>
        <Text style={styles.priceText}>Phí Vận Chuyển:</Text>
        <Text style={styles.priceValue}>$5</Text>
      </View>
      <View style={styles.priceBox}>
        <Text style={styles.totalText}>Tổng:</Text>
        <Text style={styles.totalValue}>$100</Text>
      </View>

      {/* Nút Đặt Hàng */}
      <TouchableOpacity style={styles.orderButton}>
        <Text style={styles.orderButtonText}>Đặt hàng</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  backButton: {
    position: "absolute",
    top: 15,
    left: 15,
    zIndex: 10,
  },
  backIcon: {
    width: 20,
    height: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  addressBox: {
    backgroundColor: "#F5F5F5",
    padding: 10,
    borderRadius: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  address: {
    fontSize: 14,
    color: "gray",
  },
  paymentBox: {
    backgroundColor: "#F5F5F5",
    padding: 10,
    borderRadius: 8,
  },
  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  shippingBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    padding: 10,
    borderRadius: 8,
  },
  shippingIcon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  zalopay:{
    width: 30,
    height: 30,
    marginRight: 10,
  },
  cod:{
    width: 30,
    height: 30,
    marginRight: 10,
  },
  priceBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  priceText: {
    fontSize: 16,
  },
  priceValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007AFF",
  },
  orderButton: {
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  orderButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CheckOutScreen;