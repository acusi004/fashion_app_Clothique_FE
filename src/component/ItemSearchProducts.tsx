// components/SearchItem.js
import React from "react";
import { TouchableOpacity, Image, View, Text, StyleSheet } from "react-native";

// @ts-ignore
const ItemSearchProducts = ({ item, onPress }) => {

    const product = item.productId;

    const getImage = ()=>{
        const baseUrl = 'http://10.0.2.2:5000';
        return `${baseUrl}${product.variants[0]?.images[0]}`;
    }

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => onPress(item)}
        >
            <Image
                // source={{ uri: getImage() }}
                style={styles.image}
            />
            <View style={styles.textContainer}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.price}> </Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: "#ccc",
        alignItems: "center",
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 10,
    },
    textContainer: {
        marginLeft: 10,
    },
    name: {
        fontSize: 16,
        fontWeight: "bold",
    },
    price: {
        fontSize: 14,
        color: "#27ae60",
        marginTop: 4,
    },
});

export default ItemSearchProducts;
