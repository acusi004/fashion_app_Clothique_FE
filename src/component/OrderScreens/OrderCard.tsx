import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

// @ts-ignore
const OrderCard = ({ order }) => {
    const product = order.orderItems.reverse()[0];// hiển thị sản phẩm đầu tiên
    const variant = product.variantId;
    const productInfo = product.productId;

    // Đảm bảo lấy đúng ảnh của sản phẩm
    const productImage = variant.images?.[0] || '';


    return (
        <View style={styles.card}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.favorite}>Yêu thích+</Text>
                <Text style={styles.shopName}>Clothique</Text>
                <Text style={styles.status}>
                    {
                        (() => {
                            let newStatus = "";
                            let history = "";

                            switch (order.orderStatus) {
                                case "Pending":
                                    newStatus = "Đang xử lý";
                                    history = "Đang chuẩn bị hàng";
                                    break;
                                case "Processing":
                                    newStatus = "Đơn hàng đang được chuẩn bị";
                                    history = "Đang giao hàng";
                                    break;
                                case "Shipped":
                                    newStatus = "Đang giao hàng";
                                    history = "Đang giao hàng";
                                    break;
                                case "Delivered":
                                    newStatus = "Đã giao";
                                    history = "Đã giao hàng";
                                    break;
                                default:
                                    newStatus = "Trạng thái không xác định";
                                    history = "Lỗi trạng thái";
                            }

                            return newStatus;
                        })()
                    }
                </Text>
            </View>

            {/* Product */}
            <View style={styles.productContainer}>
                <Image
                    source={{ uri: `http://10.0.2.2:5000${productImage}` }}
                    style={styles.productImage}
                />
                <View style={styles.productInfo}>
                    <Text numberOfLines={1} style={styles.productName}>
                        {productInfo.name}
                    </Text>
                    <Text style={styles.variantText}>
                        {variant.size} - {variant.color}
                    </Text>
                    <Text style={styles.price}>₫{variant.price.toLocaleString()}</Text>
                    <Text style={styles.quantity}>x{product.quantity}</Text>
                </View>
            </View>

            {/* Shipping Address */}
            <View style={styles.shippingAddress}>
                <Text style={styles.addressLabel}>Địa chỉ giao hàng:</Text>
                <Text>{order.shippingAddress.name}</Text>
                <Text>{order.shippingAddress.phoneNumber}</Text>
                <Text>
                    {order.shippingAddress.addressDetail}, {order.shippingAddress.districtId} - {order.shippingAddress.wardCode}
                </Text>
            </View>

            {/* Total */}
            <Text style={styles.total}>
                Tổng số tiền ({product.quantity} sản phẩm): ₫{order.totalAmount.toLocaleString()}
            </Text>

            {/* Trạng thái giao hàng + Button */}
            {order.orderStatus === 'Delivered' && (
                <View style={styles.footer}>
                    <Text style={styles.deliveryNote}>Giao hàng thành công vào 09 Th04</Text>
                    <View style={styles.buttons}>
                        <TouchableOpacity style={styles.btnOutline}>
                            <Text>Trả hàng/Hoàn tiền</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btnPrimary}>
                            <Text style={{ color: '#B35A00' }}>Đã nhận được hàng</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
};

export default OrderCard;

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        padding: 12,
        marginVertical: 8,
        borderRadius: 8,
        elevation: 2,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    favorite: {
        backgroundColor: '#FF3E3E',
        color: 'white',
        paddingHorizontal: 6,
        fontSize: 12,
        borderRadius: 3,
    },
    shopName: {
        fontWeight: 'bold',
        marginLeft: 6,
        flex: 1,
    },
    status: {
        color: '#B35A00',
        fontWeight: '600',
    },
    productContainer: {
        flexDirection: 'row',
        marginTop: 10,
    },
    productImage: {
        width: 80,
        height: 80,
        borderRadius: 6,
    },
    productInfo: {
        marginLeft: 10,
        flex: 1,
    },
    productName: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    variantText: {
        color: '#555',
        fontSize: 12,
    },
    price: {
        fontSize: 14,
        fontWeight: '600',
        marginTop: 4,
    },
    quantity: {
        fontSize: 12,
        color: '#777',
    },
    total: {
        textAlign: 'right',
        fontWeight: 'bold',
        marginTop: 10,
    },
    shippingAddress: {
        marginTop: 10,
    },
    addressLabel: {
        fontWeight: 'bold',
    },
    footer: {
        marginTop: 12,
    },
    deliveryNote: {
        backgroundColor: '#e0f9f2',
        padding: 8,
        borderRadius: 4,
        color: '#1abc9c',
        marginBottom: 10,
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    btnOutline: {
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderColor: '#ccc',
        borderWidth: 1,
        marginRight: 8,
        borderRadius: 4,
    },
    btnPrimary: {
        backgroundColor: '#fff3e6',
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#B35A00',
    },
});
