import { ActivityIndicator, FlatList, RefreshControl, Text, View } from "react-native";
import { useEffect, useState } from "react";
import { fetchOrdersByStatus } from '../../service/OrderService';
import OrderCard from "./OrderCard.tsx";
import EmptyOrder from "../EmptyOrder.tsx";

function ChoXacNhan() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false); // Trạng thái làm mới
    const [orderList, setOrderList] = useState(orders);

    // Hàm để làm mới khi kéo xuống
    const onRefresh = async () => {
        setRefreshing(true);
        await loadOrders(); // Tải lại đơn hàng
        setRefreshing(false); // Đánh dấu làm mới xong
    };

    const loadOrders = async () => {
        try {
            // Lấy đơn hàng đang chờ xác nhận (Pending)
            const data = await fetchOrdersByStatus('Pending');
            setOrders(data.reverse());
            setOrderList(data.reverse()); // Cập nhật danh sách đơn hàng sau khi hủy
            console.log(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrders();
    }, []);

    // @ts-ignore
    const handleCancelOrder = async (orderId) => {
        try {
            // Gọi API để hủy đơn hàng (giả sử có một API để hủy đơn hàng)
            // Bạn có thể cập nhật trạng thái ở đây nếu cần
            setOrderList(orderList.filter(order => order._id !== orderId)); // Cập nhật danh sách UI
            await loadOrders(); // Tự động tải lại đơn hàng sau khi hủy thành công
        } catch (error) {
            console.error("Error canceling order:", error);
        }
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#000" />
            </View>
        );
    }

    return (
        <View style={{ flex: 1 }}>
            <View style={{ flex: 1, padding: 12 }}>
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
        </View>
    );
}

export default ChoXacNhan;
