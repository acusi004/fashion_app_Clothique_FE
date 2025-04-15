import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ToastAndroid, Platform, UIManager, LayoutAnimation,
} from 'react-native';
import axios from 'axios';
import {getToken} from '../../service/categoryService';
import CustomAlert from '../../styles/CustomAlert.tsx';
import CustomAlertSecond from '../../styles/CustomALertSecond.tsx';
import {useNavigation} from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import tokenService from '../../service/tokenService.js';

// @ts-ignore
const OrderCard = ({order, onCancelOrder}) => {
  // kich hoat layout Animation cho android
  if (
      Platform.OS === 'android' &&
      UIManager.setLayoutAnimationEnabledExperimental
  ) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }


  const navigation = useNavigation(); // ⬅️ Cần đặt ở đây
  const product = order.orderItems[order.orderItems.length - 1];
  const orderItems = order.orderItems || [];


  const variant = product.variantId;
  const productInfo = product.productId;

  const productImage = variant.images?.[0] || '';

  const [showMoreProducts, setShowMoreProducts] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertHeader, setAlertHeader] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [textYes, setTextYes] = useState('');
  const [textNo, setTextNo] = useState('');
  const [isConfirmedReceived, setIsConfirmedReceived] = useState(order.orderStatus === 'Received');
  const [showBreakdown, setShowBreakdown] = useState(false);
  const socket = io("http://10.0.2.2:5000", { autoConnect: false });

  const [alertActionType, setAlertActionType] = useState<
      'cancel' | 'confirmReceived' | null
  >(null);

  // @ts-ignore
  const showAlert = (header, message) => {
    setAlertHeader(header);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const showAlert2 = (
      header: string,
      message: string,
      textYesBtn: string,
      textNoBtn: string,
      type: 'cancel' | 'confirmReceived',
  ) => {
    setAlertHeader(header);
    setAlertMessage(message);
    setTextNo(textNoBtn);
    setTextYes(textYesBtn);
    setAlertVisible(true);
    setAlertActionType(type);
  };

  const toggleShowMore = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowMoreProducts(prev => !prev);
  };

  useEffect(() => {
    const initSocket = async () => {
        const userInfo = await tokenService.getUserIdFromToken();
            const userId = userInfo?._id;
    if (!socket.connected) {
      socket.connect();
    }
  
    // Khi kết nối socket thành công, gửi userId lên server
    socket.on("connect", () => {
      console.log("🔌 Socket connected:", socket.id);
      if (userId) {
        socket.emit("register", userId); // Gửi userId để server lưu socketId
      }
    });
  
    // Lắng nghe thông báo từ server
    socket.on("notification", (data) => {
      console.log("📩 Nhận được thông báo:", data);
      showAlert("Thông báo từ admin", data.message); // hoặc bạn muốn xử lý khác
    });
  };
  initSocket();
    return () => {
      socket.disconnect(); // Cleanup khi component unmount
    };
  
  }, []);

  const handleConfirmReceived = async () => {
    try {
      const token = await getToken();
      if (!token) {
        showAlert('Lỗi', 'Bạn cần đăng nhập để xác nhận đơn hàng!');
        return;
      }

      const response = await axios.put(
          `http://10.0.2.2:5000/v1/updateOrderStatus/${order._id}`,

          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
      );

      if (response.data.success) {

        setIsConfirmedReceived(true); // ✅ Ẩn nút sau xác nhận
        setAlertVisible(false);
      } else {
        showAlert(
            'Lỗi',
            response.data.message || 'Không thể cập nhật đơn hàng.',
        );
      }
    } catch (error) {
      ToastAndroid.show('Lỗi xác nhận đơn hàng!', ToastAndroid.SHORT);
      console.log(`error ${error.message}`)
    }
  };

  const renderStatusTimeFromHistory = () => {
    if (!order.history || order.history.length === 0) return null;

    // Ưu tiên dòng có chứa 'giao hàng', nếu không có lấy dòng cuối cùng
    const relevantEntry =
        order.history.find(h => h.toLowerCase().includes('giao hàng')) ||
        order.history[order.history.length - 1];

    const match = relevantEntry.match(
        /(\d{1,2}:\d{1,2}:\d{1,2}) (\d{1,2}\/\d{1,2}\/\d{4})/,
    );

    if (match) {
      return `${match[1]} ${match[2]}`; // Trả ra: 14:39:36 3/4/2025
    }

    return null;
  };

  const handleCancelOrder = async () => {
     const userInfo = await tokenService.getUserIdFromToken();
    try {
      // Lấy token từ service
      const token = await getToken();

      if (!token) {
        showAlert('Lỗi', 'Bạn cần đăng nhập để thực hiện hành động này!');
        return;
      }

      const response = await axios.post(
          'http://10.0.2.2:5000/v1/order/cancelOrder',
          {orderId: order._id},
          {
            headers: {
              Authorization: `Bearer ${token}`, // Gửi token trong header
            },
          },
      );

      if (response.status === 200) {
        onCancelOrder(order._id);
        ToastAndroid.show('Hủy đơn hàng thành công !', ToastAndroid.SHORT);
        socket.emit("sendPrivateMessage", {
          sender: userInfo?.userId,
          receiver: "admin",
          message: `📱 User ${userInfo?.userId} đã hủy đơn hàng .`,
        });
        console.log(`✅ Đã HỦy đơn hàng thành công : User ${userInfo?.userId}`);
        setAlertVisible(false);
      }
    } catch (error) {
      ToastAndroid.show('Đã xảy ra lỗi khi hủy đơn hàng.', ToastAndroid.SHORT);
    }
  };

  return (
      <TouchableOpacity
          onPress={() => navigation.navigate('DetailOrderScreen', {order})}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.favorite}>Yêu thích+</Text>
            <Text style={styles.shopName}>Clothique</Text>
            <Text style={[
              styles.status,
              order.orderStatus === 'Received' && { color: '#1abc9c' },
              order.orderStatus === 'Cancelled' && { color: 'red' }
            ]}>
              {(() => {
                let newStatus = '';
                let history = '';


                if (
                    order.paymentMethod === 'COD' &&  order.paymentMethod === 'MoMo'&&
                    order.paymentStatus === 'Pending'
                ) {
                  newStatus = 'Chưa thanh toán'; // Hiển thị "Chưa thanh toán" nếu paymentMethod là COD và paymentStatus là Pending
                  history = 'Chờ thanh toán khi nhận hàng';
                } else {
                  // Các trạng thái đơn hàng khác
                  switch (order.orderStatus) {
                    case 'Pending':
                      newStatus = 'Đang xử lý';
                      history = 'Đang chuẩn bị hàng';
                      break;
                    case 'Processing':
                      newStatus = 'Đơn hàng đang được chuẩn bị';
                      history = 'Đang giao hàng';
                      break;
                    case 'Shipped':
                      newStatus = 'Đang giao hàng';
                      history = 'Đang giao hàng';
                      break;
                    case 'Delivered':
                      newStatus = 'Đã giao';
                      history = 'Đã giao hàng';
                      break;
                    case 'Received':
                      newStatus = 'Đã nhận hàng';
                      history = 'Khách hàng đã xác nhận';
                      break;
                    case 'Cancelled':
                      newStatus = 'Đã hủy';
                      history = 'Đơn hàng đã bị hủy';
                      break;

                    default:
                      newStatus = 'Trạng thái không xác định';
                      history = 'Lỗi trạng thái';
                  }

                }

                return newStatus;
              })()}
            </Text>
          </View>

          {/* Product */}
          <View style={styles.productContainer}>
            <Image
                source={{uri: `http://10.0.2.2:5000${productImage}`}}
                style={styles.productImage}
            />
            <View style={styles.productInfo}>
              <Text numberOfLines={1} style={styles.productName}>
                {productInfo?.name}
              </Text>
              <Text style={styles.variantText}>
                {variant.size} - {variant.color}
              </Text>
              <Text style={styles.price}>₫{variant.price.toLocaleString()}</Text>
              <Text style={styles.quantity}>x{product.quantity}</Text>
            </View>
          </View>
          {orderItems.length > 1 && (
              <>
                <TouchableOpacity onPress={ toggleShowMore}>
                  <View style={{ alignItems: 'center' }}>
                    <Text style={{ color: '#000', marginVertical: 6 }}>
                      {showMoreProducts ? 'Ẩn bớt ▲' : 'Xem thêm ▼'}
                    </Text>
                  </View>
                </TouchableOpacity>

                {showMoreProducts &&
                    orderItems.slice(1).map((item, index) => (
                        <View key={index} style={styles.extraProductContainer}>
                          <Image
                              source={{ uri: `http://10.0.2.2:5000${item.variantId.images?.[0]}` }}
                              style={styles.extraProductImage}
                          />
                          <View style={{ marginLeft: 10, flex: 1 }}>
                            <Text numberOfLines={1} style={styles.extraProductName}>
                              {item.productId.name}
                            </Text>
                            <Text style={styles.extraProductPrice}>
                              ₫{item.variantId.price.toLocaleString()}
                            </Text>
                          </View>
                        </View>
                    ))}

              </>
          )}


          {/* Shipping Address */}
          <View style={styles.shippingAddress}>
            <Text style={styles.addressLabel}>Địa chỉ giao hàng:</Text>
            <Text>{order.shippingAddress.name}</Text>
            <Text>{order.shippingAddress.phoneNumber}</Text>
            <Text>
              {order.shippingAddress.addressDetail},{' '}
              {order.shippingAddress.districtId} -{' '}
              {order.shippingAddress.wardCode}
            </Text>
          </View>

          {/* Total */}
          <TouchableOpacity onPress={() => setShowBreakdown(prev => !prev)}>
            <Text style={styles.total}>
              Tổng số tiền ({orderItems.reduce((sum, item) => sum + item.quantity, 0)} sản phẩm): ₫
              {order.totalAmount.toLocaleString()} {showBreakdown ? '▲' : '▼'}
            </Text>
          </TouchableOpacity>

          {showBreakdown && (
              <View style={styles.breakdownBox}>
                {orderItems.map((item, index) => (
                    <View key={index} style={styles.breakdownRow}>
                      <Text style={{flex: 1}} numberOfLines={1}>{item.productId.name}</Text>
                      <Text>
                        ₫{item.variantId.price.toLocaleString()} x {item.quantity}
                      </Text>
                    </View>
                ))}
                <View style={styles.breakdownRow}>
                  <Text style={{flex: 1, fontWeight: 'bold'}}>Phí vận chuyển</Text>
                  <Text>₫{order.shippingFee.toLocaleString()}</Text>
                </View>
                <View style={[styles.breakdownRow, {borderTopWidth: 1, borderColor: '#ccc', paddingTop: 4}]}>
                  <Text style={{flex: 1, fontWeight: 'bold'}}>Tổng cộng</Text>
                  <Text style={{fontWeight: 'bold'}}>₫{order.totalAmount.toLocaleString()}</Text>
                </View>
              </View>
          )}



          {/* Trạng thái giao hàng + Button */}
          {order.orderStatus === 'Delivered' && (
              <View style={styles.footer}>
                <Text style={styles.deliveryNote}>
                  {`Đơn hàng giao thành công vào lúc ${renderStatusTimeFromHistory()}`}{' '}
                </Text>
                <View style={styles.buttons}>
                  <TouchableOpacity
                      style={styles.btnOutline}
                      onPress={() =>
                          navigation.navigate('OrderRating', {
                            orderId: order._id,
                            orderItems: order.orderItems,
                            userId: order.userId, // ✅ Truyền luôn userId sang
                          })
                      }
                  >
                    <Text>Đánh Giá</Text>
                  </TouchableOpacity>




                  {!isConfirmedReceived && (
                      <TouchableOpacity
                          style={styles.btnPrimary}
                          onPress={() =>
                              showAlert2(
                                  'Xác nhận đã nhận hàng',
                                  'Bạn chắc chắn đã nhận được đơn hàng này?',
                                  'Xác nhận',
                                  'Quay lại',
                                  'confirmReceived',
                              )
                          }>
                        <Text style={{color: '#B35A00'}}>Đã nhận được hàng</Text>
                      </TouchableOpacity>
                  )}

                </View>
              </View>
          )}
          {order.orderStatus === 'Pending' && (
              <View style={styles.footer}>
                <View style={styles.buttons}>
                  <TouchableOpacity
                      style={styles.btnPrimary}
                      onPress={() =>
                          showAlert2(
                              'Thông báo',
                              'Bạn có chắc chắn muốn hủy đơn hàng này không?',
                              'Đồng ý',
                              'Quay lại',
                              'cancel',
                          )
                      }>
                    <Text style={{color: '#B35A00'}}>Hủy đơn hàng</Text>
                  </TouchableOpacity>
                </View>

              </View>
          )}
        </View>


        <CustomAlertSecond
            onNo={() => setAlertVisible(false)}
            onYes={() => {
              if (alertActionType === 'cancel') {
                handleCancelOrder();
              } else if (alertActionType === 'confirmReceived') {
                handleConfirmReceived();
              }
            }}
            buttonTextNo={textNo}
            buttonTextYes={textYes}
            visible={alertVisible}
            header={alertHeader}
            message={alertMessage}
        />
      </TouchableOpacity>
  );
};

export default OrderCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  favorite: {
    backgroundColor: '#FF3E3E',
    color: 'white',
    paddingHorizontal: 6,
    fontSize: 12,
    borderRadius: 3,
  },
  shopName: {
    fontWeight: 'bold',
    marginLeft: 6,
    flex: 1,
  },
  status: {
    color: '#B35A00',
    fontWeight: '600',
  },
  productContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 6,
  },
  productInfo: {
    marginLeft: 10,
    flex: 1,
  },
  productName: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  variantText: {
    color: '#555',
    fontSize: 12,
  },
  price: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  quantity: {
    fontSize: 12,
    color: '#777',
  },
  total: {
    textAlign: 'right',
    fontWeight: 'bold',
    marginTop: 10,
  },
  shippingAddress: {
    marginTop: 10,
  },
  addressLabel: {
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 12,
  },
  deliveryNote: {
    backgroundColor: '#e0f9f2',
    padding: 8,
    borderRadius: 4,
    color: '#1abc9c',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  btnOutline: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    marginRight: 8,
    borderRadius: 4,
  },
  btnPrimary: {
    backgroundColor: '#fff3e6',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#B35A00',
  },
  extraProductContainer: {
    flexDirection: 'row',
    marginTop: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
  },
  extraProductImage: {
    width: 60,
    height: 60,
    borderRadius: 4,
  },
  extraProductName: {
    fontSize: 13,
    fontWeight: '500',
  },
  extraProductPrice: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  breakdownBox: {
    backgroundColor: '#f2f2f2',
    padding: 10,
    marginTop: 6,
    borderRadius: 6,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },



});
