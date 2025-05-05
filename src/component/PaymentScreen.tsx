import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { RadioButton } from 'react-native-paper';
import tokenService from '../service/tokenService';
import CustomAlert from '../styles/CustomAlert.tsx';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import { Platform, Linking } from 'react-native';
import CustomAlertSecond from '../styles/CustomALertSecond.tsx';
import FailedScreen from './FailedScreen.tsx';

const CheckoutScreen = () => {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Thêm trạng thái loading
  const navigation = useNavigation();
  const route = useRoute();
  const { selectedProducts = [], address = null, paymentMethod1 } = route.params || {};
  const BASE_URL = 'http://10.0.2.2:5000';
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertHeader, setAlertHeader] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [momoUrl, setMomoUrl] = useState('');
  const [confirmOpenBrowser, setConfirmOpenBrowser] = useState(false);

  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false); // Thêm trạng thái để kiểm tra thanh toán thành công
  const { selectedCoupon } = route.params || {};



  const openWithChrome = async (url: string) => {
    if (Platform.OS === 'android') {
      const chromeUrl = `googlechrome://navigate?url=${url}`;
      const supported = await Linking.canOpenURL(chromeUrl);
      if (supported) {
        await Linking.openURL(chromeUrl);
      } else {
        await Linking.openURL(url);
      }
    } else {
      await Linking.openURL(url);
    }
  };

  useEffect(() => {
    if (paymentMethod1) {
      setPaymentMethod(paymentMethod1);
    }
    console.log('Selected Products: ', selectedProducts);
    console.log('Địa chỉ: ', address ? address._id : 'Không có địa chỉ');
    console.log('Phương thức thanh toán nhận vào:', paymentMethod1);
  }, [paymentMethod1, selectedProducts, address]);

  const showAlert = (header: string, message: string) => {
    setAlertHeader(header);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const getFullImageUrl = (imagePath: string) => {
    return imagePath.startsWith('/uploads/')
      ? `${BASE_URL}${imagePath}`
      : imagePath;
  };

  const totalPrice = selectedProducts.reduce((total: number, item: any) => {
    return total + item.variantId.price * item.quantity;
  }, 0);

  const sendNotification = async (
    userId: string,
    username: string,
    message: string,
    data = {},
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

        console.log(`[sendNotification] Thử gửi lần ${attempt} đến ${username} (${userId})`);

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
            data,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Lỗi tạo notification');
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

  const discountAmount = selectedCoupon
      ? selectedCoupon.discountType === 'fixed'
          ? selectedCoupon.discountValue
          : Math.floor((selectedCoupon.discountValue / 100) * totalPrice)
      : 0;
  const finalTotal = totalPrice + 25000 - discountAmount;


  const ThanhToan = async () => {
    const userInfo = await tokenService.getUserIdFromToken();

    if (!paymentMethod) {
      return showAlert('Thông báo', 'Vui lòng chọn phương thức thanh toán');
    }

    if (!address) {
      return showAlert('Thông báo', 'Hãy chọn địa chỉ giao hàng');
    }

    try {
      setIsLoading(true); // Bật trạng thái loading

      const token = await tokenService.getToken();
      if (!token) {
        setIsLoading(false);
        return showAlert('Thông báo', 'Vui lòng đăng nhập trước!');
      }

      console.log('[ThanhToan] Gửi yêu cầu tạo đơn hàng...');
      const response = await fetch(`${BASE_URL}/v1/order/createOrder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          shippingAddressId: address._id,
          cartItems: selectedProducts.map((item: any) => item._id),
          paymentMethod,
          couponCode: selectedCoupon?.code,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Đặt hàng thất bại!');
      }

      console.log('[ThanhToan] Đơn hàng được tạo thành công:', data);

      if (paymentMethod === 'MoMo') {
        if (data?.momoResult?.payUrl) {
          setMomoUrl(data.momoResult.payUrl);
          setAlertHeader('Xác nhận thanh toán');
          setAlertMessage('Bạn có muốn mở trình duyệt để thanh toán qua MoMo không?');
          setConfirmOpenBrowser(true);
        } else {
          showAlert('Thông báo', 'MoMo không trả về liên kết thanh toán.');
        }
      }

      if (paymentMethod === 'COD') {
        setIsPaymentSuccess(true);
        const notificationResult = await sendNotification(
          userInfo?.userId,
          userInfo?.username || 'Người dùng',
          'Bạn đã đặt hàng thành công với phương thức COD.',
          { type: 'order', orderId: data.order?._id }
        );

        if (!notificationResult.success) {
          console.error('[ThanhToan] Gửi thông báo thất bại:', notificationResult.error);
          setAlertHeader('Thông báo');
          setAlertMessage('Đặt hàng thành công, nhưng gửi thông báo đẩy thất bại! Vui lòng kiểm tra thông báo sau.');
          setAlertVisible(true);

// trong component CustomAlert, truyền thêm prop onCloseNavigation nếu cần

        } else {
          console.log('[ThanhToan] Gửi thông báo thành công');

        }

        setTimeout(() => {
          navigation.reset({ index: 0, routes: [{ name: 'HTScreen' }] });
        }, 1000);
      }
    } catch (error) {
      console.error('[ThanhToan] Lỗi:', error.message);
      showAlert('Lỗi', error.message || 'Đã xảy ra lỗi, vui lòng thử lại!');
    } finally {
      setIsLoading(false); // Tắt trạng thái loading dù thành công hay thất bại
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {isLoading && ( // Hiển thị giao diện loading khi isLoading là true
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#000" />
          <Text style={styles.loadingText}>Đang xử lý...</Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <Image source={require('../Image/back.png')} />
      </TouchableOpacity>

      <Text style={styles.header}>Thanh toán</Text>

      <ScrollView>
        {/* Địa chỉ giao hàng */}
        <View style={styles.section}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('ChoiceAddress', {
                selectedProducts,
                paymentMethod,
              })
            }>
            <Text style={styles.sectionTitle}>Địa chỉ giao hàng</Text>
            {address ? (
              <View style={styles.addressBox}>
                <Text style={styles.addressName}>{address.name}</Text>
                <Text style={styles.addressDetail}>
                  {`${address.addressDetail}, ${address.wardName}, ${address.districtName}, ${address.provinceName}`}
                </Text>
                <Text style={styles.addressPhone}>
                  SĐT: {address.phoneNumber}
                </Text>
              </View>
            ) : (
              <View style={styles.addressBox}>
                <Text style={styles.addressName}>
                  Bạn chưa chọn địa chỉ giao hàng
                </Text>
                <Text style={styles.addressDetail}>
                  Hãy chọn địa chỉ giao hàng
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Danh sách sản phẩm */}
        {selectedProducts.length > 0 ? (
          <FlatList
            data={selectedProducts}
            nestedScrollEnabled
            scrollEnabled={false}
            keyExtractor={(item: any) => item._id?.toString?.()}
            renderItem={({ item }: { item: any }) => (
              <View style={styles.productItem}>
                <Image
                  source={{
                    uri: item.variantId.images?.[0]
                      ? getFullImageUrl(item.variantId.images[0])
                      : 'https://via.placeholder.com/300',
                  }}
                  style={styles.productImage}
                />
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{item.productId.name}</Text>
                  <Text style={styles.productSize}>
                    Size: {item.variantId.size}
                  </Text>
                  <Text style={styles.productPrice}>
                    Giá: {(item.variantId.price * item.quantity).toLocaleString()} đ
                  </Text>
                  <Text style={styles.productQuantity}>
                    Số lượng: {item.quantity}
                  </Text>
                </View>
              </View>
            )}
          />
        ) : (
          <Text style={styles.emptyText}>Không có sản phẩm nào được chọn.</Text>
        )}

        {/* Phương thức thanh toán */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
          {['MoMo', 'COD'].map(method => (
            <View style={styles.paymentOption} key={method}>
              <RadioButton.Android
                value={method}
                status={paymentMethod === method ? 'checked' : 'unchecked'}
                onPress={() => setPaymentMethod(method)}
              />
              <Text style={styles.paymentText}>
                {method === 'MoMo' ? 'MoMo' : 'Thanh toán khi nhận hàng'}
              </Text>
            </View>
          ))}
        </View>




        {/* Phương thức giao hàng */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Phương thức giao hàng</Text>
          <View style={styles.shippingBox}>
            <Image
              source={require('../Image/giaohangtietkiem.png')}
              style={styles.shippingIcon}
            />
            <Text style={styles.shippingText}>
              Giao hàng tiết kiệm (2-3 ngày)
            </Text>
          </View>
        </View>

        {/* Mã giảm giá */}
        <View style={styles.section}>
          <TouchableOpacity
              style={styles.discountBox}
              onPress={() =>
                  navigation.navigate('CouponScreen', {
                    selectedProducts,
                    address,
                    paymentMethod,
                    orderTotal: totalPrice + 25000, // truyền tổng đơn hàng bao gồm cả phí ship
                    onSelectCoupon: (coupon: any) => {
                      navigation.setParams({ selectedCoupon: coupon });
                    },
                  })
              }>
            <Text style={styles.sectionTitle}>Mã giảm giá</Text>
            <Text style={styles.discountHint}>Chọn hoặc nhập mã ưu đãi của bạn</Text>
          </TouchableOpacity>

        </View>
        {selectedCoupon && (
            <View style={styles.selectedCoupon}>
              <Image
                  source={require('../Image/couponIcon.png')}
                  style={styles.couponIcon}
              />
              <Text style={styles.couponText}>
                {selectedCoupon.discountType === 'fixed'
                    ? `Giảm ₫${(selectedCoupon.discountValue / 1000).toLocaleString()}k`
                    : `Giảm ${selectedCoupon.discountValue}%`}
              </Text>
            </View>
        )}

        {/* Tổng tiền */}
        <View style={styles.priceSection}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Giá:</Text>
            <Text style={styles.priceValue}>
              {totalPrice.toLocaleString()} đ
            </Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Phí Vận Chuyển:</Text>
            <Text style={styles.priceValue}>25,000 đ</Text>
          </View>

          {selectedCoupon && (
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Mã giảm giá:</Text>
                <Text style={[styles.priceValue, { color: 'green' }]}>
                  -{discountAmount.toLocaleString()} đ
                </Text>
              </View>
          )}

          <View style={styles.priceRowTotal}>
            <Text style={styles.totalLabel}>Tổng:</Text>
            <Text style={styles.totalValue}>
              {finalTotal.toLocaleString()} đ
            </Text>
          </View>

        </View>
      </ScrollView>

      <TouchableOpacity
        style={[styles.orderButton, isLoading && styles.orderButtonDisabled]} // Vô hiệu hóa nút khi đang loading
        onPress={ThanhToan}
        disabled={isLoading} // Vô hiệu hóa onPress khi đang loading
      >
        <Text style={styles.orderText}>
          {isLoading ? 'Đang xử lý...' : 'Đặt hàng'}
        </Text>
      </TouchableOpacity>

      <CustomAlert
          visible={alertVisible}
          header={alertHeader}
          message={alertMessage}
          onClose={() => {
            setAlertVisible(false);
            navigation.reset({ index: 0, routes: [{ name: 'HTScreen' }] });
          }}
      />


      <CustomAlertSecond
        visible={confirmOpenBrowser}
        header={alertHeader}
        message={alertMessage}
        buttonTextNo="Hủy"
        buttonTextYes="Mở trình duyệt"
        onNo={() =>
          navigation.reset({
            index: 0,
            routes: [{ name: 'FailedScreen' }],
          })
        }
        onYes={async () => {
          setConfirmOpenBrowser(false);
          try {
            await openWithChrome(momoUrl);
            if (isPaymentSuccess) {
              navigation.navigate('HTScreen');
            } else {
              showAlert('Thông báo', 'Thanh toán chưa thành công, vui lòng thử lại!');
            }
          } catch (err) {
            console.error('[CheckoutScreen] Lỗi khi mở Chrome:', err);
            showAlert('Lỗi', 'Không thể mở Chrome hoặc liên kết không hợp lệ.');
          }
        }}
      />
    </SafeAreaView>
  );
};

// Cập nhật styles
const styles = StyleSheet.create({
  backButton: { paddingTop: 16 },
  backText: { fontSize: 16, fontWeight: 'bold' },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
  },

  section: {
    marginBottom: 16
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8
  },
  addressBox: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8
  },
  addressName: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  addressDetail: {
    fontSize: 14,
    color: 'gray'
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8},
  paymentText: {
    fontSize: 16
  },

  shippingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
  },

  shippingIcon: {
    width: 40,
    height: 40,
    marginRight: 10
  },
  shippingText: {
    fontSize: 16
  },

  priceSection: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 70,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  priceRowTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  priceLabel: { fontSize: 16, color: 'gray' },
  priceValue: { fontSize: 16 },
  totalLabel: { fontSize: 18, fontWeight: 'bold' },
  totalValue: { fontSize: 18, fontWeight: 'bold' },
  orderButton: {
    backgroundColor: 'black',
    padding: 16,
    alignItems: 'center',
    margin: 16,
    borderRadius: 8,
    marginTop: 10,
  },
  orderButtonDisabled: {
    backgroundColor: '#888', // Màu xám khi đang loading
    opacity: 0.7,
  },
  orderText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 8,
  },

  productImage: {
    width: 80, height: 80, borderRadius: 8, marginRight: 10},
  productInfo: {
    flex: 1
  },
  productName: {fontSize: 16, fontWeight: 'bold'},
  productSize: {fontSize: 14, color: 'gray'},
  productPrice: {fontSize: 16, fontWeight: 'bold', color: '#333'},
  productQuantity: {fontSize: 14, color: '#666'},
  emptyText: {fontSize: 16, textAlign: 'center', marginTop: 20, color: 'gray'},

  addressPhone: {
    fontSize: 14,
    color: '#333',
    marginTop: 4,
  },

  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },

  discountBox: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
  },
  discountHint: {
    fontSize: 14,
    color: 'gray',
    marginTop: 4,
  },
  selectedCoupon: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: '#e0f5f0',
    padding: 8,
    borderRadius: 8,
    marginBottom:10,

  },
  couponIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  couponText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#008060',
  },



});

export default CheckoutScreen;
