import React, {useEffect, useState} from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Checkbox, TextInput} from 'react-native-paper';
import tokenService from '../service/tokenService';
import {SwipeListView} from 'react-native-swipe-list-view';
import {useNavigation} from '@react-navigation/native';
import CustomAlert from '../styles/CustomAlert.tsx';

function CartScreen() {
  const [cartData, setCartData] = useState([]); // Dữ liệu giỏ hàng từ API
  const [quantities, setQuantities] = useState({}); // Số lượng sản phẩm
  const BASE_URL = 'http://10.0.2.2:5000'; // API local
  const [selectedItems, setSelectedItems] = useState([]);
  const navigation = useNavigation();

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertHeader, setAlertHeader] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const showAlert = (header: string, message: string) => {
    setAlertHeader(header);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = await tokenService.getToken();
        if (!token) {
          console.warn('Chưa có token, vui lòng đăng nhập trước.');
          return;
        }

        const response = await fetch(`${BASE_URL}/v1/cart/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          console.warn('Lỗi 401: Token không hợp lệ hoặc đã hết hạn.');
          return;
        }

        const data = await response.json();
        setCartData(data.cart || []); // Đảm bảo dữ liệu chính xác

        // Cập nhật số lượng ban đầu của từng sản phẩm
        console.log(cartData);

        const initialQuantities = {};
        data.cart.forEach(item => {
          initialQuantities[item.productId._id] = item.quantity;
        });
        setQuantities(initialQuantities);
      } catch (error) {
        console.error('Lỗi khi gọi API:', error);
      }
    };

    fetchCart();
  }, []);

  const deleteCartItem = async cartId => {
    try {
      const token = await tokenService.getToken();
      if (!token) {
        console.warn('Chưa có token, vui lòng đăng nhập trước.');
        return;
      }

      const response = await fetch(
        `${BASE_URL}/v1/cart/delete-cart/${cartId}`,
        {
          // 👈 Truyền ID vào URL
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        const text = await response.text();
        console.error('Lỗi từ server:', text);
        return;
      }

      console.log(`Sản phẩm ${cartId} đã bị xóa.`);
      setCartData(cartData.filter(item => item._id !== cartId));
    } catch (error) {
      console.error('Lỗi khi gọi API:', error);
    }
  };

  const updateCartItem = async (cartId, quantity) => {
    try {
      const token = await tokenService.getToken();
      if (!token) {
        console.warn('Chưa có token, vui lòng đăng nhập trước.');
        return;
      }

      const response = await fetch(`${BASE_URL}/v1/cart/update-cart`, {
        // ❌ Xoá cartId khỏi URL
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({cartItemId: cartId, quantity}), // ✅ Truyền cartItemId vào body
      });

      if (!response.ok) {
        const text = await response.text();
        console.error('Lỗi từ server:', text);
        return;
      }

      const updatedItem = await response.json();
      console.log(`Sản phẩm ${cartId} đã cập nhật thành công.`);

      setCartData(prevCart =>
        prevCart.map(item =>
          item._id === cartId ? {...item, quantity} : item,
        ),
      );
    } catch (error) {
      console.error('Lỗi khi gọi API:', error);
    }
  };

  const increaseQuantity = (cartId, sl, stock) => {
    if (sl >= stock) {
      // Dừng ngay nếu đã đạt số lượng tối đa
      showAlert('Thông báo', `Loại sản phẩm này còn ${sl} trong kho`);
      return;
    }

    const newQuantity = sl + 1;

    setQuantities(prevQuantities => ({
      ...prevQuantities,
      [cartId]: newQuantity,
    }));

    setCartData(prevCart => {
      return prevCart.map(item =>
        item._id === cartId ? {...item, quantity: newQuantity} : item,
      );
    });

    updateCartItem(cartId, newQuantity); // Gọi API cập nhật
  };

  const decreaseQuantity = (cartId, sl, stock) => {
    if (sl <= 1) {
      showAlert('Thông báo', 'Số lượng tối thiểu là 1');
      return;
    }

    const newQuantity = sl - 1;

    setQuantities(prev => ({
      ...prev,
      [cartId]: newQuantity,
    }));

    // @ts-ignore
    setCartData(prevCart =>
      prevCart.map(item =>
        item._id === cartId ? {...item, quantity: newQuantity} : item,
      ),
    );

    updateCartItem(cartId, newQuantity);
  };

  // Lấy đường dẫn ảnh sản phẩm
  const getFullImageUrl = imagePath => {
    return imagePath.startsWith('/uploads/')
      ? `${BASE_URL}${imagePath}`
      : imagePath;
  };

  const toggleSelectItem = cartId => {
    setSelectedItems(prev =>
      prev.includes(cartId)
        ? prev.filter(id => id !== cartId)
        : [...prev, cartId],
    );
  };

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      showAlert('Thông báo', 'Vui lòng chọn ít nhất một sản phẩm để thanh toán.');
      return;
    }

    const selectedProducts = cartData.filter(item =>
        selectedItems.includes(item._id),
    );
    navigation.replace('PaymentScreen', {selectedProducts});
    console.log('thông tin ', selectedProducts);
  };

  return (

    <SafeAreaView style={styles.container}>


      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={{flex: 1}}>
        <SwipeListView
          data={cartData}
          keyExtractor={item => item._id.toString()}
          renderItem={({item}) => (
            <View style={styles.cartItem}>
              <Checkbox
                status={
                  selectedItems.includes(item._id) ? 'checked' : 'unchecked'
                }
                onPress={() => toggleSelectItem(item._id)}
              />
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
                <Text style={styles.productTitle}>{item.productId.name}</Text>
                <Text style={styles.productSize}>
                  Size {item.variantId.size}
                </Text>
                <Text style={styles.productPrice}>
                  {item.variantId?.price
                    ? (item.variantId.price * item.quantity).toLocaleString()
                    : 'Chưa có giá'}{' '}
                  đ
                </Text>
              </View>

              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  onPress={() =>
                    decreaseQuantity(
                      item._id,
                      item.quantity,
                      item.variantId.stock,
                    )
                  }>
                  <Image
                    source={require('../Image/minus.png')}
                    style={{width: 15, height: 15}}
                  />
                </TouchableOpacity>
                <Text style={styles.quantityText}>
                  {quantities[item._id] ?? item.quantity}
                </Text>

                <TouchableOpacity
                  onPress={() =>
                    increaseQuantity(
                      item._id,
                      item.quantity,
                      item.variantId.stock,
                    )
                  }>
                  <Image
                    source={require('../Image/add.png')}
                    style={{width: 15, height: 15}}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
          renderHiddenItem={({item}) => (
            <View style={styles.hiddenContainer}>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteCartItem(item._id)}>
                <Text style={styles.deleteText}>Xóa</Text>
              </TouchableOpacity>
            </View>
          )}
          rightOpenValue={-75}
          disableRightSwipe
        />
      </View>
      <TouchableOpacity
        style={styles.checkoutButton}
        onPress={() => {
          handleCheckout();
        }}>
        <Text style={styles.checkoutText}>
          Thanh toán ({selectedItems.length})
        </Text>
      </TouchableOpacity>
      <CustomAlert
        visible={alertVisible}
        header={alertHeader}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16, backgroundColor: '#fff'},
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  productImage: {width: 80, height: 80, borderRadius: 8},
  productInfo: {flex: 1, marginLeft: 12},
  productTitle: {fontSize: 16, fontWeight: 'bold'},
  productSize: {fontSize: 14, color: 'gray', marginVertical: 4},
  productPrice: {fontSize: 16, fontWeight: 'bold', color: '#333'},
  quantityContainer: {flexDirection: 'row', alignItems: 'center'},
  quantityButton: {
    width: 25,
    height: 25,
    borderRadius: 12.5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: '#fff',
  },
  quantityText: {fontSize: 16, marginHorizontal: 12},
  hiddenContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: '#ff3b30',
    borderRadius: 8,
    marginBottom: 20,
  },
  deleteButton: {
    backgroundColor: '#ff3b30',
    justifyContent: 'center',
    alignItems: 'center',
    width: 75,
    height: '100%',
  },
  deleteText: {color: 'white', fontSize: 16, fontWeight: 'bold'},
  checkoutButton: {
    backgroundColor: 'black',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkoutText: {color: 'white', fontSize: 16, fontWeight: 'bold'},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
   paddingEnd:16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
    color: '#000',
  },
  backButton: {
   paddingTop:4,
   paddingBottom:4
  },
  backIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },

});

export default CartScreen;
