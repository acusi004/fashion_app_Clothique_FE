import { useNavigation, useRoute } from "@react-navigation/native";
import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, SafeAreaView, FlatList } from "react-native";
import { RadioButton } from "react-native-paper";

const CheckoutScreen = () => {
    const [paymentMethod, setPaymentMethod] = React.useState("ZaloPay");
    const navigation = useNavigation();
    const route = useRoute();
    const { selectedProducts } = route.params || { selectedProducts: [] };
    const BASE_URL = "http://10.0.2.2:5000"; // API local
   
    const getFullImageUrl = (imagePath) => {
        return imagePath.startsWith("/uploads/") ? `${BASE_URL}${imagePath}` : imagePath;
    };
    return (
        <SafeAreaView style={styles.container}>
             <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
             {/* <FlatList
    data={selectedProducts}
    keyExtractor={(item) => item._id.toString()}
    renderItem={({ item }) => (
        <View style={styles.productItem}>
            <Image
                source={{
                    uri: item.variantId.images?.length > 0
                        ? getFullImageUrl(item.variantId.images[0])
                        : "https://via.placeholder.com/100"
                }}
                style={styles.productImage}
            />
        </View>
    )}
/> */}

            </TouchableOpacity>
            <Text style={styles.header}>Thanh toán</Text>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Địa chỉ giao hàng</Text>
                <View style={styles.addressBox}>
                    <Text style={styles.addressName}>Nguyen Van A</Text>
                    <Text style={styles.addressDetail}>CD Fpt Polytechnic</Text>
                </View>
            </View>
            
            {selectedProducts.length > 0 ? (
                <FlatList
                    data={selectedProducts}
                    keyExtractor={(item) => item._id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.productItem}>
                            <Image
                                source={{
                                    uri: item.variantId.images?.length > 0
                                        ? item.variantId.images[0]
                                        : "https://via.placeholder.com/100"
                                }}
                                style={styles.productImage}
                            />
                            <View style={styles.productInfo}>
                                <Text style={styles.productName}>{item.productId.name}</Text>
                                <Text style={styles.productSize}>Size: {item.variantId.size}</Text>
                                <Text style={styles.productPrice}>
                                    {item.variantId?.price ? (item.variantId.price * item.quantity).toLocaleString() : "Chưa có giá"} đ
                                </Text>
                                <Text style={styles.productQuantity}>Số lượng: {item.quantity}</Text>
                            </View>
                        </View>
                    )}
                />
            ) : (
                <Text style={styles.emptyText}>Không có sản phẩm nào được chọn.</Text>
            )}

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
                <View style={styles.paymentOption}>
                    <RadioButton.Android
                        value="ZaloPay"
                        status={paymentMethod === "ZaloPay" ? "checked" : "unchecked"}
                        onPress={() => setPaymentMethod("ZaloPay")}
                    />
                    <Text style={styles.paymentText}>ZaloPay</Text>
                </View>
                <View style={styles.paymentOption}>
                    <RadioButton.Android
                        value="COD"
                        status={paymentMethod === "COD" ? "checked" : "unchecked"}
                        onPress={() => setPaymentMethod("COD")}
                    />
                    <Text style={styles.paymentText}>Thanh toán khi nhận hàng</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Phương thức giao hàng</Text>
                <View style={styles.shippingBox}>
                    <Image source={require("../Image/giaohangtietkiem.png")} style={styles.shippingIcon} />
                    <Text style={styles.shippingText}>Giao hàng tiết kiệm (2-3 days)</Text>
                </View>
            </View>

            <View style={styles.priceSection}>
                <View style={styles.priceRow}>
                    <Text style={styles.priceLabel}>Giá:</Text>
                    <Text style={styles.priceValue}>$95</Text>
                </View>
                <View style={styles.priceRow}>
                    <Text style={styles.priceLabel}>Phí Vận Chuyển:</Text>
                    <Text style={styles.priceValue}>$5</Text>
                </View>
                <View style={styles.priceRowTotal}>
                    <Text style={styles.totalLabel}>Tổng:</Text>
                    <Text style={styles.totalValue}>$100</Text>
                </View>
            </View>

            <TouchableOpacity style={styles.orderButton}>
                <Text style={styles.orderText}>Đặt hàng</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    backButton: { paddingTop: 16 },
    backText: { fontSize: 16, fontWeight: "bold" },
    container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 16, paddingBottom: 20 },
    header: { fontSize: 20, fontWeight: "bold", textAlign: "center", marginVertical: 16 },
    section: { marginBottom: 16 },
    sectionTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 8 },
    addressBox: { backgroundColor: "#f5f5f5", padding: 12, borderRadius: 8 },
    addressName: { fontSize: 16, fontWeight: "bold" },
    addressDetail: { fontSize: 14, color: "gray" },
    paymentOption: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
    paymentText: { fontSize: 16 },
    shippingBox: { flexDirection: "row", alignItems: "center", backgroundColor: "#f5f5f5", padding: 12, borderRadius: 8 },
    shippingIcon: { width: 40, height: 40, marginRight: 10 },
    shippingText: { fontSize: 16 },
    priceSection: { padding: 16, backgroundColor: "#f5f5f5", borderRadius: 8 },
    priceRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
    priceRowTotal: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
    priceLabel: { fontSize: 16, color: "gray" },
    priceValue: { fontSize: 16 },
    totalLabel: { fontSize: 18, fontWeight: "bold" },
    totalValue: { fontSize: 18, fontWeight: "bold" },
    orderButton: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "black", padding: 16, alignItems: "center", margin: 16, borderRadius: 8 },
    orderText: { color: "white", fontSize: 16, fontWeight: "bold" },
    productItem: { flexDirection: "row", alignItems: "center", marginBottom: 16, backgroundColor: "#f9f9f9", padding: 10, borderRadius: 8 },
    productImage: { width: 80, height: 80, borderRadius: 8, marginRight: 10 },
    productInfo: { flex: 1 },
    productName: { fontSize: 16, fontWeight: "bold" },
    productSize: { fontSize: 14, color: "gray" },
    productPrice: { fontSize: 16, fontWeight: "bold", color: "#333" },
    productQuantity: { fontSize: 14, color: "#666" },
    emptyText: { fontSize: 16, textAlign: "center", marginTop: 20, color: "gray" }
});

export default CheckoutScreen;
