import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import {orderLabelToTab} from "../styles/orderTabMapping.ts";

// @ts-ignore
const OrderScreen = ({navigation}) => {
    const orderStatus = [
        { label: 'Chờ xác nhận', icon: require('../Image/wallet.png'), count: 0 },
        { label: 'Đang chuẩn bị hàng', icon: require('../Image/package-box.png'), count: 0 },
        { label: 'Chờ giao hàng', icon: require('../Image/delivery-truck.png'), count: 1 },
        { label: 'Đánh giá', icon: require('../Image/star-icon.png'), count: 3 },
    ];

    return (
        <View style={{ backgroundColor: '#fff' }}>
            {/* PHẦN TIÊU ĐỀ */}
            <View style={styles.header}>
                <Text style={styles.headerLeft}>Đơn mua</Text>
                <TouchableOpacity onPress={()=> navigation.navigate('OrderHistory')}>
                    <Text style={styles.headerRight}>Xem lịch sử mua hàng &gt;</Text>
                </TouchableOpacity>
            </View>

            {/* DANH SÁCH TRẠNG THÁI */}
            <View style={styles.container}>
                {orderStatus.map((item, index) => (
                    <TouchableOpacity
                        style={styles.item}
                        key={index}
                        onPress={() => {
                            const tabName = orderLabelToTab[item.label] || 'Chờ xác nhận';
                            navigation.navigate('OrderDetailTabs', { initialTab: tabName });
                        }}
                    >
                        <View style={styles.iconWrapper}>
                            <Image source={item.icon} style={styles.iconImage} resizeMode="contain" />
                            {item.count > 0 && (
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>{item.count}</Text>
                                </View>
                            )}
                        </View>
                        <Text style={styles.label}>{item.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

export default OrderScreen;

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 14,
        paddingVertical: 12,
        alignItems: 'center',
        borderBottomWidth: 0.5,
        borderBottomColor: '#ccc',
    },
    headerLeft: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    headerRight: {
        fontSize: 13,
        color: '#555',
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 20,
        backgroundColor: '#fff',
    },
    item: {
        alignItems: 'center',
        width: 70,
    },
    iconWrapper: {
        position: 'relative',
        marginBottom: 6,
    },
    iconImage: {
        width: 30,
        height: 30,
    },
    badge: {
        position: 'absolute',
        top: -6,
        right: -10,
        backgroundColor: 'red',
        borderRadius: 10,
        paddingHorizontal: 5,
        paddingVertical: 1,
        minWidth: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    badgeText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: 'bold',
    },
    label: {
        fontSize: 12,
        color: '#000',
        textAlign: 'center',
    },

});
