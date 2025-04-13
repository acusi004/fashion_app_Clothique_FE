import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { getToken } from '../../service/categoryService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import tokenService from "../../service/tokenService";

function OrderRated() {
    const [ratings, setRatings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserRatedProducts = async () => {
            try {
                const token = await tokenService.getToken();
                const userInfo = await tokenService.getUserIdFromToken();
                const userId = userInfo?.userId;

                if (!userId) {
                    console.warn("Không tìm thấy userId từ token");
                    setRatings([]); // fallback
                    return;
                }

                const response = await axios.get(`http://10.0.2.2:5000/v1/rating/user/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });


                const sortedRatings = response.data.sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                );
                setRatings(sortedRatings);

            } catch (error) {
                console.error("❌ Lỗi khi lấy danh sách đánh giá:", error.message);
                setRatings([]);
            } finally {
                setLoading(false); // Tắt loading sau khi gọi API
            }
        };

        fetchUserRatedProducts();
    }, []);


    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#000" />
                <Text>Đang tải đánh giá...</Text>
            </View>
        );
    }


    return (
        <ScrollView style={styles.container}>
            {ratings.map((item) => (
                <View key={item._id} style={styles.card}>
                    {/* User Info */}
                    <View style={styles.userRow}>
                        <Image
                            source={{ uri: item.userId?.avatar || 'https://i.pravatar.cc/150?img=11' }}
                            style={styles.avatar}
                        />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.username}>{item.userId?.name || 'Ẩn danh'}</Text>
                            <View style={{ flexDirection: 'row', marginTop: 2 }}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Icon
                                        key={star}
                                        name="star"
                                        size={16}
                                        color={star <= item.rating ? '#FFA500' : '#ccc'}
                                        style={{ marginRight: 2 }}
                                    />
                                ))}
                            </View>
                        </View>
                        <Text style={styles.date}>{new Date(item.createdAt).toLocaleString()}</Text>
                    </View>

                    {/* Product Info */}
                    <View style={styles.productRow}>
                        <Image
                            source={{
                                uri: item.variants?.[0]?.images?.[0]
                                    ? `http://10.0.2.2:5000${item.variants[0].images[0]}`
                                    : 'https://via.placeholder.com/60', // fallback nếu không có ảnh
                            }}
                            style={styles.productImage}
                        />

                        <Text style={styles.productName}>{item.productId?.name}</Text>
                    </View>

                    {/* Actions */}
                    <View style={styles.actionRow}>
                        <TouchableOpacity style={styles.likeButton}>
                            <Icon name="thumbs-o-up" size={16} color="#333" />
                            <Text style={{ marginLeft: 4 }}>Hữu ích</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.editButton}>
                            <Text style={styles.editText}>Sửa</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 12,
        backgroundColor: '#F8F8F8',
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 10,
        padding: 12,
        marginBottom: 16,
        shadowColor: '#000',
        elevation: 2,
    },
    userRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatar: {
        width: 38,
        height: 38,
        borderRadius: 19,
        marginRight: 10,
    },
    username: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    date: {
        fontSize: 12,
        color: '#666',
    },
    productRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FAFAFA',
        padding: 10,
        borderRadius: 6,
        marginBottom: 10,
    },
    productImage: {
        width: 40,
        height: 40,
        marginRight: 10,
    },
    productName: {
        flex: 1,
        fontSize: 14,
        fontWeight: '500',
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    likeButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    editButton: {
        borderWidth: 1,
        borderColor: '#B35A00',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 6,
    },
    editText: {
        color: '#B35A00',
        fontWeight: '500',
    },
    productImage: {
        width: 60,
        height: 60,
        marginRight: 8,
        borderRadius: 6,
    },

});

export default OrderRated;
