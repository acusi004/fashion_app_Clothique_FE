import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity, Image, Alert } from "react-native";
import io from "socket.io-client";
import { useNavigation } from "@react-navigation/native";
import tokenService from "../service/tokenService";

const socket = io("http://10.0.2.2:5000");

const ChatScreen = ({ route }) => {
    const navigation = useNavigation();
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [userId, setUserId] = useState(null);
    const adminId = "admin";

    useEffect(() => {
        const initializeChat = async () => {
            const accessToken = await tokenService.getToken();
            if (!accessToken) {
                Alert.alert("Bạn cần đăng nhập để sử dụng chat.");
                navigation.navigate("LoginScreen");
                return;
            }
    
            const extractedUserId = await tokenService.getUserIdFromToken();
            console.log("Extracted User ID:", extractedUserId); // Kiểm tra giá trị
    
            if (!extractedUserId) {
                Alert.alert("Không thể lấy User ID. Hãy đăng nhập lại.");
                navigation.navigate("LoginScreen");
                return;
            }
    
            setUserId(extractedUserId);
            socket.auth = { token: accessToken };
            socket.connect();
    
            socket.emit("register", { userId: extractedUserId, username: "User" });
    
            socket.on("privateMessage", (data) => {
                setMessages((prevMessages) => [...prevMessages, data]);
            });
    
            return () => {
                socket.off("privateMessage");
            };
        };
    
        initializeChat();
    }, []);

    const sendMessage = async () => {
        if (message.trim() === "") return;

        const accessToken = await tokenService.getToken();
        if (!accessToken) {
            Alert.alert("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.");
            navigation.navigate("LoginScreen");
            return;
        }

        const newMessage = {
            sender: userId,
            receiver: adminId,
            message,
            token: accessToken,
        };

        socket.emit("sendPrivateMessage", newMessage);
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setMessage("");
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Image source={require("../Image/back.png")} />
                </TouchableOpacity>
            </View>
            <FlatList
                data={messages}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <Text style={item.sender === userId ? styles.myMessage : styles.adminMessage}>
                        {item.sender}: {item.message}
                    </Text>
                )}
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={message}
                    onChangeText={setMessage}
                    placeholder="Nhập tin nhắn..."
                />
                <Button title="Gửi" onPress={sendMessage} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 10, backgroundColor: "#fff" },
    myMessage: { alignSelf: "flex-end", padding: 10, backgroundColor: "#DCF8C6", margin: 5, borderRadius: 5 },
    adminMessage: { alignSelf: "flex-start", padding: 10, backgroundColor: "#EAEAEA", margin: 5, borderRadius: 5 },
    inputContainer: { flexDirection: "row", alignItems: "center", marginTop: 10 },
    input: { flex: 1, borderWidth: 1, padding: 10, marginRight: 5, borderRadius: 5 },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    backButton: {
        padding: 10,
        marginRight: 10,
    },
});

export default ChatScreen;
