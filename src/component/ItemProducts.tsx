import {Image, StyleSheet, Text, ToastAndroid, TouchableOpacity, View} from "react-native";
import {useEffect, useState} from "react";
import {checkFavorite, toggleFavorite} from "../service/favoriteService";


// @ts-ignore
const ItemProducts = ({product, getRandomImage, onPress}) => {


    const [isFavorite, setIsFavorite] = useState(false);
    const [randomDiscount, setRandomDiscount] = useState(0);



    useEffect(() => {
        const fetchFavoriteStatus = async () => {
            try {
                const result = await checkFavorite(product._id);
                setIsFavorite(result.favourite);
            } catch (error) {
                console.error("Error fetching favorite status:", error);
            }
        };
        fetchFavoriteStatus();
        setRandomDiscount(Math.floor(Math.random() * 50) + 1);
    }, [product]);

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



    // @ts-ignore
    const getFullImageUrl = (relativePath) => {
        const baseUrl = 'http://10.0.2.2:5000'; // Cập nhật lại base URL nếu cần
        return `${baseUrl}${relativePath}`;
    };

    const relativeImage = getRandomImage(product.variants);
    const imageUrl = relativeImage ? getFullImageUrl(relativeImage) : 'https://via.placeholder.com/150';


    return (
        <TouchableOpacity style={styles.cardContainer} onPress={() => onPress(product)}>

            <View style={styles.imageWrapper}>

                <Image
                    source={{uri: imageUrl}}
                    style={styles.image}
                    resizeMode="cover"
                />
                <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>-{randomDiscount}%</Text>
                </View>

                <TouchableOpacity style={styles.heartIconContainer} onPress={handleToggleFavorite}>
                    <Image
                        source={
                            isFavorite
                                ? require('../Image/heart_red.png')        // Icon màu đỏ
                                : require('../Image/heart_fav.png')       // Icon màu xám
                        }

                    />
                </TouchableOpacity>


            </View>

            {/* Thông tin sản phẩm: tên + giá */}
            <View style={styles.infoContainer}>
                <Text style={styles.title}  numberOfLines={1} ellipsizeMode="tail">{product.name}</Text>
                <View style={styles.bestPriceTag}>
                    <Text style={styles.bestPriceText}>Rẻ Vô Địch</Text>
                </View>
                <Text style={styles.price}> {`${product.variants[0]?.salePrice} VND`}</Text>
            </View>
        </TouchableOpacity>
    )
}


const styles = StyleSheet.create({
    cardContainer: {
        height: 275,
        width: 190,
        backgroundColor: '#fff',
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 14},
        shadowOpacity: 0.1,
        shadowRadius: 5,
        marginTop: 10,
        margin: 5,


    },
    imageWrapper: {
        width: '100%',
        height: 190, // Chiều cao phần hình
        position: 'relative',
        overflow: 'hidden', // Để cắt phần wave
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 5,
    },
    waveContainer: {
        position: 'absolute',
        bottom: -4,
        left: 0,
        right: 0,
        height: 50,

    },
    wave: {
        width: '100%',
        height: '100%',
    },
    heartIconContainer: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 38,
        height: 38,
        borderRadius: 27,
        backgroundColor: '#CBCCCC',
        alignItems: 'center',
        justifyContent: 'center',
        // Thêm shadow cho icon
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.15,
        shadowRadius: 1.5,

    },
    infoContainer: {
        flex: 1,
        paddingVertical: 0,
        padding: 8
    },
    title: {
        fontSize: 16,
        color: '#000',
        marginBottom: 4,
        marginTop:8
    },
    price: {
        fontSize: 14,
        color: '#666',
    },
    discountText: {
        color: '#B45A35',
        fontWeight: 'bold',
        fontSize: 13,
    },

    bestPriceTag: {
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderWidth: 1,
        borderColor: '#F85A27',
        borderRadius: 4,
        marginBottom: 4,
    },
    bestPriceText: {
        color: '#F85A27',
        fontWeight: 'bold',
        fontSize: 12,
    },
    discountBadge: {
        position: 'absolute',
        top: 8,
        left: 8,
        backgroundColor: '#FDE8E4',
        borderRadius: 5,
        paddingVertical: 2,
        paddingHorizontal: 6,
        zIndex: 10,          // ✅ đảm bảo nổi lên
        elevation: 3,        // ✅ Android
    },
});


export default ItemProducts;
