import {Image, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {useState} from "react";
import {TextInput} from "react-native-paper";

function CartScreen() {


    const [quantity, setQuantity] = useState(1);
    const price = 199000;

    const increaseQuantity = () => setQuantity(quantity + 1);
    const decreaseQuantity = () => {
        if (quantity > 1) setQuantity(quantity - 1);
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff"/>


            {/* Nội dung giỏ hàng */}
            <View style={{flex: 1}}>
                <View style={styles.cartItem}>
                    <Image
                        source={{uri: "https://cdn0199.cdn4s.com/media/238%20ma%CC%82%CC%83u%20.jpg"}}
                        style={styles.productImage}
                    />
                    <View style={styles.productInfo}>
                        <Text style={styles.productTitle}>Áo phông nam thu đông</Text>
                        <Text style={styles.productSize}>Size S</Text>
                        <Text style={styles.productPrice}>{price.toLocaleString()} đ</Text>
                    </View>
                    <View style={styles.quantityContainer}>
                        <TouchableOpacity onPress={decreaseQuantity} style={styles.quantityButton}>
                            <Image source={require('../Image/minus.png')} style={{width: 15, height: 15}}/>
                        </TouchableOpacity>
                        <Text style={styles.quantityText}>{quantity}</Text>
                        <TouchableOpacity onPress={increaseQuantity} style={styles.quantityButton}>
                            <Image source={require('../Image/add.png')} style={{width: 15, height: 15}}/>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Phần thanh toán */}
            <View style={styles.paymentContainer}>
                {/* Mã giảm giá */}
                <View style={styles.discountContainer}>
                    <TextInput style={styles.discountInput} placeholder="Nhập mã khuyến mãi của bạn"/>
                    <TouchableOpacity style={styles.applyButton}>
                        <Image source={require('../Image/next.png')}/>
                    </TouchableOpacity>
                </View>

                {/* Tổng tiền */}
                <View style={styles.totalContainer}>
                    <Text style={styles.totalText}>Thành tiền:</Text>
                    <Text style={styles.totalAmount}>{(price * quantity).toLocaleString()} VND</Text>
                </View>

                {/* Nút thanh toán */}
                <TouchableOpacity style={styles.checkoutButton}>
                    <Text style={styles.checkoutText}>Thanh toán</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#fff"
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginLeft: 10
    },
    cartItem: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20
    },
    productImage: {
        width: 80,
        height: 80,
        borderRadius: 8
    },
    productInfo: {
        flex: 1,
        marginLeft: 12
    },
    productTitle: {
        fontSize: 16,
        fontWeight: "bold"
    },
    productSize: {
        fontSize: 14,
        color: "gray",
        marginVertical: 4
    },
    productPrice: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333"
    },
    quantityContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    quantityButton: {
        width: 25,
        height: 25,
        borderRadius: 12.5,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#000",
        backgroundColor: "#fff"
    },
    quantityText: {
        fontSize: 16,
        marginHorizontal: 12
    },

    // Căn phần thanh toán xuống cuối
    paymentContainer: {
        justifyContent: "flex-end",
        paddingBottom: 20
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
        backgroundColor: '@null',

    },
    applyButton: {
        padding: 13,
        borderRadius: 10,
        backgroundColor: '#C5CCC9',

    },

    totalContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20
    },
    totalText: {
        fontSize: 16,
        fontWeight: "bold"
    },
    totalAmount: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#E53935"
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
        fontWeight: "bold"
    },
});
export default CartScreen;
