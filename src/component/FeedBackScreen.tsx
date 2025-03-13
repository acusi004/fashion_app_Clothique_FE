import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import Stars from "react-native-stars";
import { useNavigation } from "@react-navigation/native";

const FeedBackScreen = () => {
  const navigation = useNavigation(); 

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require("../img/arrow.png")} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đánh giá sản phẩm</Text>
      </View>

      {/* Card Feedback */}
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <Image
            source={require("../img/product1.jpg")} // Ảnh sản phẩm
            style={styles.productImage}
          />
          <View style={styles.productInfo}>
            <Text style={styles.productName}>Áo</Text>
            <Text style={styles.productPrice}>$ 50.00</Text>
            <Stars
              default={5}
              count={5}
              half={false}
              fullStar={<Ionicons name="star" size={24} color="#FFD700" />}
              emptyStar={<Ionicons name="star-outline" size={24} color="#FFD700" />}
            />
            <Text style={styles.reviewText}>Áo đẹp quá</Text>
          </View>
          <Text style={styles.reviewDate}>20/03/2020</Text>
        </View>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backIcon: {
    width: 20,
    height: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
    padding: 16,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
  },
  productInfo: {
    flex: 1,
    marginLeft: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  productPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
  },
  reviewText: {
    fontSize: 14,
    color: "#555",
  },
  reviewDate: {
    fontSize: 12,
    color: "#888",
  },
});

export default FeedBackScreen;
