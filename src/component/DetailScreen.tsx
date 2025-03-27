import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import axios from 'axios';
import tokenService from '../service/tokenService';

// @ts-ignore
const DetailScreen = ({ route, navigation }) => {
    // Lấy dữ liệu sản phẩm được truyền qua navigation
    const { product } = route.params;
    const [quantity, setQuantity] = useState(1);

    // Đảm bảo product.variants luôn là một mảng hợp lệ
    const variantsList = product.variants || [];

    // State cho biến thể hiện tại, kích cỡ (theo variant hiện tại), tồn kho và kích cỡ được chọn
    const [currentVariant, setCurrentVariant] = useState(variantsList[0] || {});
    const [sizes, setSizes] = useState(
        variantsList[0]?.size ? (Array.isArray(variantsList[0].size) ? variantsList[0].size : [variantsList[0].size]) : []
    );
    const [stock, setStock] = useState(variantsList[0]?.stock || 0);
    const [selectedSize, setSelectedSize] = useState(variantsList[0]?.size || "");

    // Cập nhật dữ liệu mặc định khi product.variants thay đổi
    useEffect(() => {
        const variantsArr = product.variants || [];
        if (variantsArr.length > 0) {
            setCurrentVariant(variantsArr[0]);
            setSizes(
                variantsArr[0].size ? (Array.isArray(variantsArr[0].size) ? variantsArr[0].size : [variantsArr[0].size]) : []
            );
            setStock(variantsArr[0].stock || 0);
            setSelectedSize(variantsArr[0].size || "");
        }
    }, [product.variants]);

    // Sử dụng useCallback để tránh tạo lại hàm không cần thiết
    const increaseQuantity = useCallback(() => {
        setQuantity(prev => prev + 1);
    }, []);

    const decreaseQuantity = useCallback(() => {
        setQuantity(prev => (prev > 1 ? prev - 1 : 1));
    }, []);

    // Hàm chuyển đổi đường dẫn ảnh
    // @ts-ignore
    const getFullImageUrl = useCallback((relativePath) => {
        const baseUrl = 'http://10.0.2.2:5000';
        return `${baseUrl}${relativePath}`;
    }, []);

    // Sử dụng useMemo để tính toán imageUri chỉ khi product.imageUrls hoặc variantsList thay đổi
    const imageUri = useMemo(() => {
        if (product.imageUrls && product.imageUrls[0]) {
            return getFullImageUrl(product.imageUrls[0]);
        } else if (variantsList[0] && variantsList[0].images && variantsList[0].images[0]) {
            return getFullImageUrl(variantsList[0].images[0]);
        }
        return 'https://via.placeholder.com/300';
    }, [product.imageUrls, variantsList, getFullImageUrl]);

    // Lấy ra tất cả các kích cỡ có trong các variant và loại bỏ trùng lặp
    const allSizes = useMemo(() => {
        // @ts-ignore
        const sizesArray = variantsList.flatMap(variant => {
            if (variant.size) {
                return Array.isArray(variant.size) ? variant.size : [variant.size];
            }
            return [];
        });
        return [...new Set(sizesArray)];
    }, [variantsList]);

    // Xử lý thêm vào giỏ hàng
    const handleAddToCart = useCallback(async () => {
        if (!selectedSize) {
            Alert.alert('Vui lòng chọn kích cỡ!');
            return;
        }
        // Tìm biến thể có kích cỡ khớp
        const matchedVariant = product.variants.find(
            (v: { size: string }) => v.size.trim().toLowerCase() === selectedSize.trim().toLowerCase()
        );
        if (!matchedVariant) {
            Alert.alert('Không tìm thấy biến thể phù hợp!');
            return;
        }
        const token = await tokenService.getToken();
        try {
            await axios.post(
                'http://10.0.2.2:5000/v1/cart/add-to-cart',
                {
                    productId: product._id,
                    variantId: matchedVariant._id,
                    quantity,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            Alert.alert('Thêm vào giỏ hàng thành công!');
        } catch (error) {
            Alert.alert('Lỗi khi thêm vào giỏ hàng: ' + ((error as any).response?.data || (error as Error).message));
        }
    }, [product, quantity, selectedSize]);

    return (
        <View style={styles.container}>
            <ScrollView style={styles.ScrollView}>
                <View style={styles.header}>
                    <Image style={styles.ImageItem} source={{ uri: imageUri }} />
                    <TouchableOpacity style={styles.btnBackToHome} onPress={() => navigation.goBack()}>
                        <Image source={require('../Image/back.png')} />
                    </TouchableOpacity>
                </View>

                <View style={styles.contentContainer}>
                    <View style={styles.headerChild}>
                        <View>
                            <Text style={styles.itemTitle}>{product.name}</Text>
                            <Text style={styles.itemPrice}>{`${currentVariant.price?.toLocaleString()} VND`}</Text>
                        </View>
                        <Text style={styles.itemSold}>Đã bán 39.1k</Text>
                    </View>

                    <View style={styles.body}>
                        <TouchableOpacity style={styles.btnPlus} onPress={increaseQuantity}>
                            <Image source={require('../Image/add.png')} />
                        </TouchableOpacity>
                        <Text style={styles.itemQuantity}>{quantity}</Text>
                        <TouchableOpacity style={styles.btnMinus} onPress={decreaseQuantity}>
                            <Image source={require('../Image/minus.png')} />
                        </TouchableOpacity>
                    </View>

                    {/* Danh sách các biến thể (màu sắc) */}
                    <View style={styles.bodyChild}>
                        {variantsList.map((item: { size: string | string[]; color: string; stock: number }, index: number) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => {
                                    setCurrentVariant(item);
                                    setSizes(Array.isArray(item.size) ? item.size : [item.size]);
                                    setStock(item.stock);
                                }}
                                style={styles.variantButton}
                            >
                                <Text style={styles.variantButtonText}>{item.color}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Danh sách kích cỡ: hiển thị tất cả kích cỡ có trong các variant */}
                    <View style={styles.bodyChild}>
                        {allSizes.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => setSelectedSize(item)}
                                style={styles.sizeButton}
                            >
                                <Text style={styles.sizeButtonText}>{String(item)}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Hiển thị số lượng tồn kho */}
                    <Text style={styles.itemTitle}>Số lượng còn lại: {stock}</Text>

                    <View style={styles.footer}>
                        <Text style={styles.footerContent}>
                            {product.description || 'Chưa có mô tả sản phẩm'}
                        </Text>
                    </View>
                </View>
            </ScrollView>

            <View style={styles.btnFooter}>
                <TouchableOpacity style={styles.btnWithList}>
                    <Image source={require('../Image/wishlist.png')} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnAddtoCart} onPress={handleAddToCart}>
                    <Text>Thêm vào giỏ hàng</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    ImageItem: {
        width: '100%',
        height: 300,
    },
    btnBackToHome: {
        width: 34,
        height: 34,
        borderRadius: 34,
        backgroundColor: '#BCB1B1',
        position: 'absolute',
        left: 10,
        top: 3,
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
    },
    contentContainer: {
        paddingHorizontal: 10,
    },
    headerChild: {
        flexDirection: 'row',
        marginTop: 20,
        justifyContent: 'space-between',
    },
    itemSold: {
        marginLeft: 10,
        marginTop: 10,
    },
    itemPrice: {
        fontWeight: 'bold',
        fontSize: 24,
    },
    body: {
        flexDirection: 'row',
        marginTop: 10,
        alignItems: 'center',
    },
    btnPlus: {
        backgroundColor: '#D8D8D8',
        borderRadius: 15,
        padding: 3,
    },
    btnMinus: {
        backgroundColor: '#D8D8D8',
        borderRadius: 15,
        padding: 3,
    },
    itemQuantity: {
        marginHorizontal: 15,
        fontSize: 16,
    },
    bodyChild: {
        flexDirection: 'row',
        marginTop: 10,
    },
    itemTitle: {
        fontWeight: 'bold',
        fontSize: 20,
    },
    footer: {
        marginTop: 20,
    },
    footerContent: {
        letterSpacing: 1,
        lineHeight: 20,
    },
    btnAddtoCart: {
        width: 175,
        height: 50,
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    ScrollView: {},
    btnFooter: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        padding: 8,
        height: 70,
        alignItems: 'center',
    },
    btnWithList: {
        height: 50,
        width: 50,
        backgroundColor: '#D8D8D8',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    variantButton: {
        width: 65,
        height: 35,
        backgroundColor: '#D8D8D8',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 5,
        marginTop: 10,
    },
    variantButtonText: {
        color: 'black',
    },
    sizeButton: {
        width: 65,
        height: 35,
        backgroundColor: '#D8D8D8',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 5,
        marginTop: 10,
    },
    sizeButtonText: {
        color: 'black',
    },
});

export default DetailScreen;
