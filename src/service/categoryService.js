import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DetailScreen from '../component/DetailScreen';
import {useState} from 'react';

// Hàm lấy token từ AsyncStorage
export const getToken = async () => {
    try {
        return await AsyncStorage.getItem('accessToken');
    } catch (error) {
        console.error('Lỗi khi lấy token:', error);
        return null;
    }
};


// @ts-ignore
export const getRandomImage = (variants) => {
    if (variants && variants.length > 0) {
        const randomVariant = variants[Math.floor(Math.random() * variants.length)];
        return randomVariant.images && randomVariant.images.length > 0
            ? randomVariant.images[0]
            : null;
    }
    return null;
};


export const handlePressItem = (product) => {
    navigation.navigate(DetailScreen, { product });
};
export const loadProducts = async (categoryID) => {
    const token = await getToken();
    try {
        const response = await axios.get(`http://10.0.2.2:5000/v1/product/search?categoryId=${categoryID}`,{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        return response.data;
    } catch (err) {
        console.error("Lỗi khi lấy sản phẩm Áo:", err);

    }
};
