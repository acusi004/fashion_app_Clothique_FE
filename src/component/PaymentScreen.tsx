import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Alert,
  Linking, ScrollView,
} from 'react-native';
import { RadioButton } from 'react-native-paper';
import tokenService from '../service/tokenService';
import CustomAlert from "../styles/CustomAlert.tsx";

const CheckoutScreen = () => {
  const [paymentMethod, setPaymentMethod] = React.useState('');
  const navigation = useNavigation();
  const route = useRoute();
  const { selectedProducts } = route.params || { selectedProducts: [] };
  const { address } = route.params || { address: [] };
  const {selectedProducts} = route.params || {selectedProducts: []};
  const {address} = route.params || {address: []};
  const { paymentMethod1 } = route.params || {}; // đổi tên để không trùng với state
  const BASE_URL = 'http://10.0.2.2:5000'; // API local

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertHeader, setAlertHeader] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  useEffect(() => {
    if (paymentMethod1) {
      setPaymentMethod(paymentMethod1);
    }
    console.log('Selected Products: ', selectedProducts);
    console.log('Địa chỉ: ', address ? address._id : 'Không có địa chỉ');
    console.log('Phương thức thanh toán nhận vào:', paymentMethod1);
  }, []);
  const showAlert = (header: string, message: string) => {
    setAlertHeader(header);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  useEffect(() => {
    console.log('fdfd ', selectedProducts);
    console.log('jjj ', address ? address._id : 'Không có địa chỉ');
  }, []);
  // Lấy đường dẫn ảnh sản phẩm
  const getFullImageUrl = imagePath => {
    return imagePath.startsWith('/uploads/')
      ? `${BASE_URL}${imagePath}`
      : imagePath;
  };

  const totalPrice = selectedProducts.reduce((total, item) => {
    return total + item.variantId.price * item.quantity;
  }, 0);

  const checkMoMoApp = async (url) => {
    const supported = await Linking.canOpenURL(url);
    
  };

  
  const thanhtoan = async () => {
    if (!address) {
      return showAlert('Thông báo', 'Hãy chọn địa chỉ giao hàng');
    }
  
    try {
      const token = await tokenService.getToken();
      if (!token) {
        return Alert.alert('Vui lòng đăng nhập trước!');
      }
  
      const response = await fetch(`${BASE_URL}/v1/order/createOrder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          shippingAddressId: address._id,
          cartItems: selectedProducts.map(item => item._id),
          paymentMethod: paymentMethod,
        }),
      });
  
      const data = await response.json();
      if (response.ok) {
        Alert.alert('Đặt hàng thành công!');

        if (paymentMethod === 'MoMo' && data.momoResult?.payUrl) {
          // Mở trình duyệt cho người dùng thanh toán MoMo
          Linking.openURL(data.momoResult.payUrl);
          navigation.navigate('HTScreen');
        } else {
          // Điều hướng về màn hình lịch sử đơn hàng sau khi đặt hàng COD
          navigation.navigate('HTScreen');
        }
      console.log('Response:', data);
      console.log('Order data:', data.data);
      const momoUrl = data?.momoResult?.payUrl;
      console.log('MoMo URL:', momoUrl);
  
      if (!response.ok) {
        throw new Error(data.message || 'Đặt hàng thất bại!');
      }
  
      Alert.alert('Đặt hàng thành công!');
  
      if (paymentMethod === 'MoMo' && momoUrl) {
        await checkMoMoApp(momoUrl);
  Linking.openURL(momoUrl);
      } else {
        navigation.navigate('HTScreen');
      }
    } catch (error) {
      console.error('Lỗi khi đặt hàng:', error);
      Alert.alert('Lỗi', error.message || 'Đã xảy ra lỗi, vui lòng thử lại!');
    }
  };
  
  

  return (
    <ScrollView>
      <SafeAreaView style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Image source={require('../Image/back.png')} />
        </TouchableOpacity>
        <Text style={styles.header}>Thanh toán</Text>

        <View style={styles.section}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('ChoiceAddress', { selectedProducts })
            }>
            <Text style={styles.sectionTitle}>Địa chỉ giao hàng</Text>
            {address ? (
              <View style={styles.addressBox}>
                <Text style={styles.addressName}>{address.name}</Text>
                <Text style={styles.addressDetail}>
                  {address.addressDetail +
                    ',' +
                    address.wardName +
                    ',' +
                    address.districtName +
                    ',' +
                    address.provinceName}
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

        {selectedProducts.length > 0 ? (
          <View style={{ width: '100%', paddingHorizontal: 10 }}>
            <FlatList
              scrollEnabled={false}
              data={selectedProducts}
              keyExtractor={item => item._id.toString()}
              renderItem={({ item }) => (
                <View style={styles.productItem}>
                  <Image
                    source={{
                      uri:
                        item.variantId.images && item.variantId.images.length > 0
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
                      {item.variantId?.price
                        ? (item.variantId.price * item.quantity).toLocaleString()
                        : 'Chưa có giá'}{' '}
                      đ
                    </Text>
                    <Text style={styles.productQuantity}>
                      Số lượng: {item.quantity}
                    </Text>
                  </View>
                </View>
              )}
            />
          </View>
        ) : (
          <Text style={styles.emptyText}>Không có sản phẩm nào được chọn.</Text>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
          <View style={styles.paymentOption}>
            <RadioButton.Android
              value="MoMo"
              status={paymentMethod === 'MoMo' ? 'checked' : 'unchecked'}
              onPress={() => setPaymentMethod('MoMo')}
            />
            <Text style={styles.paymentText}>ZaloPay</Text>
          </View>
          <View style={styles.paymentOption}>
            <RadioButton.Android
              value="COD"
              status={paymentMethod === 'COD' ? 'checked' : 'unchecked'}
              onPress={() => setPaymentMethod('COD')}
            />
            <Text style={styles.paymentText}>Thanh toán khi nhận hàng</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Phương thức giao hàng</Text>
          <View style={styles.shippingBox}>
            <Image
              source={require('../Image/giaohangtietkiem.png')}
              style={styles.shippingIcon}
            />
            <Text style={styles.shippingText}>
              Giao hàng tiết kiệm (2-3 days)
            </Text>
          </View>
        </View>

        <View style={styles.priceSection}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Giá:</Text>
            <Text style={styles.priceValue}>{totalPrice.toLocaleString()} đ</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Phí Vận Chuyển:</Text>
            <Text style={styles.priceValue}>30000 đ</Text>
          </View>
          <View style={styles.priceRowTotal}>
            <Text style={styles.totalLabel}>Tổng:</Text>
            <Text style={styles.totalValue}>
              {(totalPrice + 30000).toLocaleString()} đ
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.orderButton}
          onPress={() => {
            thanhtoan();
          }}>
          <Text style={styles.orderText}>Đặt hàng</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </ScrollView>
      <SafeAreaView style={styles.container}>
        <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
          <Image source={require('../Image/back.png')} />
        </TouchableOpacity>
        <Text style={styles.header}>Thanh toán</Text>
       <ScrollView>


         <View style={styles.section}>
           <TouchableOpacity
               onPress={() =>
                   navigation.navigate('ChoiceAddress', {selectedProducts,paymentMethod:paymentMethod})
               }>
             <Text style={styles.sectionTitle}>Địa chỉ giao hàng</Text>
             {address ? (
                 <View style={styles.addressBox}>
                   <Text style={styles.addressName}>{address.name}</Text>
                   <Text style={styles.addressDetail}>
                     {address.addressDetail +
                         ',' +
                         address.wardName +
                         ',' +
                         address.districtName +
                         ',' +
                         address.provinceName}
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

         {selectedProducts.length > 0 ? (
             <View style={{width: '100%', paddingHorizontal: 10}}>
               <FlatList
                   data={selectedProducts}
                   nestedScrollEnabled={true}
                   scrollEnabled={false}
                   keyExtractor={item => item._id.toString()}
                   renderItem={({item}) => (
                       <View style={styles.productItem}>
                         <Image
                             source={{
                               uri:
                                   item.variantId.images && item.variantId.images.length > 0
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
                           <Text style={styles.productPrice}>Giá: 
                             {item.variantId?.price
                                 ? (item.variantId.price * item.quantity).toLocaleString()
                                 : 'Chưa có giá'}{' '}
                             đ
                           </Text>
                           <Text style={styles.productQuantity}>
                             Số lượng: {item.quantity}
                           </Text>
                         </View>
                       </View>
                   )}
               />
             </View>
         ) : (
             <Text style={styles.emptyText}>Không có sản phẩm nào được chọn.</Text>
         )}

         <View style={styles.section}>
           <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
           <View style={styles.paymentOption}>
             <RadioButton.Android
                 value="MoMo"
                 status={paymentMethod === 'MoMo' ? 'checked' : 'unchecked'}
                 onPress={() => setPaymentMethod('MoMo')}
             />
             <Text style={styles.paymentText}>MoMo</Text>
           </View>
           <View style={styles.paymentOption}>
             <RadioButton.Android
                 value="COD"
                 status={paymentMethod === 'COD' ? 'checked' : 'unchecked'}
                 onPress={() => setPaymentMethod('COD')}
             />
             <Text style={styles.paymentText}>Thanh toán khi nhận hàng</Text>
           </View>
         </View>

         <View style={styles.section}>
           <Text style={styles.sectionTitle}>Phương thức giao hàng</Text>
           <View style={styles.shippingBox}>
             <Image
                 source={require('../Image/giaohangtietkiem.png')}
                 style={styles.shippingIcon}
             />
             <Text style={styles.shippingText}>
               Giao hàng tiết kiệm (2-3 days)
             </Text>
           </View>
         </View>

         <View style={styles.priceSection}>
           <View style={styles.priceRow}>
             <Text style={styles.priceLabel}>Giá:</Text>
             <Text style={styles.priceValue}>{totalPrice.toLocaleString()} đ</Text>
           </View>
           <View style={styles.priceRow}>
             <Text style={styles.priceLabel}>Phí Vận Chuyển:</Text>
             <Text style={styles.priceValue}>25000 đ</Text>
           </View>
           <View style={styles.priceRowTotal}>
             <Text style={styles.totalLabel}>Tổng:</Text>
             <Text style={styles.totalValue}>
               {(totalPrice + 25000).toLocaleString()} đ
             </Text>
           </View>
         </View>
       </ScrollView>

        <TouchableOpacity
            style={styles.orderButton}
            onPress={() => {
              thanhtoan();
            }}>
          <Text style={styles.orderText}>Đặt hàng</Text>
        </TouchableOpacity>
        <CustomAlert
            visible={alertVisible}
            header={alertHeader}
            message={alertMessage}
            onClose={() => setAlertVisible(false)}
        />

      </SafeAreaView>
  );
};

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
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  addressBox: { backgroundColor: '#f5f5f5', padding: 12, borderRadius: 8 },
  addressName: { fontSize: 16, fontWeight: 'bold' },
  addressDetail: { fontSize: 14, color: 'gray' },
  paymentOption: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  paymentText: { fontSize: 16 },
  shippingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
  },
  shippingIcon: { width: 40, height: 40, marginRight: 10 },
  shippingText: { fontSize: 16 },
  priceSection: { padding: 16, backgroundColor: '#f5f5f5', borderRadius: 8, marginBottom: 70 },
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
    marginTop: 10
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
  productImage: { width: 80, height: 80, borderRadius: 8, marginRight: 10 },
  productInfo: { flex: 1 },
  productName: { fontSize: 16, fontWeight: 'bold' },
  productSize: { fontSize: 14, color: 'gray' },
  productPrice: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  productQuantity: { fontSize: 14, color: '#666' },
  emptyText: { fontSize: 16, textAlign: 'center', marginTop: 20, color: 'gray' },
  addressPhone: {
    fontSize: 14,
    color: '#333',
    marginTop: 4,
  },
});

export default CheckoutScreen;
