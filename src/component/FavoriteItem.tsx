import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View, Text, Image, StyleSheet, Alert, ToastAndroid } from 'react-native';
import getVariantByProductId from "../service/variantService";

// @ts-ignore
const FavoriteItem = ({ item, onAddToCart, onRemove, onPress }) => {
    // Lấy dữ liệu sản phẩm từ trường productId
    const product = item.productId;

    const getImage = ()=>{
        const baseUrl = 'http://10.0.2.2:5000';
        return `${baseUrl}${product.variants[0]?.images[0]}`;
    }

    useEffect(() => {
       // ToastAndroid.show(`Data: ${ product.variants[0]?.images[0]}`, ToastAndroid.SHORT);
    }, []);

    return (
        <TouchableOpacity style={styles.container} onPress={() => onPress(product)}>
            <View style={styles.btnItem}>
                <Image
                    style={styles.FvImage}
                    source={{
                        uri: product?.variants?.[0]?.images?.[0]
                            ? `http://10.0.2.2:5000${product.variants[0].images[0]}`
                            : 'https://i.pinimg.com/564x/7b/12/2b/7b122bfb0391eea8a55c6b331471b7db.jpg'
                    }}
                />
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.FvTitle}>{product.name}</Text>
                <Text style={styles.FvPrice}>{`${product?.variants?.[0]?.price || 0} VND`}</Text>

                <Text style={styles.FvPrice}>{`${product.variants[0]?.price.toLocaleString()} VND`}</Text>
            </View>
            <View style={styles.actionContainer}>

                <TouchableOpacity style={styles.btnDelete} onPress={onRemove}>
                    <Image
                        style={styles.btnIconBag}
                        source={require('../Image/remove.png')}
                    />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        alignItems: 'center',
        marginBottom: 10,
        elevation: 2,
    },
    btnItem: {
        marginRight: 10,
    },
    FvImage: {
        width: 80,
        height: 80,
        borderRadius: 10,
    },
    infoContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    FvTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    FvPrice: {
        fontSize: 14,
        color: '#666',
    },
    actionContainer: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    btnAddToCart: {
        marginBottom: 10,
    },
    btnDelete: {},
    btnIconBag: {
        width: 24,
        height: 24,
    },
});

export default FavoriteItem;
