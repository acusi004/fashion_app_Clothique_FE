import axios from 'axios';
import tokenService from './tokenService';

const BASE_URL = 'http://10.0.2.2:5000/v1/order'; // thay bằng domain thật


export const fetchOrdersByStatus = async (status: string) => {
    try {
        const token = await tokenService.getToken();
        const response = await axios.get(`${BASE_URL}/getAllOrders`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        // Chỉ lọc khi truyền vào status, nếu không truyền thì trả hết

        const filtered = status

            ? response.data.orders.filter((order: any) => order.orderStatus === status)
            : response.data.orders;

        return filtered;
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw error;
    }
};

export const fetchOrders = async () => {
    try {
        const token = await tokenService.getToken();
        const response = await axios.get(`${BASE_URL}/getAllOrders`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        // Trả về toàn bộ danh sách đơn hàng mà không cần lọc
        return response.data.orders;
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw error;
    }
};

export const getUnpaidOrders = async () => {
    try {
        const token = await tokenService.getToken();
        const response = await axios.get(`${BASE_URL}/getAllOrders`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        // Log toàn bộ dữ liệu trả về để kiểm tra
        console.log('Dữ liệu trả về từ API:', response.data);

        // Kiểm tra và trích xuất orders nếu có
        const orders = response.data.orders || []; // Truy cập trường orders nếu có
        console.log('Danh sách orders sau khi trích xuất:', orders);

        if (!Array.isArray(orders)) {
            console.error('Dữ liệu trả về không phải mảng:', orders);
            throw new Error('Dữ liệu trả về không phải mảng');
        }

        const unpaidOrders = orders.filter(order =>
            order.paymentStatus === 'Pending' &&
            order.orderItems.some(item => item.orderStatus === 'Pending')
        );

        return unpaidOrders;
    } catch (error) {
        console.error('Lỗi khi lấy đơn hàng:', error.message || error);
        throw error;
    }
};




