import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Image, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-paper";
import tokenService from '../service/tokenService';

function CartScreen() {
    const [quantity, setQuantity] = useState(1);
    const [cartData, setCartData] = useState([]); // Lưu dữ liệu từ API
    const price = 199000;

    const increaseQuantity = () => setQuantity(quantity + 1);
    const decreaseQuantity = () => {
        if (quantity > 1) setQuantity(quantity - 1);
    };
    
    // ✅ Đặt hàm async bên trong useEffect
    useEffect(() => {
        console.log(1);
       
        const fetchCart = async () => {
            try {
                const token = await tokenService.getToken();
             
                if (!token) {
                    console.warn('Chưa có token, vui lòng đăng nhập trước.');
                    return;
                }
        
                const response = await fetch('http://10.0.2.2:5000/v1/cart/', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`, // Gửi token
                    },
                });
        
                console.log('Response status:', response.status);
                const text = await response.text();
                console.log('Raw response:', text);
        
                if (response.status === 401) {
                    console.warn('Lỗi 401: Token không hợp lệ hoặc đã hết hạn.');
                    return;
                }
        
                const data = JSON.parse(text);
                setCartData(data.items || []);
            } catch (error) {
                console.error('Lỗi khi gọi API:', error);
            }
        };
        
        
        fetchCart(); // Gọi API
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <View style={{ flex: 1 }}>
                {cartData.length > 0 ? (
                    cartData.map((item) => (
                        <View key={item.id} style={styles.cartItem}>
                            <Image source={{ uri: item.image }} style={styles.productImage} />
                            <View style={styles.productInfo}>
                                <Text style={styles.productTitle}>{item.name}</Text>
                                <Text style={styles.productSize}>Size {item.size}</Text>
                                <Text style={styles.productPrice}>{item.price.toLocaleString()} đ</Text>
                            </View>

                            <View style={styles.quantityContainer}>
                                <TouchableOpacity onPress={decreaseQuantity} style={styles.quantityButton}>
                                    <Image source={require('../Image/minus.png')} style={{ width: 15, height: 15 }} />
                                </TouchableOpacity>
                                <Text style={styles.quantityText}>{quantity}</Text>
                                <TouchableOpacity onPress={increaseQuantity} style={styles.quantityButton}>
                                    <Image source={require('../Image/add.png')} style={{ width: 15, height: 15 }} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                ) : (
                    <Text style={{ textAlign: "center", marginTop: 20 }}>Giỏ hàng trống</Text>
                )}
            </View>

            {/* Phần thanh toán */}
            <View style={styles.paymentContainer}>
                <View style={styles.discountContainer}>
                    <TextInput style={styles.discountInput} placeholder="Nhập mã khuyến mãi của bạn" />
                    <TouchableOpacity style={styles.applyButton}>
                        <Image source={require('../Image/next.png')} />
                    </TouchableOpacity>
                </View>

                <View style={styles.totalContainer}>
                    <Text style={styles.totalText}>Thành tiền:</Text>
                    <Text style={styles.totalAmount}>{(price * quantity).toLocaleString()} VND</Text>
                </View>

                <TouchableOpacity style={styles.checkoutButton}>
                    <Text style={styles.checkoutText}>Thanh toán</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#fff",
    },
    cartItem: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    productImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
    },
    productInfo: {
        flex: 1,
        marginLeft: 12,
    },
    productTitle: {
        fontSize: 16,
        fontWeight: "bold",
    },
    productSize: {
        fontSize: 14,
        color: "gray",
        marginVertical: 4,
    },
    productPrice: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    quantityContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    quantityButton: {
        width: 25,
        height: 25,
        borderRadius: 12.5,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#000",
        backgroundColor: "#fff",
    },
    quantityText: {
        fontSize: 16,
        marginHorizontal: 12,
    },
    paymentContainer: {
        justifyContent: "flex-end",
        paddingBottom: 20,
    },
    discountContainer: {
        flexDirection: "row",
        borderWidth: 1,
        borderRadius: 8,
        padding: 8,
        marginBottom: 20,
        alignItems: "center",
    },
    discountInput: {
        flex: 1,
        fontSize: 14,
        backgroundColor: "transparent",
    },
    applyButton: {
        padding: 13,
        borderRadius: 10,
        backgroundColor: "#C5CCC9",
    },
    totalContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    totalText: {
        fontSize: 16,
        fontWeight: "bold",
    },
    totalAmount: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#E53935",
    },
    checkoutButton: {
        backgroundColor: "black",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
    },
    checkoutText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default CartScreen;
