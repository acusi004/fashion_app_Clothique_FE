import React, {useRef, useState} from 'react';
import {FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";


// @ts-ignore
const DetailScreen = ({route, navigation}) => {
    // Lấy dữ liệu sản phẩm được truyền qua navigation
    const {product} = route.params;
    const [quantity, setQuantity] = useState(1);

    // Lưu kích cỡ được chọn
    const [size, setSize] = useState('');
    const sz = [
        {id: 0, Size: 'S'},
        {id: 1, Size: 'M'},
        {id: 2, Size: 'L'},
        {id: 3, Size: 'XL'}
    ];


    // Hàm tăng số lượng
    const increaseQuantity = () => {
        setQuantity(prev => prev + 1);
    };

    // Hàm giảm số lượng (không cho nhỏ hơn 1)
    const decreaseQuantity = () => {
        setQuantity(prev => (prev > 1 ? prev - 1 : 1));
    };

    // Hàm chuyển đổi đường dẫn tương đối sang full URL
    // @ts-ignore
    const getFullImageUrl = (relativePath) => {
        const baseUrl = 'http://10.0.2.2:5000'; // Cập nhật lại base URL nếu cần
        return `${baseUrl}${relativePath}`;
    };


    // Xác định URL ảnh cần hiển thị:
    // Nếu product.imageUrls có dữ liệu, dùng phần tử đầu tiên.
    // Nếu không, kiểm tra product.variants[0].images
    const imageUri = product.imageUrls && product.imageUrls.length > 0
        ? getFullImageUrl(product.imageUrls[0]) : product.variants && product.variants[0] && product.variants[0].images && product.variants[0].images.length > 0
            ? getFullImageUrl(product.variants[0].images[0])
            : 'https://via.placeholder.com/300';

    return (
        <View style={styles.container}>
            <ScrollView style={styles.ScrollView}>
                <View style={styles.header}>

                    <Image
                        style={styles.ImageItem}
                        source={{uri: imageUri}}
                    />
                    <TouchableOpacity style={styles.btnBackToHome} onPress={() => navigation.goBack()}>
                        <Image source={require('../Image/back.png')}/>
                    </TouchableOpacity>


                </View>

                <View style={{paddingLeft: 10, paddingRight: 10}}>
                    <View style={styles.headerChild}>
                        <Text style={styles.itemPrice}>
                            {`${product.variants[0]?.price.toLocaleString()} VND`}
                        </Text>
                        <Text style={styles.itemLuotBan}>Đã bán 39.1k</Text>
                    </View>
                    <View style={styles.body}>
                        <TouchableOpacity style={styles.btnPlus} onPress={increaseQuantity}>
                            <Image source={require('../Image/add.png')}/>
                        </TouchableOpacity>
                        <Text style={styles.itemSoLuong}> {quantity} </Text>
                        <TouchableOpacity style={styles.btnMinus} onPress={decreaseQuantity}>
                            <Image source={require('../Image/minus.png')}/>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.bodyChild}>
                        {sz.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                onPress={() => setSize(item.Size)}
                                style={{
                                    width: 65,
                                    height: 35,
                                    backgroundColor: size === item.Size ? '#D8D8D8' : '#D8D8D8',
                                    borderRadius: 5,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginRight: 5,
                                    marginTop: 10
                                }}
                            >
                                <Text style={{color: size === item.Size ? 'white' : 'black'}}>
                                    {item.Size}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <View style={styles.footer}>
                        <Text style={styles.itemTitle}>
                            {product.name}
                        </Text>
                        <View style={{padding: 17}}>
                            <Text style={styles.footer_Content}>
                                {product.description || 'Chưa có mô tả sản phẩm'}
                            </Text>
                        </View>
                    </View>

                    <View style={{borderWidth: 4, borderColor: '#D8D8D8'}}></View>

                    <View style={styles.rating}>
                        <Text style={styles.rating_Title}>
                            5.0 Đánh giá sản phẩm (138)
                        </Text>

                    </View>
                </View>


            </ScrollView>
            <View style={styles.btnFooter}>
                <TouchableOpacity style={styles.btnWithList}>
                    <Image source={require('../Image/wishlist.png')}/>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnAddtoCart}>
                    <Text>Thêm vào giỏ hàng</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

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
