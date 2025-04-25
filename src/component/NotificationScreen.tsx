import {FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import DetailScreen from "./DetailScreen.tsx";
import {useEffect, useState} from "react";
import tokenService from "../service/tokenService.js";

function NotificationScreen() {

    const notification = [
        {
            id: "1",
            title: "Your order #123456789 has been confirmed",
            description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Turpis pretium et in arcu adipiscing nec.",
            image: "https://cdn0199.cdn4s.com/media/o%20ph%C3%B4ng%20c%E1%BB%99c%20tay/275270794_508218257533241_3115723458973560039_n.jpg", // Ảnh minh họa
            isNew: true,
        },
        {
            id: "2",
            title: "Your order #123456789 has been canceled",
            description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Turpis pretium et in arcu adipiscing nec.",
            image: "https://cdn0199.cdn4s.com/media/o%20ph%C3%B4ng%20c%E1%BB%99c%20tay/275543008_445549064014327_1189472481875048791_n.jpg",
            isNew: false,
        },
    ];
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
            // Nếu response không thành công (ví dụ: 401, 500,...)
            const errorData = await response.json();
            console.error('Server error:', errorData);
            return;
          }
      
          const result = await response.json();
          setNotifications(result);  // Giả sử API trả về: { data: [...] }
      
          console.log('Fetched notifications:', result);
        } catch (error) {
          console.error('Error fetching notifications:', error);
        } finally {
          setLoading(false);
        }
      };
      

    useEffect(() => {
        fetchNotifications();
      }, []);

      
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Thông báo</Text>

            <FlatList
                data={notifications}
                keyExtractor={(item) => item._id}
                renderItem={({item}) => (
                    <View style={styles.card}>
                        <Image source={require('../Image/logo.png')} style={styles.image}/>
                        <View style={styles.textContainer}>
                            <Text style={styles.title}>{item.title}</Text>
                            <Text style={styles.description}>{item.message}</Text>
                        </View>
                        {item.isNew && <Text style={styles.newBadge}>New</Text>}
                    </View>
                )}
            />
        </View>
    )
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
    },
    newBadge: {
        fontSize: 12,
        fontWeight: "bold",
        color: "red",
    },
});


export default NotificationScreen;
