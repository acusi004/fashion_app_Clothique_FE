import React, { useEffect, useState } from 'react';
import { FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import axios from 'axios';
import tokenService from '../service/tokenService';

// @ts-ignore
const DetailScreen = ({ route, navigation }) => {
    // Lấy dữ liệu sản phẩm được truyền qua navigation
    const { product } = route.params;
    const [quantity, setQuantity] = useState(1);

    // Đảm bảo `sz` luôn là một mảng hợp lệ
    const sz = product.variants || [];

    // Lưu trạng thái biến thể hiện tại
    const [variants, setVariants] = useState(sz[0] || {});

    // Lưu kích cỡ và số lượng mặc định từ biến thể đầu tiên
    const [kichco, setKichco] = useState(sz[0]?.size ? [sz[0].size] : []);
    const [soluong, setSoluong] = useState(sz[0]?.stock || 0);
    const [size, setSize] = useState(sz[0]?.size || "");

    // Cập nhật dữ liệu mặc định khi `product.variants` thay đổi
    useEffect(() => {
        if (sz.length > 0) {
            setVariants(sz[0]);
            setKichco(sz[0].size ? [sz[0].size] : []);
            setSoluong(sz[0].stock || 0);
            setSize(sz[0].size || "");
        }
    }, [product.variants]);

    // Hàm tăng số lượng
    const increaseQuantity = () => setQuantity(prev => prev + 1);

    // Hàm giảm số lượng (không cho nhỏ hơn 1)
    const decreaseQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

    // Chuyển đổi đường dẫn ảnh
    const getFullImageUrl = (relativePath) => {
        const baseUrl = 'http://10.0.2.2:5000';
        return `${baseUrl}${relativePath}`;
    };

    // Xử lý thêm vào giỏ hàng
    const handleAddToCart = async () => {
        if (!size) {
            alert('Vui lòng chọn kích cỡ!');
            return;
        }

        const selectedVariant = product.variants.find(v => v.size.trim().toLowerCase() === size.trim().toLowerCase());
        if (!selectedVariant) {
            alert('Không tìm thấy biến thể phù hợp!');
            return;
        }

        const token = await tokenService.getToken();
        try {
            const response = await axios.post('http://10.0.2.2:5000/v1/cart/add-to-cart', {
                productId: product._id,
                variantId: selectedVariant._id,
                quantity
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            alert('Thêm vào giỏ hàng thành công!');
        } catch (error) {
            alert('Lỗi khi thêm vào giỏ hàng: ' + (error.response?.data || error.message));
        }
    };

    // Xác định ảnh hiển thị
    const imageUri = product.imageUrls?.[0] ? getFullImageUrl(product.imageUrls[0]) :
        (sz[0]?.images?.[0] ? getFullImageUrl(sz[0].images[0]) : 'https://via.placeholder.com/300');

    return (
        <View style={styles.container}>
            <ScrollView style={styles.ScrollView}>
                <View style={styles.header}>
                    <Image style={styles.ImageItem} source={{ uri: imageUri }} />
                    <TouchableOpacity style={styles.btnBackToHome} onPress={() => navigation.goBack()}>
                        <Image source={require('../Image/back.png')} />
                    </TouchableOpacity>
                </View>

                <View style={{ paddingLeft: 10, paddingRight: 10 }}>
                    <View style={styles.headerChild}>
                        <View>
                            <Text style={styles.itemTitle}>{product.name}</Text>
                            <Text style={styles.itemPrice}>{`${variants.price?.toLocaleString()} VND`}</Text>
                        </View>
                        <Text style={styles.itemLuotBan}>Đã bán 39.1k</Text>
                    </View>

                    <View style={styles.body}>
                        <TouchableOpacity style={styles.btnPlus} onPress={increaseQuantity}>
                            <Image source={require('../Image/add.png')} />
                        </TouchableOpacity>
                        <Text style={styles.itemSoLuong}>{quantity}</Text>
                        <TouchableOpacity style={styles.btnMinus} onPress={decreaseQuantity}>
                            <Image source={require('../Image/minus.png')} />
                        </TouchableOpacity>
                    </View>

                    {/* Danh sách các biến thể (màu sắc) */}
                    <View style={styles.bodyChild}>
                        {sz.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => {
                                    setVariants(item);
                                    setKichco(Array.isArray(item.size) ? item.size : [item.size]);
                                    setSoluong(item.stock);
                                }}
                                style={{
                                    width: 65,
                                    height: 35,
                                    backgroundColor: size === item.size ? '#D8D8D8' : '#D8D8D8',
                                    borderRadius: 5,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginRight: 5,
                                    marginTop: 10
                                }}
                            >
                                <Text style={{ color: 'black' }}>{item.color}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Danh sách kích cỡ */}
                    <View style={styles.bodyChild}>
                        {kichco.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => setSize(item)}
                                style={{
                                    width: 65,
                                    height: 35,
                                    backgroundColor: size === item ? '#D8D8D8' : '#D8D8D8',
                                    borderRadius: 5,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginRight: 5,
                                    marginTop: 10
                                }}
                            >
                                <Text style={{ color: 'black' }}>{item}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Hiển thị số lượng tồn kho */}
                    <Text style={styles.itemTitle}>Số lượng còn lại: {soluong}</Text>

                    <View style={styles.footer}>
                        <Text style={styles.footer_Content}>{product.description || 'Chưa có mô tả sản phẩm'}</Text>
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
        justifyContent: 'center'
    },
    header: {
        alignItems: 'center',
    },
    headerChild: {
        flexDirection: 'row',
        marginTop: 20,
        justifyContent: 'space-between'
    },
    itemLuotBan: {
        marginLeft: 10,
        marginTop: 10
    },
    itemPrice: {
        fontWeight: 'bold',
        fontSize: 24
    },
    body: {
        flexDirection: 'row',
        marginTop: 10
    },
    btnPlus: {
        backgroundColor: '#D8D8D8',
        borderRadius: 15,
        padding: 3
    },
    btnMinus: {
        backgroundColor: '#D8D8D8',
        borderRadius: 15,
        padding: 3
    },
    itemSoLuong: {
        marginLeft: 15,
        marginRight: 15,
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
    footer_Content: {
        letterSpacing: 1,
        lineHeight: 20
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
        alignItems: 'center'
    },
    btnWithList: {
        height: 50,
        width: 50,
        backgroundColor: '#D8D8D8',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rating: {},
    rating_Title: {
        fontWeight: 'bold',
        fontSize: 17
    },

});

export default DetailScreen;
