import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    Alert,
    TextInput
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import CustomAlert from '../../styles/CustomAlert.tsx';
import { getToken } from '../../service/categoryService';
import tokenService from "../../service/tokenService";

const OrderRating = ({ route }) => {
    const { orderId, orderItems, userId } = route?.params || {};
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertHeader, setAlertHeader] = useState('');
    const [alertMessage, setAlertMessage] = useState('');

    // Tạo state lưu rating riêng cho từng sản phẩm
    const [ratings, setRatings] = useState(
        orderItems.reduce((acc, item) => {
            acc[item.productId._id] = 5;
            return acc;
        }, {})
    );

    const [comments, setComments] = useState(
        orderItems.reduce((acc, item) => {
            acc[item.productId._id] = '';
            return acc;
        }, {})
    );

    const [itemsToReview, setItemsToReview] = useState(orderItems);

    const showAlert = (header, message) => {
        setAlertHeader(header);
        setAlertMessage(message);
        setAlertVisible(true);
    };

    const renderStars = (productId) => {
        const rating = ratings[productId] || 5;

        return (
            <View style={styles.starRow}>
                {[1, 2, 3, 4, 5].map((value) => (
                    <TouchableOpacity
                        key={value}
                        onPress={() => {
                            setRatings((prev) => ({ ...prev, [productId]: value }));
                        }}
                    >
                        <Icon
                            name="star"
                            size={26}
                            color={value <= rating ? '#FFA500' : '#ccc'}
                            style={styles.starIcon}
                        />
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    const submitRating = async (item) => {
        try {
            const token = await getToken();
            const userInfo = await tokenService.getUserIdFromToken();
            const currentUserId = userInfo?.userId;

            const productId = item.productId._id;
            const content = comments[productId]?.trim();

            const payload = {
                productId,
                userId: currentUserId,
                rating: ratings[productId] || 5,
                variants: item.variantId?._id,
            };

            // Gửi đánh giá
            await axios.post('http://10.0.2.2:5000/v1/rating/add', payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Nếu có bình luận thì gửi thêm
            if (content) {
                await axios.post(
                    'http://10.0.2.2:5000/v1/comment/add',
                    {
                        productId,
                        userId: currentUserId,
                        content,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        }
                    }
                );
            }

            setItemsToReview((prev) =>
                prev.filter((p) => p.productId._id !== productId)
            );

            showAlert('Thành công', '🎉 Bạn đã gửi đánh giá và bình luận!');
        } catch (error) {
            console.error('❌ Lỗi gửi đánh giá/bình luận:', error.message);
            showAlert('Lỗi', 'Không thể gửi đánh giá hoặc bình luận. Vui lòng thử lại.');
        }
    };



    return (
        <ScrollView style={styles.container}>
            <Text style={styles.sectionTitle}>ĐƠN HÀNG #{orderId}</Text>

            {itemsToReview.map((item, index) => (
                <View key={index} style={styles.productBox}>
                    <Image
                        source={{ uri: `http://10.0.2.2:5000${item.variantId.images?.[0]}` }}
                        style={styles.productImage}
                    />
                    <View style={{ marginLeft: 12, flex: 1 }}>
                        <Text style={styles.productName}>{item.productId.name}</Text>
                        <Text style={styles.productOption}>
                            {item.variantId.size} - {item.variantId.color}
                        </Text>
                        <Text style={styles.price}>
                            ₫{item.variantId.price.toLocaleString()}
                        </Text>
                        <Text style={styles.quantity}>Số lượng: {item.quantity}</Text>
                    </View>

                    <Text style={styles.sectionTitle}>Đánh giá sản phẩm</Text>
                    {renderStars(item.productId._id)}

                    <Text style={{ fontWeight: '500', marginTop: 6 }}>Bình luận:</Text>
                    <TextInput
                        value={comments[item.productId._id]}
                        onChangeText={(text) =>
                            setComments((prev) => ({ ...prev, [item.productId._id]: text }))
                        }
                        placeholder="Nhập bình luận..."
                        style={{
                            borderWidth: 1,
                            borderColor: '#ccc',
                            borderRadius: 6,
                            padding: 10,
                            marginTop: 6,
                            marginBottom: 8,
                            height: 80,
                            textAlignVertical: 'top',
                        }}
                        multiline
                    />

                    <TouchableOpacity
                        style={styles.submitButton}
                        onPress={() => submitRating(item)}
                    >
                        <Text style={styles.submitText}>Gửi đánh giá</Text>
                    </TouchableOpacity>
                </View>
            ))}

            <CustomAlert
                visible={alertVisible}
                header={alertHeader}
                message={alertMessage}
                onClose={() => setAlertVisible(false)}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#FFF',
    },
    sectionTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        marginTop: 16,
        marginBottom: 8,
    },
    productBox: {
        flexDirection: 'column',
        marginBottom: 24,
        backgroundColor: '#f9f9f9',
        padding: 12,
        borderRadius: 8,
    },
    productImage: {
        width: 80,
        height: 80,
        borderRadius: 6,
    },
    productName: {
        fontWeight: 'bold',
        fontSize: 15,
        marginTop: 4,
    },
    productOption: {
        color: '#555',
        marginTop: 4,
    },
    price: {
        color: '#d0021b',
        fontWeight: 'bold',
        marginTop: 4,
    },
    quantity: {
        marginTop: 2,
        fontSize: 13,
        color: '#666',
    },
    starRow: {
        flexDirection: 'row',
        marginVertical: 8,
    },
    starIcon: {
        marginRight: 8,
    },
    submitButton: {
        backgroundColor: '#000',
        padding: 12,
        borderRadius: 8,
        marginTop: 8,
        alignItems: 'center',
    },
    submitText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default OrderRating;
