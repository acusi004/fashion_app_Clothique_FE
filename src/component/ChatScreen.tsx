import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity, Image, Alert } from "react-native";
import io from "socket.io-client";
import { useNavigation } from "@react-navigation/native";
import tokenService from "../service/tokenService";

const socket = io("http://10.0.2.2:5000", { autoConnect: false });

const ChatScreen = () => {
    const navigation = useNavigation();
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [userId, setUserId] = useState(null);
    const [username, setUsername] = useState("");
    const [typingUser, setTypingUser] = useState(null);
    const adminId = "admin";

    useEffect(() => {
        const initializeAdmin = async () => {
            const accessToken = await tokenService.getToken();
            socket.auth = { token: accessToken };
            socket.connect();

            // Đăng ký admin với server
            socket.emit("register", { userId: "admin", username: "Admin" });
        };

        initializeAdmin();
    }, []);

    useEffect(() => {
        socket.on("receivePrivateMessage", (data) => {
            console.log("📥 Tin nhắn từ admin:", data);
            setMessages((prevMessages) => [...prevMessages, data]);
        });

        return () => socket.off("receivePrivateMessage");
    }, []);

    useEffect(() => {
        if (userId) {
            socket.emit("getMessages", userId);
        }

        socket.on("chatHistory", ({ messages }) => {
            console.log("📜 Lịch sử tin nhắn:", messages);
            setMessages(messages);
        });

        return () => socket.off("chatHistory");
    }, [userId]);

    useEffect(() => {
        const initializeChat = async () => {
            const accessToken = await tokenService.getToken();
            if (!accessToken) {
                Alert.alert("Bạn cần đăng nhập để sử dụng chat.");
                navigation.navigate("LoginScreen");
                return;
            }

            const userInfo = await tokenService.getUserIdFromToken();
            if (!userInfo || !userInfo.userId || !userInfo.username) {
                Alert.alert("Không thể lấy thông tin người dùng. Hãy đăng nhập lại.");
                return;
            }

            setUserId(userInfo.userId);
            setUsername(userInfo.username);

            if (!socket.connected) {
                socket.auth = { token: accessToken };
                socket.connect();
            }

            console.log(`📡 Gửi register: userId=${userInfo.userId}, username=${userInfo.username}`);

            // 🛠 Đăng ký user với server
            socket.emit("register", { userId: userInfo.userId, username: userInfo.username });
        };

        initializeChat();
    }, []);

    useEffect(() => {
        socket.on("userTyping", ({ username }) => {
            setTypingUser(username);
            setTimeout(() => setTypingUser(null), 2000);
        });
        return () => socket.off("userTyping");
    }, []);

    useEffect(() => {
        socket.on("visibilityChanged", ({ hidden }) => {
            Alert.alert(hidden ? "Bạn đã bị ẩn" : "Bạn đã được hiển thị lại");
        });
        return () => socket.off("visibilityChanged");
    }, []);

    const handleTyping = () => {
        socket.emit("typing", { username });
    };

    const sendMessage = () => {
        if (message.trim() === "") {
            Alert.alert("Lỗi", "Tin nhắn không được để trống.");
            return;
        }

        if (!userId || !username) {
            Alert.alert("Lỗi", "Không thể gửi tin nhắn vì chưa lấy được thông tin người dùng.");
            return;
        }

        const newMessage = {
            sender: userId,
            receiver: "admin",
            message: message.trim(),
            senderName: username,
            timestamp: new Date().toISOString(),
        };

        console.log("📤 Gửi tin nhắn:", newMessage);

        socket.emit("sendPrivateMessage", { ...newMessage }, (response) => {
            console.log("📥 Server phản hồi:", response);
            if (response.status === "ok") {
                setMessages(prevMessages => [...prevMessages, newMessage]);
                setMessage(""); // Reset ô nhập
            } else {
                Alert.alert("Lỗi", response.message);
            }
        });
    };

    return (
        <View style={styles.container}>


            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Image source={require("../Image/back.png")} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Chat với Admin</Text>
            </View>
            <FlatList
                data={messages}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={[styles.messageContainer, item.sender === userId ? styles.myMessageContainer : styles.adminMessageContainer]}>
                        <Image source={require("../Image/user-out.png")} style={styles.avatar} />
                        <View style={styles.messageContent}>
                            <Text style={styles.sender}>{item.senderName}</Text>
                            <Text style={styles.messageText}>{item.message}</Text>
                        </View>
                    </View>
                )}
            />
            <Text style={styles.typingText}>{typingUser ? `${typingUser} đang nhập...` : ""}</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={message}
                    onChangeText={(text) => { setMessage(text); handleTyping(); }}
                    placeholder="Nhập tin nhắn..."
                />
                <Button title="Gửi" onPress={sendMessage} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 10, backgroundColor: "#fff" },
    messageContainer: { padding: 10, marginVertical: 5, borderRadius: 8, maxWidth: "80%" },
    myMessageContainer: { alignSelf: "flex-end", backgroundColor: "#DCF8C6" },
    adminMessageContainer: { alignSelf: "flex-start", backgroundColor: "#EAEAEA" },
    sender: { fontWeight: "bold", marginBottom: 3 },
    messageText: { fontSize: 16 },
    inputContainer: { flexDirection: "row", alignItems: "center", marginTop: 10 },
    input: { flex: 1, borderWidth: 1, padding: 10, marginRight: 5, borderRadius: 5 },
    header: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
    backButton: { padding: 10, marginRight: 10 },
    headerTitle: { fontSize: 18, fontWeight: "bold" },
    avatar: { width: 30, height: 30, borderRadius: 15, marginRight: 10 },
    messageContent: { maxWidth: "85%" },
    typingText: { fontStyle: "italic", color: "gray", marginLeft: 10 },
});

export default ChatScreen;
