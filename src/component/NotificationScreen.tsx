import { FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import DetailScreen from "./DetailScreen.tsx";
import { useEffect, useState } from "react";
import tokenService from "../service/tokenService.js";

function NotificationScreen() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertHeader, setAlertHeader] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const BASE_URL = 'http://10.0.2.2:5000';

    const showAlert = (header: string, message: string) => {
        setAlertHeader(header);
        setAlertMessage(message);
        setAlertVisible(true);
    };

  const fetchNotifications = async () => {
    const currentUser = await tokenService.getUserIdFromToken();
    const currentUserId = currentUser?.userId;
    try {
      const token = await tokenService.getToken();

      if (!token) {
        return showAlert('Thông báo', 'Vui lòng đăng nhập trước!');
      }

      const response = await fetch(`${BASE_URL}/v1/notifications/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error:', errorData);
        return;
      }

      const result = await response.json();
      const userNotifications = result
        .filter((item) => item.userId === currentUserId)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Thêm đoạn này để sắp xếp thông báo

      setNotifications(userNotifications);

      console.log('Fetched notifications:', userNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
        fetchNotifications();
    }, []);

    // Hàm định dạng thời gian
    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Thông báo</Text>

            <FlatList
    data={notifications}
    keyExtractor={(item) => item._id}
    renderItem={({ item }) => (
        <View style={styles.card}>
            <Image source={require('../Image/logo.png')} style={styles.image} />
            <View style={styles.textContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.message}</Text>
                <Text style={styles.time}>
                    {formatDateTime(item.createdAt)}
                </Text>
            </View>
        </View>
    )}
    ListEmptyComponent={
        !loading && (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Không có thông báo nào</Text>
            </View>
        )
    }
/>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 10,
    },
    header: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 10,
    },
    card: {
        flexDirection: "row",
        backgroundColor: "#f8f8f8",
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
        alignItems: "center",
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 8,
    },
    textContainer: {
        flex: 1,
        marginLeft: 10,
    },
    title: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#333",
    },
    description: {
        fontSize: 12,
        color: "#666",
        marginTop: 4,
    },
    time: {
        fontSize: 10,
        color: "#999",
        marginTop: 4,
    },
    newBadge: {
        fontSize: 12,
        fontWeight: "bold",
        color: "red",
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50,
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
    },

});

export default NotificationScreen;
