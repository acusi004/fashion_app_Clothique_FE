// CartItem.js
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import { Checkbox } from "react-native-paper";

// @ts-ignore
const CartItem = ({item, quantity, isSelected, onIncrease, onDecrease, onToggleSelect, getFullImageUrl,}) => {
    return (
        <View style={styles.cartItem}>
            <Checkbox
                status={isSelected ? "checked" : "unchecked"}
                onPress={() => onToggleSelect(item._id)}
            />
            <Image
                source={{
                    uri:
                        item.variantId.images && item.variantId.images.length > 0
                            ? getFullImageUrl(item.variantId.images[0])
                            : "https://via.placeholder.com/300",
                }}
                style={styles.productImage}
            />
            <View style={styles.productInfo}>
                <Text style={styles.productTitle}>{item.productId.name}</Text>
                <Text style={styles.productSize}>Size {item.variantId.size}</Text>
                <Text style={styles.productPrice}>
                    {item.variantId?.price
                        ? (item.variantId.salePrice * item.quantity).toLocaleString()
                        : "Chưa có giá"}{" "}
                    đ
                </Text>
            </View>
            <View style={styles.quantityContainer}>
                <TouchableOpacity
                    onPress={() => {
                        if ((quantity || item.quantity) > 1) {
                            onDecrease(item.productId._id, item._id);
                        }
                    }}
                >
                    <Image
                        source={require("../Image/minus.png")}
                        style={styles.quantityIcon}
                    />
                </TouchableOpacity>
                <Text style={styles.quantityText}>{quantity || item.quantity}</Text>
                <TouchableOpacity
                    onPress={() => onIncrease(item.productId._id, item._id)}
                    style={styles.quantityButton}
                >
                    <Image
                        source={require("../Image/add.png")}
                        style={styles.quantityIcon}
                    />
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
        padding: 8,
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
    quantityIcon: {
        width: 15,
        height: 15,
    },
    quantityText: {
        fontSize: 16,
        marginHorizontal: 12,
    },
});

export default CartItem;
