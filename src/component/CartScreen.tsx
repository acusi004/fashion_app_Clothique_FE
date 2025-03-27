import {useEffect, useState} from "react";
import {Image, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Checkbox, TextInput} from "react-native-paper";
import tokenService from "../service/tokenService";
import {SwipeListView} from "react-native-swipe-list-view";

function CartScreen() {
    const [cartData, setCartData] = useState([]); // Dữ liệu giỏ hàng từ API
    const [quantities, setQuantities] = useState({}); // Số lượng sản phẩm
    const BASE_URL = "http://10.0.2.2:5000"; // API local
    const [selectedItems, setSelectedItems] = useState<string[]>([]);

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const token = await tokenService.getToken();
                if (!token) {
                    console.warn("Chưa có token, vui lòng đăng nhập trước.");
                    return;
                }

                const response = await fetch(`${BASE_URL}/v1/cart/`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status === 401) {
                    console.warn("Lỗi 401: Token không hợp lệ hoặc đã hết hạn.");
                    return;
                }

                const data = await response.json();
                setCartData(data.cart || []);

                // Cập nhật số lượng ban đầu của từng sản phẩm
                const initialQuantities: Record<string, number> = {};
                // @ts-ignore
                data.cart.forEach((item) => {
                    // @ts-ignore
                    initialQuantities[item.productId._id] = item.quantity;
                });
                setQuantities(initialQuantities);
            } catch (error) {
                console.error("Lỗi khi gọi API:", error);
            }
        };

        fetchCart();
    }, []);

    // @ts-ignore
    const deleteCartItem = async (cartId) => {
        try {
            const token = await tokenService.getToken();
            if (!token) {
                console.warn("Chưa có token, vui lòng đăng nhập trước.");
                return;
            }

            const response = await fetch(`${BASE_URL}/v1/cart/delete-cart/${cartId}`, { // 👈 Truyền ID vào URL
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const text = await response.text();
                console.error("Lỗi từ server:", text);
                return;
            }

            console.log(`Sản phẩm ${cartId} đã bị xóa.`);
            // @ts-ignore
            setCartData(cartData.filter(item => item._id !== cartId));
        } catch (error) {
            console.error("Lỗi khi gọi API:", error);
        }
    };

    // @ts-ignore
    const updateCartItem = async (cartId, quantity) => {
        try {
            const token = await tokenService.getToken();
            if (!token) {
                console.warn("Chưa có token, vui lòng đăng nhập trước.");
                return;
            }

            const response = await fetch(`${BASE_URL}/v1/cart/update-cart`, { // ❌ Xoá cartId khỏi URL
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({cartItemId: cartId, quantity}) // ✅ Truyền cartItemId vào body
            });

            if (!response.ok) {
                const text = await response.text();
                console.error("Lỗi từ server:", text);
                return;
            }

            const updatedItem = await response.json();
            console.log(`Sản phẩm ${cartId} đã cập nhật thành công.`);

            // @ts-ignore
            setCartData(prevCart =>
                prevCart.map((item: { _id: string; quantity?: number }) =>
                    item._id === cartId ? {...item, quantity} : item
                )
            );
        } catch (error) {
            console.error("Lỗi khi gọi API:", error);
        }
    };


    // @ts-ignore
    const increaseQuantity = (productId, cartId) => {
        const newQuantity = ((quantities as Record<string, number>)[productId] || 1) + 1;
        setQuantities(prev => ({...prev, [productId]: newQuantity}));
        updateCartItem(cartId, newQuantity);
    };

    const decreaseQuantity = (productId: string, cartId: string) => {
        if ((quantities as Record<string, number>)[productId] > 1) {
            const newQuantity = (quantities as Record<string, number>)[productId] - 1;
            setQuantities(prev => ({...prev, [productId]: newQuantity}));
            updateCartItem(cartId, newQuantity);
        }
    };
    // Xóa sản phẩm khỏi giỏ hàng
    const removeItem = (productId: string) => {
        setCartData((prevCart) => prevCart.filter((item: { _id: string }) => item._id !== productId));
    };

    // Lấy đường dẫn ảnh sản phẩm
    const getFullImageUrl = (imagePath: string) => {
        return imagePath.startsWith("/uploads/") ? `${BASE_URL}${imagePath}` : imagePath;
    };

    // @ts-ignore
    const toggleSelectItem = (cartId) => {
        setSelectedItems((prev) => {
                return prev.includes(cartId) ? prev.filter((id) => id !== cartId) : [...prev, cartId];
            }
        );
    };


    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <View style={{ flex: 1 }}>
                <SwipeListView
                    data={cartData}
                    keyExtractor={(item) => item._id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.cartItem}>
                            <Checkbox
                                status={selectedItems.includes(item._id) ? "checked" : "unchecked"}
                                onPress={() => toggleSelectItem(item._id)}
                            />
                            <Image
                                source={{
                                    uri:
                                        item.variantId.images && item.variantId.images.length > 0
                                            ? getFullImageUrl(item.variantId.images[0])
                                            : "https://via.placeholder.com/300",
                                }}
                                style={styles.productImage}
                            />

                            <View style={styles.productInfo}>
                                <Text style={styles.productTitle}>{item.productId.name}</Text>
                                <Text style={styles.productSize}>Size {item.variantId.size}</Text>
                                <Text style={styles.productPrice}>
                                    {item.variantId?.price ? (item.variantId.price * item.quantity).toLocaleString() : "Chưa có giá"} đ
                                </Text>

                            </View>

                            <View style={styles.quantityContainer}>
                                <TouchableOpacity
                                    onPress={() => {
                                        decreaseQuantity(item.productId._id, item._id)

                                    }}
                                    style={styles.quantityButton}
                                >
                                    <Image source={require("../Image/minus.png")} style={{ width: 15, height: 15 }} />
                                </TouchableOpacity>
                                <Text style={styles.quantityText}>{quantities[item.productId._id] || item.quantity}</Text>
                                <TouchableOpacity
                                    onPress={() => increaseQuantity(item.productId._id, item._id)}
                                    style={styles.quantityButton}
                                >
                                    <Image source={require("../Image/add.png")} style={{ width: 15, height: 15 }} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                    renderHiddenItem={({ item }) => (
                        <View style={styles.hiddenContainer}>
                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={() => deleteCartItem(item._id)}
                            >
                                <Text style={styles.deleteText}>Xóa</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    rightOpenValue={-75}
                    disableRightSwipe
                />
            </View>
            <TouchableOpacity
                style={styles.checkoutButton}
                onPress={() => console.log("Sản phẩm chọn để thanh toán:", selectedItems)}
            >
                <Text style={styles.checkoutText}>Thanh toán ({selectedItems.length})</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#fff"
    },
    cartItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
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
        backgroundColor: "#fff",
    },
    quantityText: {fontSize: 16, marginHorizontal: 12},
    hiddenContainer: {
        alignItems: "flex-end",
        justifyContent: "center",
        flex: 1,
        backgroundColor: "#ff3b30",
        borderRadius: 8,
        marginBottom: 20,
    },
    deleteButton: {
        backgroundColor: "#ff3b30",
        justifyContent: "center",
        alignItems: "center",
        width: 75,
        height: "100%"
    },
    deleteText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold"
    },
    checkoutButton: {
        backgroundColor: "black",
        padding: 15, borderRadius: 8,
        alignItems: "center"
    },
    checkoutText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold"
    },

});

export default CartScreen;
