import React, {useEffect, useState} from 'react';
import {TouchableOpacity, View, Text, Image, StyleSheet, Alert, ToastAndroid} from 'react-native';
import getVariantByProductId from "../service/variantService";

// @ts-ignore
const FavoriteItem = ({ item, onAddToCart, onRemove }) => {
    // Lấy dữ liệu sản phẩm từ trường productId
    const product = item.productId;

    useEffect(() => {
        ToastAndroid.show(`Data: ${product.images}`, ToastAndroid.SHORT);
    }, []);

    return (
        <TouchableOpacity style={styles.container}>
            <View style={styles.btnItem}>
                <Image
                    style={styles.FvImage}

                />
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.FvTitle}>{product.name}</Text>
                <Text style={styles.FvPrice}>{`${product[0]?.price} VND`}</Text>
            </View>
            <View style={styles.actionContainer}>
                <TouchableOpacity style={styles.btnAddToCart} onPress={onAddToCart}>
                    <Image
                        style={styles.btnIconBag}
                        source={require('../Image/shopping-bag.png')}
                    />
                </TouchableOpacity>
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
