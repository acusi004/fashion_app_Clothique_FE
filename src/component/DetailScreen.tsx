// DetailScreen.js
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { addToCartAPI } from "../service/cartService";
import { toggleFavorite } from "../service/favoriteService";
import CustomAlert from "../styles/CustomAlert.tsx";
import { getToken } from '../service/categoryService.js';
import tokenService from '../service/tokenService.js';
import { likeComment, dislikeComment } from '../service/commentService';

// @ts-ignore
const DetailScreen = ({ route, navigation }) => {
    const { product } = route.params;
    const [quantity, setQuantity] = useState(1);
    const variantsList = product.variants || [];

    // Khởi tạo state cho biến thể hiện tại và kích cỡ, tồn kho
    const [currentVariant, setCurrentVariant] = useState(variantsList[0] || {});
    const [sizes, setSizes] = useState(
        variantsList[0]?.size ? (Array.isArray(variantsList[0].size) ? variantsList[0].size : [variantsList[0].size]) : []
    );
    const [stock, setStock] = useState(variantsList[0]?.stock || 0);
    const [selectedSize, setSelectedSize] = useState(variantsList[0]?.size || '');
    const [isFavorite, setIsFavorite] = useState(false);

    const [alertVisible, setAlertVisible] = useState(false);
    const [alertHeader, setAlertHeader] = useState('');
    const [alertMessage, setAlertMessage] = useState('');

    const [ratings, setRatings] = useState([]);
    const [comments, setComments] = useState([]);
    const [avgRating, setAvgRating] = useState(0);

    // @ts-ignore
    const showAlert = (header, message) => {
        setAlertHeader(header);
        setAlertMessage(message);
        setAlertVisible(true);
    };

    // Cập nhật dữ liệu mặc định khi danh sách variants thay đổi
    useEffect(() => {
        if (variantsList.length > 0) {
            setCurrentVariant(variantsList[0]);
            setSizes(
                variantsList[0].size
                    ? Array.isArray(variantsList[0].size)
                        ? variantsList[0].size
                        : [variantsList[0].size]
                    : []
            );
            setStock(variantsList[0].stock || 0);
            setSelectedSize(variantsList[0].size || '');
        }
    }, [variantsList]);

    const increaseQuantity = useCallback(() => setQuantity(q => q + 1), []);
    const decreaseQuantity = useCallback(() => setQuantity(q => (q > 1 ? q - 1 : 1)), []);


    const handleToggleFavorite = async () => {
        try {
            const result = await toggleFavorite(product._id);
            // Dựa vào thông báo trả về từ BE để cập nhật trạng thái
            if (result.message && result.message.includes("thêm")) {
                setIsFavorite(true);
                ToastAndroid.show(`Đã thêm ${product.name} vào danh sách yêu thích`, ToastAndroid.SHORT);
            } else {
                setIsFavorite(false);
                ToastAndroid.show(`Đã xóa ${product.name} khỏi danh sách yêu thích`, ToastAndroid.SHORT);
            }
        } catch (error) {
            console.error("Error toggling favorite:", error);
        }
    };

    const getFullImageUrl = useCallback(
        (relativePath: string) => `http://10.0.2.2:5000${relativePath}`,
        []
    );

    const imageUri = useMemo(() => {
        if (product.imageUrls && product.imageUrls[0]) return getFullImageUrl(product.imageUrls[0]);
        if (variantsList[0] && variantsList[0].images && variantsList[0].images[0])
            return getFullImageUrl(variantsList[0].images[0]);
        return 'https://via.placeholder.com/300';
    }, [product.imageUrls, variantsList, getFullImageUrl]);

    // Lấy tất cả các kích cỡ có trong variants, loại bỏ trùng lặp
    const allSizes = useMemo(() => {
        const sizesArray = variantsList.flatMap((variant: { size?: string | string[] }) =>
            variant.size ? (Array.isArray(variant.size) ? variant.size : [variant.size]) : []
        );
        return [...new Set(sizesArray)];
    }, [variantsList]);

    // Xử lý thêm sản phẩm vào giỏ hàng
    const handleAddToCart = useCallback(async () => {
        if (!selectedSize) {
            setAlertHeader('Thông báo');
            setAlertMessage('Vui lòng chọn kích cỡ!');
            setAlertVisible(true);
            return;
        }

        const matchedVariant = product.variants.find(
            (v: { _id: string; size: string }) => v.size.trim().toLowerCase() === selectedSize.trim().toLowerCase()
        );
        if (!matchedVariant) {
            setAlertHeader('Lỗi');
            setAlertMessage('Không tìm thấy biến thể phù hợp!');
            setAlertVisible(true);
            return;
        }

        try {
            await addToCartAPI(product._id, matchedVariant._id, quantity);
            setAlertHeader('Thành công');
            setAlertMessage('Sản phẩm đã được thêm vào giỏ hàng!');
            setAlertVisible(true);
        } catch (error) {
            setAlertHeader('Lỗi');
            setAlertMessage(
                error instanceof Error
                    ? (error as any).response?.data || error.message
                    : 'Đã xảy ra lỗi không xác định.'
            );
            setAlertVisible(true);
        }
    }, [product, quantity, selectedSize]);


    const handleCloseAlert = () => {
        setAlertVisible(false);
        if (alertHeader === 'Thành công') {
            navigation.navigate('CartScreen');
        }
    };

    useEffect(() => {
        const fetchRatingsAndComments = async () => {
            const token = await getToken();

            if (!token) {
                console.warn("Người dùng chưa đăng nhập!");
                return;
            }

            try {
                // Gửi yêu cầu đánh giá với token trong header
                const resRating = await fetch(`http://10.0.2.2:5000/v1/rating/${product._id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`  // Thêm token vào header
                    }
                });
                const ratingData = await resRating.json();
                setRatings(ratingData);

                const avg = ratingData.reduce((acc, r) => acc + r.rating, 0) / ratingData.length;
                setAvgRating(avg.toFixed(1));

                // Gửi yêu cầu bình luận với token trong header
                const resComment = await fetch(`http://10.0.2.2:5000/v1/comment/${product._id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`  // Thêm token vào header
                    }
                });
                const commentData = await resComment.json();
                console.log("Bình luận nhận được từ API:", commentData);

                if (commentData && Array.isArray(commentData)) {
                    setComments(commentData);
                } else {
                    console.warn("Dữ liệu bình luận không hợp lệ:", commentData);
                    setComments([]);
                }
            } catch (err) {
                console.error("Lỗi khi fetch đánh giá & bình luận:", err);
            }
        };

        fetchRatingsAndComments();
    }, []);

    const handleLike = async (commentId) => {
        try {
            const token = await getToken();
            const currentUser = await tokenService.getUserIdFromToken();
            const currentUserId = currentUser?.userId;

            if (!currentUserId) return;

            // Gửi yêu cầu LIKE
            await likeComment(commentId);

            // Cập nhật lại state
            setComments((prevComments) =>
                prevComments.map((comment) =>
                    comment._id === commentId
                        ? {
                            ...comment,
                            likes: Array.isArray(comment.likes)
                                ? [...comment.likes, { userId: currentUserId }]
                                : [{ userId: currentUserId }],
                            dislikes: Array.isArray(comment.dislikes) ? comment.dislikes : [],
                        }
                        : comment
                )
            );

        } catch (error) {
            console.error("Lỗi khi like comment:", error);
        }
    };

    const handleDislike = async (commentId) => {
        try {
            const token = await getToken();
            const currentUser = await tokenService.getUserIdFromToken();
            const currentUserId = currentUser?.userId;

            if (!currentUserId) return;

            // Gửi yêu cầu DISLIKE
            await dislikeComment(commentId);

            // Cập nhật lại state
            setComments((prevComments) =>
                prevComments.map((comment) =>
                    comment._id === commentId
                        ? {
                            ...comment,
                            dislikes: Array.isArray(comment.dislikes)
                                ? [...comment.dislikes, { userId: currentUserId }]
                                : [{ userId: currentUserId }],
                            likes: Array.isArray(comment.likes) ? comment.likes : [],
                        }
                        : comment
                )
            );

        } catch (error) {
            console.error("Lỗi khi dislike comment:", error);
        }
    };

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

                    {/* Danh sách các biến thể (theo màu sắc) */}
                    <View style={styles.bodyChild}>
                        {variantsList.map((item: { size?: string | string[]; stock?: number; color?: string }, index: number) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => {
                                    setCurrentVariant(item);
                                    setSizes(Array.isArray(item.size) ? item.size : [item.size]);
                                    setStock(item.stock);
                                    setSelectedSize('');
                                }}
                                style={styles.variantButton}
                            >
                                <Text style={styles.variantButtonText}>{item.color}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Danh sách kích cỡ (tất cả kích cỡ có trong variants) */}
                    <View style={styles.bodyChild}>
                        {allSizes.map((item, index) => (
                            <TouchableOpacity key={index} onPress={() => setSelectedSize(item)} style={styles.sizeButton}>
                                <Text style={styles.sizeButtonText}>{String(item)}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={styles.itemTitle}>Số lượng còn lại: {stock}</Text>

                    <View style={styles.footer}>
                        <Text style={styles.footerContent}>
                            {product.description || 'Chưa có mô tả sản phẩm'}
                        </Text>
                    </View>
                </View>

                <View style={{ marginTop: 20 }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
                        Đánh giá & bình luận ({ratings.length})
                    </Text>

                    {/* ⭐ Tổng đánh giá */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                        <Text style={{ fontSize: 16, color: '#FFA500', marginRight: 6 }}>⭐</Text>
                        <Text style={{ fontSize: 16 }}>{avgRating}/5 điểm</Text>
                    </View>

                    {/* Danh sách đánh giá + bình luận */}
                    {ratings.map((item, index) => {
                        const comment = comments.find(c => c.userId?._id === item.userId?._id);
                        return (
                            <View key={index} style={styles.reviewCard}>
                                <Image
                                    source={{ uri: comment?.userId?.avatar || 'https://via.placeholder.com/100' }}
                                    style={styles.avatar}
                                />
                                <View style={{ flex: 1, marginLeft: 10 }}>
                                    <Text style={styles.reviewerName}>
                                        {item.userId?.name || item.userId?.userId?.name || 'Ẩn danh'}
                                    </Text>

                                    <View style={{ flexDirection: 'row', marginVertical: 4 }}>
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Text
                                                key={star}
                                                style={{ color: star <= item.rating ? '#FFD700' : '#ccc', fontSize: 16 }}
                                            >
                                                ★
                                            </Text>
                                        ))}
                                    </View>

                                    <Text style={styles.commentText}>
                                        {comment?.content || 'Chưa có bình luận nào.'}
                                    </Text>

                                    {/* Like/Dislike nằm trong comment tương ứng */}
                                    {/* {comment && (
                                        <View style={{ flexDirection: 'row', marginTop: 8, gap: 12 }}>
                                            <TouchableOpacity onPress={() => handleLike(comment._id)}>
                                                <Text style={{ color: 'blue' }}>👍 {comment.likes || 0}</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity onPress={() => handleDislike(comment._id)}>
                                                <Text style={{ color: 'red' }}>👎 {comment.dislikes || 0}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )} */}
                                </View>
                            </View>
                        );
                    })}
                </View>
            </ScrollView>

            <View style={styles.btnFooter}>
                <TouchableOpacity style={styles.btnWithList} onPress={handleToggleFavorite}>
                    <Image source={require('../Image/wishlist.png')} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnAddtoCart} onPress={handleAddToCart}>
                    <Text>Thêm vào giỏ hàng</Text>
                </TouchableOpacity>
            </View>
            <CustomAlert
                visible={alertVisible}
                header={alertHeader}
                message={alertMessage}
                onClose={handleCloseAlert} // ✅ điều hướng chỉ khi thành công
            />

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
    reviewCard: {
        flexDirection: 'row',
        padding: 12,
        backgroundColor: '#F9F9F9',
        borderRadius: 10,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        alignItems: 'flex-start',
    },

    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#ccc',
    },

    reviewerName: {
        fontWeight: '600',
        fontSize: 15,
        marginBottom: 4,
    },

    commentText: {
        fontSize: 14,
        color: '#333',
        lineHeight: 20,
    },
});

export default DetailScreen;
