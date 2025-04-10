// ChoXacNhan.js
import React, { useEffect, useState } from 'react';
import { FlatList, ActivityIndicator, View, RefreshControl, Text } from 'react-native';
import { getUnpaidOrders } from '../../service/OrderService'; // Import hàm từ OrderService
import OrderCard from './OrderCard.tsx';
import EmptyOrder from '../EmptyOrder.tsx';

function ChoThanhToan() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false); // Trạng thái làm mới

    // Hàm để làm mới khi kéo xuống
    const onRefresh = async () => {
        setRefreshing(true);
        await loadOrders(); // Tải lại đơn hàng
        setRefreshing(false); // Đánh dấu làm mới xong
    };

    // Hàm tải các đơn hàng chưa thanh toán
    const loadOrders = async () => {
        try {
            const response = await getUnpaidOrders(); // Gọi hàm từ OrderService

            // Kiểm tra dữ liệu trả về và log kết quả
            console.log('Dữ liệu trả về từ getUnpaidOrders:', response);

            setOrders(response); // Cập nhật danh sách đơn hàng
        } catch (error) {
            console.error('Lỗi khi tải đơn hàng:', error);
        } finally {
            setLoading(false); // Dừng trạng thái loading
        }
    };


    useEffect(() => {
        loadOrders(); // Tải các đơn hàng khi component mount
    }, []);

    // Hàm xử lý khi hủy đơn hàng
    const handleCancelOrder = (orderId) => {
        // Cập nhật trạng thái UI hoặc gọi API để hủy đơn hàng
        setOrders(orders.filter(order => order._id !== orderId));
    };

    // Hiển thị loading khi dữ liệu đang được tải
    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#000" />
            </View>
        );
    }

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={orders}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => <OrderCard onCancelOrder={handleCancelOrder} order={item} />}
                ListEmptyComponent={<EmptyOrder />}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh} // Gọi hàm onRefresh khi kéo
                    />
                }
            />
        </View>
    );
}

export default ChoThanhToan;
