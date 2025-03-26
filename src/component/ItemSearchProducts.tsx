// components/SearchItem.js
import React, {useEffect} from "react";
import {TouchableOpacity, Image, View, Text, StyleSheet, ToastAndroid} from "react-native";

// @ts-ignore
const ItemSearchProducts = ({ item, onPress }) => {

    const product = item;

    const getImage = ()=>{
        const baseUrl = 'http://10.0.2.2:5000';
        return `${baseUrl}${product.variants[0]?.images[0]}`;
    }
    useEffect(() => {
      //   ToastAndroid.show(`Data: ${product.variants[0]?.price.toLocaleString()} VND`, ToastAndroid.SHORT);
    }, []);

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => onPress(item)}
        >
            <Image
                 source={{ uri: getImage() }}
                style={styles.image}
            />
            <View style={styles.textContainer}>
                <Text style={styles.name}>{product.name}</Text>
                {product.variants && product.variants.length > 0 && (
                    <Text style={styles.price}>
                        {product.variants[0].price.toLocaleString()} VND
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
