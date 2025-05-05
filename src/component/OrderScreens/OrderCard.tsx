import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ToastAndroid,
  Platform,
  UIManager,
  LayoutAnimation,
} from 'react-native';
import axios from 'axios';
import { getToken } from '../../service/categoryService';
import CustomAlert from '../../styles/CustomAlert.tsx';
import CustomAlertSecond from '../../styles/CustomALertSecond.tsx';
import { useNavigation } from '@react-navigation/native';
import tokenService from '../../service/tokenService.js';

// @ts-ignore
const OrderCard = ({ order, onCancelOrder }) => {
  if (
    Platform.OS === 'android' &&
    UIManager.setLayoutAnimationEnabledExperimental
  ) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  const navigation = useNavigation();
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
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [isConfirmedReceived, setIsConfirmedReceived] = useState(
    order.orderStatus === 'Received' || order.orderStatus === 'Completed'
  );
  useEffect(() => {
    setIsConfirmedReceived(
      order.orderStatus === 'Received' || order.orderStatus === 'Completed'
    );
  }, [order.orderStatus]);

  const BASE_URL = 'http://10.0.2.2:5000';


  const [alertActionType, setAlertActionType] = useState<
    'cancel' | 'confirmReceived' | null
  >(null);

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

  const handleConfirmReceived = async () => {
    // Nếu đã xác nhận rồi thì không cho xác nhận lại
    if (order.orderStatus === 'Completed' || order.orderStatus === 'Received') {
      showAlert('Thông báo', 'Đơn hàng đã được xác nhận hoàn tất trước đó.');
      return;
    }

    try {
      const token = await getToken();
      if (!token) {
        showAlert('Lỗi', 'Bạn cần đăng nhập để xác nhận đơn hàng!');
        return;
      }

      const response = await axios.post(
        `${BASE_URL}/v1/order/confirmOrder/${order._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const message = response.data?.message || '';
      const success = response.data?.success;

      // TH1: BE đã xác nhận từ trước (gửi lại request)
      if (message.includes('trước đó')) {
        showAlert('Thông báo', message);
        setIsConfirmedReceived(true); // ẩn nút nếu còn hiển thị
        return;
      }

      // TH2: Xác nhận thành công lần đầu
      if (success || response.status === 200) {
        setIsConfirmedReceived(true);
        setAlertVisible(false); // ✅ đóng alert confirm
        ToastAndroid.show('Xác nhận đã nhận hàng thành công!', ToastAndroid.SHORT);
        return;
      }

      // TH3: Thông báo lỗi chung
      showAlert('Lỗi', message || 'Không thể xác nhận đơn hàng.');
    } catch (error) {
      const msg = error.response?.data?.message || 'Lỗi xác nhận đơn hàng!';
      showAlert('Lỗi', msg);
      ToastAndroid.show(msg, ToastAndroid.SHORT);
      console.log('❌ Lỗi xác nhận:', error.response?.data || error.message);
    }
  };





  const renderStatusTimeFromHistory = () => {
    if (!order.history || order.history.length === 0) return null;

    const relevantEntry =
      order.history.find(h =>
        h.description?.toLowerCase().includes('giao hàng') ||
        h.status?.toLowerCase() === 'completed'
      ) || order.history[order.history.length - 1];

    if (relevantEntry?.changedAt) {
      const time = new Date(relevantEntry.changedAt);
      return `${time.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} ${time.toLocaleDateString('vi-VN')}`;
    }

    return null;
  };


  const sendNotification = async (
    userId: string,
    username: string,
    message: string,
    data = {},
    title = 'Thông báo',
    retries = 3
  ): Promise<{ success: boolean; error?: string }> => {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        if (!userId || !message || !username) {
          console.error('[sendNotification] Thiếu userId, username hoặc message');
          return { success: false, error: 'Thiếu userId, username hoặc message' };
        }

        const token = await tokenService.getToken();
        if (!token) {
          throw new Error('Chưa đăng nhập');
        }

        console.log(`[sendNotification] Token: ${token}`); // Thêm log để kiểm tra token
        console.log(`[sendNotification] Thử gửi lần ${attempt} đến ${username} (${userId})`);
        console.log(`[sendNotification] Body:`, { userId, username, message, title, data }); // Thêm log để kiểm tra body

        const response = await fetch(`${BASE_URL}/v1/notifications/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId,
            username,
            message,
            title,
            data,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          console.error(`[sendNotification] Phản hồi từ server:`, result); // Thêm log để kiểm tra phản hồi
          throw new Error(result.error || 'Lỗi tạo notification'); // Sử dụng result.error từ server
        }

        console.log(`[sendNotification] Gửi thành công đến ${username} (${userId})`);
        return { success: true, data: result };
      } catch (error) {
        console.error(
          `[sendNotification] Lỗi gửi đến ${userId} (lần ${attempt}): ${error.message}`
        );
        if (attempt === retries) {
          return { success: false, error: error.message };
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    return { success: false, error: 'Hết số lần thử' };
  };


  const handleCancelOrder = async () => {
    if (order.orderStatus !== 'Pending') {
      showAlert('Lỗi', 'Chỉ có thể hủy đơn hàng khi còn ở trạng thái Chờ xác nhận!');
      return;
    }

    const userInfo = await tokenService.getUserIdFromToken();
    try {
      const token = await getToken();
      if (!token) {
        showAlert('Lỗi', 'Bạn cần đăng nhập để thực hiện hành động này!');
        return;
      }

      const response = await axios.post(
        'http://10.0.2.2:5000/v1/order/cancelOrder',
        { orderId: order._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 200) {
        setAlertVisible(false);
        onCancelOrder(order._id);
        const notificationResult = await sendNotification(
          userInfo?.userId,
          userInfo?.username || 'Người dùng',
          'Bạn đã hủy đơn hàng thành công.',
          { type: 'order', orderId: order._id },
          'Thông báo đơn hàng'
        );

        if (!notificationResult.success) {
          console.error('[Huydonhang] Gửi thông báo thất bại:', notificationResult.error);
          showAlert(
            'Thông báo',
            'Hủy đơn hàng thành công, nhưng gửi thông báo đẩy thất bại! Vui lòng kiểm tra thông báo sau.'
          );
        }
      }
    } catch (error) {
      console.error('❌ Lỗi hủy đơn hàng:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || 'Đã xảy ra lỗi khi hủy đơn hàng.';
      showAlert('Lỗi', errorMessage);
    }
  };



  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('DetailOrderScreen', { order })}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.favorite}>HVNCLC+</Text>
          <Text style={styles.shopName}>Clothique</Text>
          <Text style={[
            styles.status,
            order.orderStatus === 'Received' && { color: '#1abc9c' },
            order.orderStatus === 'Cancelled' && { color: 'red' }
          ]}>
            {(() => {
              let newStatus = '';
              if (
                order.paymentMethod === 'COD' && order.paymentMethod === 'MoMo' &&
                order.paymentStatus === 'Pending'
              ) {
                newStatus = 'Chưa thanh toán';
              } else {
                switch (order.orderStatus) {
                  case 'Pending':
                    newStatus = 'Đang xử lý';
                    break;
                  case 'Processing':
                    newStatus = 'Đơn hàng đang được chuẩn bị';
                    break;
                  case 'Shipped':
                    newStatus = 'Đang giao hàng';
                    break;
                  case 'Delivered':
                    newStatus = 'Đã giao';
                    break;
                  case 'Received':
                    newStatus = 'Đã nhận hàng';
                    break;
                  case 'Completed':
                    newStatus = 'Đã hoàn tất';
                    break;
                  case 'Completed': // ✅ Thêm trường hợp này
                    newStatus = 'Đã hoàn tất';
                    history = 'Khách đã xác nhận đã nhận hàng';
                    break;
                  case 'Cancelled':
                    newStatus = 'Đã hủy';
                    break;
                  default:
                    newStatus = 'Trạng thái không xác định';
                }
              }
              return newStatus;
            })()}
          </Text>
        </View>

        <View style={styles.productContainer}>
          <Image
            source={{ uri: `http://10.0.2.2:5000${productImage}` }}
            style={styles.productImage}
          />
          <View style={styles.productInfo}>
            <Text numberOfLines={1} style={styles.productName}>
              {productInfo.name}
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
            <TouchableOpacity onPress={toggleShowMore}>
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
                <Text style={{ flex: 1 }} numberOfLines={1}>{item.productId.name}</Text>
                <Text>
                  ₫{item.variantId.price.toLocaleString()} x {item.quantity}
                </Text>
              </View>
            ))}
            <View style={styles.breakdownRow}>
              <Text style={{ flex: 1, fontWeight: 'bold' }}>Phí vận chuyển</Text>
              <Text>₫{order.shippingFee.toLocaleString()}</Text>
            </View>
            <View style={[styles.breakdownRow, { borderTopWidth: 1, borderColor: '#ccc', paddingTop: 4 }]}>
              <Text style={{ flex: 1, fontWeight: 'bold' }}>Tổng cộng</Text>
              <Text style={{ fontWeight: 'bold' }}>₫{order.totalAmount.toLocaleString()}</Text>
            </View>
          </View>
        )}


        {(order.orderStatus === 'Delivered' || order.orderStatus === 'Completed') && (
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
                    userId: order.userId,
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
                  <Text style={{ color: '#B35A00' }}>Đã nhận được hàng</Text>
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
                <Text style={{ color: '#B35A00' }}>Hủy đơn hàng</Text>
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

export default OrderCard;
