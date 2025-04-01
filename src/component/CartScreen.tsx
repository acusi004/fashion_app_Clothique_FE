// CartScreen.js
import React, { useCallback, useEffect, useState } from "react";
import {
    Alert,
    Image, ListRenderItemInfo,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Checkbox } from "react-native-paper";
import { SwipeListView } from "react-native-swipe-list-view";

import CartItem from "./CartItem";
import {deleteCartItemAPI, fetchCartDataAPI, updateCartItemAPI} from "../service/cartService"; // Import component CartItem

const BASE_URL = "http://10.0.2.2:5000";

function CartScreen() {
    const [cartData, setCartData] = useState<{ _id: string; productId: { _id: string }; quantity: number }[]>([]);
    const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
    const [selectedItems, setSelectedItems] = useState<string[]>([]);

    const fetchCart = useCallback(async () => {
        try {
            const data = await fetchCartDataAPI();
            setCartData(data);
            const initialQuantities = {};
            // @ts-ignore
            data.forEach((item) => {
                // @ts-ignore
                initialQuantities[item.productId._id] = item.quantity;
            });
            setQuantities(initialQuantities);
        } catch (error) {
            console.error("Lỗi khi gọi API:", error);
        }
    }, []);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    // @ts-ignore
    const handleDeleteCartItem = useCallback(async (cartId) => {
        try {
            await deleteCartItemAPI(cartId);
            setCartData((prev) => prev.filter((item) => item._id !== cartId));
        } catch (error) {
            console.error("Lỗi khi xóa sản phẩm:", error);
        }
    }, []);

    const handleUpdateCartItem = useCallback(
        async (cartId: string, productId: string, newQuantity: number) => {
            try {
                await updateCartItemAPI(cartId, newQuantity);
                setQuantities((prev) => ({ ...prev, [productId]: newQuantity }));
                setCartData((prev) =>
                    prev.map((item) =>
                        item._id === cartId ? { ...item, quantity: newQuantity } : item
                    )
                );
            } catch (error) {
                console.error("Lỗi khi cập nhật sản phẩm:", error);
            }
        },
        []
    );

    const handleIncreaseQuantity = useCallback(
        (productId: string, cartId: string) => {
            const currentQty = quantities[productId] || 1;
            const newQuantity = currentQty + 1;
            handleUpdateCartItem(cartId, productId, newQuantity);
        },
        [quantities, handleUpdateCartItem]
    );

    const handleDecreaseQuantity = useCallback(
        (productId: string, cartId: string) => {
            const currentQty = quantities[productId] || 1;
            if (currentQty > 1) {
                const newQuantity = currentQty - 1;
                handleUpdateCartItem(cartId, productId, newQuantity).then(r => console.log(r));
            }
        },
        [quantities, handleUpdateCartItem]
    );

    // @ts-ignore
    const getFullImageUrl = useCallback((imagePath) => {
        return imagePath.startsWith("/uploads/")
            ? `${BASE_URL}${imagePath}`
            : imagePath;
    }, []);

    // @ts-ignore
    const toggleSelectItem = useCallback((cartId) => {
        setSelectedItems((prev) =>
            prev.includes(cartId)
                ? prev.filter((id) => id !== cartId)
                : [...prev, cartId]
        );
    }, []);

    const renderItem = useCallback(
        (rowData: ListRenderItemInfo<{ _id: string; productId: { _id: string }; quantity: number }>) => (
            <CartItem
                item={rowData.item}
                quantity={quantities[rowData.item.productId._id]}
                isSelected={selectedItems.includes(rowData.item._id)}
                onIncrease={handleIncreaseQuantity}
                onDecrease={handleDecreaseQuantity}
                onToggleSelect={toggleSelectItem}
                getFullImageUrl={getFullImageUrl}
            />
        ),
        [
            quantities,
            selectedItems,
            handleIncreaseQuantity,
            handleDecreaseQuantity,
            toggleSelectItem,
            getFullImageUrl,
        ]
    );

    const renderHiddenItem = useCallback(
        ({ item }: { item: { _id: string } }) => (
            <View style={styles.hiddenContainer}>
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteCartItem(item._id)}
                >
                    <Text style={styles.deleteText}>Xóa</Text>
                </TouchableOpacity>
            </View>
        ),
        [handleDeleteCartItem]
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <View style={{ flex: 1 }}>
                <SwipeListView
                    data={cartData}
                    keyExtractor={(item) => item._id.toString()}
                    renderItem={renderItem}
                    renderHiddenItem={renderHiddenItem}
                    rightOpenValue={-75}
                    disableRightSwipe
                />
            </View>
            <TouchableOpacity
                style={styles.checkoutButton}
                onPress={() =>
                    console.log("Sản phẩm chọn để thanh toán:", selectedItems)
                }
            >
                <Text style={styles.checkoutText}>
                    Thanh toán ({selectedItems.length})
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#fff",
    },
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
        height: "100%",
    },
    deleteText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
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
