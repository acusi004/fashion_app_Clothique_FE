    import {ActivityIndicator, FlatList, RefreshControl, Text, View} from "react-native";
    import {useCallback, useEffect, useState} from "react";
    import {fetchOrdersByStatus} from "../../service/OrderService";
    import OrderCard from "./OrderCard.tsx";
    import EmptyOrder from "../EmptyOrder.tsx";
    import {useFocusEffect} from "@react-navigation/native";

    // @ts-ignore
    function DaGiaoHang({navigation}){

        const [orders, setOrders] = useState([]);
        const [loading, setLoading] = useState(true);
        const [refreshing, setRefreshing] = useState(false); // Trạng thái làm mới


        // Hàm để làm mới khi kéo xuống
        const onRefresh = async () => {
            setRefreshing(true);
            await loadOrders(); // Tải lại đơn hàng
            setRefreshing(false); // Đánh dấu làm mới xong
        };
        const loadOrders = async () => {
            try {

                const data = await fetchOrdersByStatus('Delivered');
                setOrders(data.reverse());

                console.log(data)
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };



        useEffect(() => {
            loadOrders();
        }, []);
        useFocusEffect(
            useCallback(() => {
                loadOrders();
            }, [])
        );
        if (loading) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#000" />
                </View>
            );
        }

        return(
            <View style={{flex:1}}>
                <View style={{ flex: 1, padding: 12 }}>
                    <FlatList

                        data={orders}
                        // @ts-ignore
                        keyExtractor={(item) => item._id}
                        renderItem={({ item }) => (
                            <OrderCard onCancelOrder={() => {}} order={item} />
                        )}

                        ListEmptyComponent={<EmptyOrder/>}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh} // Gọi hàm onRefresh khi kéo
                            />
                        }
                    />
                </View>

            </View>
        )
    }

    export default DaGiaoHang;
