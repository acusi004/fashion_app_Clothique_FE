import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { getToken } from '../../service/categoryService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import tokenService from "../../service/tokenService";

function OrderRated() {
    const [ratings, setRatings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingRating, setEditingRating] = useState(null);
    const [newRatingValue, setNewRatingValue] = useState(5);
    const [commentContent, setCommentContent] = useState('');

    useEffect(() => {
        const fetchUserRatedProducts = async () => {
            try {
                const token = await tokenService.getToken();
                const userInfo = await tokenService.getUserIdFromToken();
                const userId = userInfo?.userId;

                if (!userId) {
                    console.warn('Không tìm thấy userId từ token');
                    return setRatings([]);
                }

                const response = await axios.get(`http://10.0.2.2:5000/v1/rating/user/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const sortedRatings = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                const ratingsWithComments = await Promise.all(
                    sortedRatings.map(async (rating) => {
                        try {
                            const commentRes = await axios.get(
                                `http://10.0.2.2:5000/v1/comment/${rating.productId._id}?userId=${userId}`,
                                {
                                    headers: { Authorization: `Bearer ${token}` },
                                }
                            );
                            return { ...rating, comment: commentRes.data || null };
                        } catch (error) {
                            console.warn(`❗ Không lấy được comment cho productId: ${rating.productId._id}`);
                            return { ...rating, comment: null };
                        }
                    })
                );


                setRatings(ratingsWithComments);
            } catch (error) {
                console.error('❌ Lỗi khi lấy danh sách đánh giá:', error.message);
                setRatings([]);
            } finally {
                setLoading(false);
            }
        };

        fetchUserRatedProducts();
    }, []);

    const handleUpdateRating = async () => {
        if (!editingRating) return;
        try {
            const token = await tokenService.getToken();

            // Cập nhật đánh giá
            await axios.post(
                'http://10.0.2.2:5000/v1/rating/add',
                {
                    productId: editingRating.productId._id,
                    userId: editingRating.userId._id,
                    rating: newRatingValue,
                    variants: editingRating.variants[0]?._id || null,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            // Cập nhật bình luận nếu có
            if (editingRating.comment?._id) {
                await axios.put(
                    `http://10.0.2.2:5000/v1/comment/update/${editingRating.comment._id}`,
                    { content: commentContent },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }

            const updated = ratings.map((r) =>
                r._id === editingRating._id
                    ? {
                        ...r,
                        rating: newRatingValue,
                        comment: { ...r.comment, content: commentContent },
                    }
                    : r
            );

            setRatings(updated);
            setModalVisible(false);
        } catch (error) {
            console.error('❌ Lỗi cập nhật đánh giá/bình luận:', error.message);
        }
    };

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
                                    : 'https://via.placeholder.com/60',
                            }}
                            style={styles.productImage}
                        />
                        <Text style={styles.productName}>{item.productId?.name}</Text>
                    </View>

                    {item.comment && (
                        <View style={styles.commentBox}>
                            <Text style={styles.commentLabel}>Bình luận của bạn:</Text>
                            <Text style={styles.commentContent}>{item.comment.content}</Text>
                            <Text style={{ fontSize: 12, color: '#888' }}>
                                {new Date(item.comment.createdAt).toLocaleString()}
                            </Text>
                        </View>
                    )}

                    {/* Actions */}
                    <View style={styles.actionRow}>
                        <TouchableOpacity style={styles.likeButton}>
                            <Icon name="thumbs-o-up" size={16} color="#333" />
                            <Text style={{ marginLeft: 4 }}>Hữu ích</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.editButton}
                            onPress={() => {
                                setEditingRating(item);
                                setNewRatingValue(item.rating);
                                setCommentContent(item.comment?.content || '');
                                setModalVisible(true);
                            }}
                        >
                            <Text style={styles.editText}>Sửa</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ))}

            {/* Modal chỉnh sửa */}
            {modalVisible && editingRating && (
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 10 }}>Cập nhật đánh giá</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 10 }}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <TouchableOpacity key={star} onPress={() => setNewRatingValue(star)}>
                                    <Icon
                                        name="star"
                                        size={30}
                                        color={star <= newRatingValue ? '#FFD700' : '#ccc'}
                                        style={{ marginHorizontal: 4 }}
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>
                        <Text style={{ fontWeight: '500', marginBottom: 4 }}>Bình luận:</Text>
                        <TextInput
                            value={commentContent}
                            onChangeText={setCommentContent}
                            placeholder="Nhập bình luận của bạn..."
                            style={{
                                borderWidth: 1,
                                borderColor: '#ccc',
                                borderRadius: 6,
                                padding: 10,
                                marginBottom: 10,
                                minHeight: 80,
                                textAlignVertical: 'top',
                            }}
                            multiline
                        />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TouchableOpacity
                                onPress={() => setModalVisible(false)}
                                style={{ padding: 10, backgroundColor: '#eee', borderRadius: 6 }}
                            >
                                <Text>Hủy</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleUpdateRating}
                                style={{ padding: 10, backgroundColor: '#1abc9c', borderRadius: 6 }}
                            >
                                <Text style={{ color: '#fff' }}>Lưu</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}
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
        width: 60,
        height: 60,
        marginRight: 8,
        borderRadius: 6,
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
    modalOverlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalBox: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '100%',
        maxWidth: 300,
        elevation: 5,
    },
    commentBox: {
        backgroundColor: '#f4f4f4',
        padding: 10,
        borderRadius: 6,
        marginBottom: 10,
    },
    commentLabel: {
        fontWeight: 'bold',
        marginBottom: 4,
        color: '#333',
    },
    commentContent: {
        fontSize: 14,
        color: '#555',
    },

});

export default OrderRated;
