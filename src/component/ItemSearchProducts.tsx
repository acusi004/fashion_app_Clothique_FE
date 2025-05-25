// components/SearchItem.js
import React, {useEffect} from "react";
import {TouchableOpacity, Image, View, Text, StyleSheet, ToastAndroid} from "react-native";

// @ts-ignore
const ItemSearchProducts = ({ item, onPress }) => {

    const product = item;

    const getImage = () => {
        const baseUrl = 'http://10.0.2.2:5000';
        const imagePath = product?.variants?.[0]?.images?.[0];

        if (imagePath) {
            return `${baseUrl}${imagePath}`;
        }

        // Nếu không có ảnh, có thể trả về ảnh mặc định
        return 'https://via.placeholder.com/80';
    };

    useEffect(() => {
        console.log( product)

      //   ToastAndroid.show(`Data: ${product.variants[0]?.price.toLocaleString()} VND`, ToastAndroid.SHORT);
    }, []);

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => onPress(item)}
        >
            <Image
                 source={{ uri: getImage() || require('../Image/image1.png') }}
                style={styles.image}
            />
            <View style={styles.textContainer}>
                <Text style={styles.name}>{product.name}</Text>
                {product.variants && product.variants.length > 0 && (
                    <Text style={styles.price}>
                        {product.variants[0].salePrice} VND
                    </Text>
                )}
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
        padding:10
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
