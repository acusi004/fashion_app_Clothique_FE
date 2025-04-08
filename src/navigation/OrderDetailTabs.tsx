import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import EmptyOrder from "../component/EmptyOrder.tsx";
import {useRoute} from "@react-navigation/native";
 // màn hình hiển thị khi chưa có đơn

const Tab = createMaterialTopTabNavigator();

const OrderDetailTabs = () => {


    const route = useRoute();
    // @ts-ignore
    const initialTab = route.params?.initialTab || 'Chờ xác nhận';
    return (

        <Tab.Navigator
            initialRouteName={initialTab}
            screenOptions={{
                tabBarLabelStyle: { fontSize: 13, fontWeight: '500' },
                tabBarItemStyle: { width: 130 },
                tabBarScrollEnabled: true,
                tabBarIndicatorStyle: { backgroundColor: '#ff4d00', height: 2 },
                tabBarActiveTintColor: '#000',
                tabBarInactiveTintColor: '#333',
            }}
        >
            <Tab.Screen name="Chờ thanh toán" component={EmptyOrder} />
            <Tab.Screen name="Chờ xác nhận" component={EmptyOrder} />
            <Tab.Screen name="Đang chuẩn bị hàng" component={EmptyOrder} />
            <Tab.Screen name="Chờ giao hàng" component={EmptyOrder} />
            <Tab.Screen name="Đã giao hàng" component={EmptyOrder} />
            <Tab.Screen name="Đã huỷ" component={EmptyOrder} />
        </Tab.Navigator>
    );
};

export default OrderDetailTabs;
