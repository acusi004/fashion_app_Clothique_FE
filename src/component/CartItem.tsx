import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Checkbox } from 'react-native-paper';

// Component CartItem nhận các props cần thiết
// @ts-ignore
const CartItem = ({item, selectedItems, quantities, getFullImageUrl, onDecrease, onIncrease,}) => {
    return (
        <View style={styles.cartItem}>
            <Checkbox
                status={selectedItems.includes(item._id) ? "checked" : "unchecked"}
            />
            <Image
                source={{
                    uri:
                        item.variantId?.images && item.variantId.images.length > 0
                            ? getFullImageUrl(item.variantId.images[0])
                            : "https://via.placeholder.com/300",
                }}
                style={styles.productImage}
            />

            <View style={styles.productInfo}>
                <Text style={styles.productTitle}>{item._id}</Text>
                <Text style={styles.productSize}>Size {item.variantId?.size || "N/A"}</Text>
                <Text style={styles.productPrice}>
                    {item.variantId?.price
                        ? ((item.variantId.price * (item.quantity || 1)) || 0).toLocaleString()
                        : "Chưa có giá"} đ
                </Text>
            </View>

            <View style={styles.quantityContainer}>
                <TouchableOpacity
                    onPress={() => onDecrease(item._id)}
                    style={styles.quantityButton}
                >
                    <Image source={require("../Image/minus.png")} style={{ width: 15, height: 15 }} />
                </TouchableOpacity>
                <Text style={styles.quantityText}>
                    {quantities[item._id] || item.quantity}
                </Text>
                <TouchableOpacity
                    onPress={() => onIncrease(item._id)}
                    style={styles.quantityButton}
                >
                    <Image source={require("../Image/add.png")} style={{ width: 15, height: 15 }} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    cartItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        marginBottom: 20,
    },
    productImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
    },
    productInfo: {
        flex: 1,
        marginLeft: 12,
    },
    productTitle: {
        fontSize: 16,
        fontWeight: "bold",
    },
    productSize: {
        fontSize: 14,
        color: "gray",
        marginVertical: 4,
    },
    productPrice: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    quantityContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    quantityButton: {
        width: 25,
        height: 25,
        borderRadius: 12.5,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#000",
        backgroundColor: "#fff",
    },
    quantityText: {
        fontSize: 16,
        marginHorizontal: 12,
    },
});

export default CartItem;
