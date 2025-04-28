import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  PanResponder,
  Dimensions,
  TextInput,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import tokenService from "../service/tokenService";
import { jwtDecode } from 'jwt-decode';
import Swiper from "react-native-swiper";
import TopTabNavigation from "../navigation/TopTabNavigation.tsx";
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useRef, useState } from 'react';
import LottieView from 'lottie-react-native';  // Thêm LottieView vào đây

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

function HomeScreen({ navigation }) {
  const [userName, setUserName] = useState('Đang tải...');
  const [chatVisible, setChatVisible] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([{ sender: 'bot', text: `Xin chào! Bạn cần hỗ trợ gì không?` }]);
  const [isLoading, setIsLoading] = useState(false);  // Trạng thái loading cho Lottie

  const chatPosition = useRef(new Animated.ValueXY({ x: 375, y: 750 })).current;
  const scrollViewRef = useRef<FlatList>(null);

  const banner: any[] = [
    require('../Image/banner.png'),
    require('../Image/banner2.png'),
  ];

  useFocusEffect(
    useCallback(() => {
      fetchUserInfo();
    }, [])
  );

  const fetchUserInfo = async () => {
    try {
      const token = await tokenService.getToken();
      if (!token) return;
      const decodedToken = jwtDecode(token);
      const userEmail = decodedToken?.email;
      if (!userEmail) return;
      const response = await axios.get('http://10.0.2.2:5000/v1/user/info', {
        headers: { Authorization: `Bearer ${token}` },
        params: { email: userEmail },
      });
      setUserName(response.data.name || 'Người dùng');
    } catch (error) {
      console.error('❌ Lỗi khi lấy thông tin user:', error);
      setUserName('Lỗi tải tên');
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Thêm tin nhắn người dùng vào giao diện trước
    setMessages((prev) => [...prev, { sender: 'user', text: inputMessage }]);

    // Hiển thị loading Lottie (3 chấm)
    setIsLoading(true);

    // Gửi tin nhắn đến backend (hoặc n8n webhook)
    try {
      const response = await axios.post(
        'https://datlui.app.n8n.cloud/webhook/e29c5f95-88d1-4170-b94b-7886da3a4c7b',
        { message: inputMessage }
      );
      const botReply = response.data.output;

      // Cập nhật lại tin nhắn và ẩn loading
      setIsLoading(false);
      setMessages((prev) => [...prev, { sender: 'bot', text: botReply }]);
    } catch (error) {
      setIsLoading(false);
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: 'Xin lỗi, hiện tại hệ thống đang bận.' },
      ]);
    }

    setInputMessage('');
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { moveX: chatPosition.x, moveY: chatPosition.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (e, gestureState) => {
        let finalX = gestureState.moveX - 30;
        let finalY = gestureState.moveY - 30;

        finalX = Math.max(0, Math.min(finalX, SCREEN_WIDTH - 60));
        finalY = Math.max(0, Math.min(finalY, SCREEN_HEIGHT - 150));

        Animated.spring(chatPosition, {
          toValue: { x: finalX, y: finalY },
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  const navigateCart = () => navigation.navigate('CartScreen');

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.Header}>
        <Text style={styles.welcomeText}>
          Chào,{'\n'}
          <Text style={styles.boldText}>{userName}</Text>
        </Text>
        <TouchableOpacity onPress={navigateCart}>
          <Image style={styles.ImageHeader} source={require('../Image/shopping-cart.png')} />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <TouchableOpacity onPress={() => navigation.navigate('SearchScreen')} style={styles.fakeSearchBox}>
        <Text style={styles.placeholderText}>Bạn đang tìm kiếm gì?</Text>
        <Image source={require('../Image/search.png')} style={styles.searchIcon} />
      </TouchableOpacity>

      {/* Banner */}
      <View style={styles.Banner}>
        <Swiper autoplay={true} autoplayTimeout={3} showsPagination={false}>
          {banner.map((image, index) => (
            <View key={index} style={styles.slideBanner}>
              <Image source={image} style={styles.imageBanner} />
            </View>
          ))}
        </Swiper>
      </View>

      <TopTabNavigation />

      {/* ChatBox */}
      {chatVisible && (
        <View style={styles.overlay}>
          <View style={styles.chatBox}>
            <View style={styles.chatHeader}>
              <View style={styles.logoAndTitle}>
                <Image source={require('../Image/logo.png')} style={styles.logoImage} />
                <Text style={styles.chatTitle}>CLOTHIQUE Assistant</Text>
              </View>
              <TouchableOpacity onPress={() => setChatVisible(false)}>
                <Image style={{ width: 15, height: 15 }} source={require('../Image/clear.png')} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={messages}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item }) => (
                <View
                  style={[
                    styles.messageBubble,
                    item.sender === 'user'
                      ? { alignSelf: 'flex-end', backgroundColor: '#DCF8C6' }
                      : { alignSelf: 'flex-start', backgroundColor: '#f0f0f0' },
                  ]}
                >
                  <Text style={styles.messageText}>{item.text}</Text>
                </View>
              )}
              contentContainerStyle={{ padding: 10 }}
              ref={scrollViewRef}
              onContentSizeChange={() => {
                if (scrollViewRef.current) {
                  scrollViewRef.current.scrollToEnd({ animated: true });
                }
              }}
            />

            {/* Lottie Loading */}
            {isLoading && (
              <View style={styles.loadingContainer}>
                <LottieView
                  source={require('../Image/Animation - 1745830271793.json')}  // Thêm hiệu ứng 3 chấm
                  autoPlay
                  loop
                  style={styles.lottie}
                />
              </View>
            )}

            {/* Input Message */}
            <View style={styles.chatInputContainer}>
              <TextInput
                placeholder="Nhập tin nhắn..."
                style={styles.chatInput}
                value={inputMessage}
                onChangeText={setInputMessage}
              />
              <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
                <Text style={styles.sendButtonText}>Gửi</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* ChatButton */}
      {!chatVisible && (
        <Animated.View {...panResponder.panHandlers} style={[styles.chatButton, chatPosition.getLayout()]}>
          <TouchableOpacity onPress={() => setChatVisible(true)}>
            <Image source={require('../Image/happy.png')} style={styles.chatIcon} />
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}
// StyleSheet
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 30,

    },
    Header: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    welcomeText: {
        fontSize: 18,
        color: "#000",
    },
    boldText: {
        fontWeight: 'bold',
    },
    ImageHeader: {
        width: 30,
        height: 30,
        resizeMode: "contain",
    },
    TextInputHeader: {
        width: '90%',
        height: 45,
        borderRadius: 30,
        backgroundColor: '#F6F6F6',
        paddingHorizontal: 15,
    },
    Banner: {
        width: '100%',
        height: 180,
        marginTop: 20,
        marginBottom: 20,
    },
    slideBanner: {
        borderRadius: 20,
        overflow: "hidden",
    },
    imageBanner: {
        width: "100%",
        height: "100%",
        borderRadius: 20,
        resizeMode: "cover",
    },
    Body: {
        marginTop: 10,
        width: "100%",
        height: 'auto'
    },
    resultsContainer: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        padding: 10,
    },
    emptyText: {
        textAlign: "center",
        marginTop: 20,
        fontSize: 16,
        color: "#888",
    },
    errorText: {
        textAlign: "center",
        marginTop: 20,
        fontSize: 16,
        color: "red",
    },
    bannerContainer: {
        marginVertical: 20,
        height: 180,
        borderRadius: 10,
        overflow: "hidden",
    },
    bannerImage: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
    filterButton: {
        marginLeft: 17
    },
    filterImage: {
        width: 24,
        height: 24,
        resizeMode: "contain",
    },
    fakeSearchBox: {
        width: '100%',
        height: 45,
        borderRadius: 8,
        backgroundColor: '#F6F6F6',
        paddingHorizontal: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    placeholderText: {
        color: '#999',
        fontSize: 16,
    },

    searchIcon: {
        width: 20,
        height: 20,
        tintColor: '#000', // nếu bạn dùng icon trắng
        padding: 10,
        borderRadius: 0,
    },

    chatIcon: {
      width: 40,
      height: 40,
      resizeMode: 'contain',
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.3)', // nền mờ
      justifyContent: 'flex-end',
      alignItems: 'flex-end',
    },
    chatBox: {
      width: 340,
      height: 400,
      backgroundColor: '#fff',
      borderRadius: 15,
      margin: 20,
      overflow: 'hidden',

    },
    chatHeader: {
      backgroundColor: '#4B7BEC',
      padding: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    chatTitle: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
    },
    closeButton: {
      color: '#fff',
      fontSize: 18,
    },
    chatMessages: {
      flex: 1,
      padding: 10,
    },
    messageBubble: {
      alignSelf: 'flex-start',
      backgroundColor: '#f0f0f0',
      borderRadius: 10,
      paddingVertical: 8,
      paddingHorizontal: 12,
      marginBottom: 8,
    },
    messageText: {
      fontSize: 14,
      color: '#333',

    },
    chatInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      borderTopWidth: 1,
      borderTopColor: '#eee',
    },
    chatInput: {
      flex: 1,
      backgroundColor: '#f6f6f6',
      borderRadius: 20,
      paddingHorizontal: 15,
      height: 40,
    },
    sendButton: {
      marginLeft: 10,
      backgroundColor: '#4B7BEC',
      borderRadius: 20,
      paddingHorizontal: 15,
      paddingVertical: 8,
    },
    sendButtonText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    logoAndTitle: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    logoImage: {
      width: 35,
      height: 35,
      marginRight: 8,
      borderRadius:80
    },
    hideButton: {
      position: 'absolute',
      bottom: -25,
      backgroundColor: '#4B7BEC',
      paddingVertical: 2,
      paddingHorizontal: 6,
      borderRadius: 10,
    },
    hideButtonText: {
      color: '#fff',
      fontSize: 10,
    },
    chatButton: {
      position: 'absolute',
      width: 60,
      height: 60,
      backgroundColor: '#fff',
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 5,
      zIndex: 99,
    },
    loadingContainer: {
      marginTop: 20,
      alignItems: 'flex-start',
    },
    lottie: {
      width: 80,
      height: 80,
    },






});

export default HomeScreen;
