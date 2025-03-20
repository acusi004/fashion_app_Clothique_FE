import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Svg, {Path} from "react-native-svg";
import {Icon} from "react-native-paper";
import {useState} from "react";



// @ts-ignore
const  ItemProducts=({ product, getRandomImage, onPress })=>{


    const [isFavorite, setIsFavorite] = useState(false);



    const handleToggleFavorite = () => {
        setIsFavorite(!isFavorite);
    };

    // @ts-ignore
    const getFullImageUrl = (relativePath) => {
        const baseUrl = 'http://10.0.2.2:5000/uploads'; // Cập nhật lại base URL nếu cần
        return `${baseUrl}${relativePath}`;
    };

    const relativeImage = getRandomImage(product.variants);
    const imageUrl = relativeImage ? getFullImageUrl(relativeImage) : 'https://via.placeholder.com/150';


    return(
        <TouchableOpacity style={styles.cardContainer} onPress={product}>

            <View style={styles.imageWrapper}>
                <Image
                    source={{ uri: imageUrl }}
                    style={styles.image}
                    resizeMode="cover"
                />


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
                <Text style={styles.title}>{product.name}</Text>
                <Text style={styles.price}> {`${product.variants[0]?.price.toLocaleString()} VND`}</Text>
            </View>
        </TouchableOpacity>
    )
}


const styles = StyleSheet.create({
    cardContainer: {
        height:265,
        width: 180,
        backgroundColor: '#fff',
        borderRadius: 18,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 14 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        marginTop:10,

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
        borderRadius:18,
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
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 1.5,

    },
    infoContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 0,
        padding:5
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 4,
    },
    price: {
        fontSize: 14,
        color: '#666',
    },
});


export default ItemProducts;
