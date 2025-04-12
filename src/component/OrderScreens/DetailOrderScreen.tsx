// screens/OrderDetailScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

// @ts-ignore
const DetailOrderScreen = ({route}) => {
  const {order} = route.params;

  const product = order.orderItems[0];
  const variant = product.variantId;
  const productInfo = product.productId;

  const renderStatusText = () => {
    const status = order.orderStatus;
    const paymentPending =
      order.paymentMethod === 'COD' && order.paymentStatus === 'Pending';

    if (paymentPending) return 'Chưa thanh toán - Thanh toán khi nhận hàng';

    switch (status) {
      case 'Pending':
        return 'Đơn hàng đang được xử lý';
      case 'Processing':
        return 'Đơn hàng đang chuẩn bị';
      case 'Shipped':
        return 'Đơn hàng đang được giao';
      case 'Delivered':
        return `Giao hàng thành công`;
      case 'Cancelled':
        return 'Đơn hàng đã bị hủy';
      default:
        return 'Trạng thái không xác định';
    }
  };


  const formatHistoryText = (text) => {
    // Tìm và format lại phần thời gian nếu có
    const regex = /vào lúc (\d{1,2}:\d{1,2}:\d{1,2}) (\d{1,2})\/(\d{1,2})\/(\d{4})/;
    const match = text.match(regex);

    if (match) {
      const [, time, day, month, year] = match;
      const formatted = `${time.substring(0, 5)} ${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
      return text.replace(regex, `vào lúc ${formatted}`);
    }

    return text; // Nếu không match, trả nguyên
  };

  return (
    <View style={{flex:1, backgroundColor:'#FFF'}}>
      <ScrollView  style={styles.container}>
        <Text style={styles.title}>{renderStatusText()}</Text>

        <View style={styles.section}>
          <Text style={styles.label}>Thông tin vận chuyển</Text>
          <Text>SPX Express: SPXVN050683193434</Text>
          {order.orderStatus === 'Delivered' && (
              <Text style={styles.success}>{renderStatusText()}</Text>
          )}

        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Địa chỉ nhận hàng</Text>
          <Text>
            {order.shippingAddress.name} - {order.shippingAddress.phoneNumber}
          </Text>
          <Text>
            {order.shippingAddress.addressDetail},{' '}
            {order.shippingAddress.districtId} - {order.shippingAddress.wardCode}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Sản phẩm</Text>

          {order.orderItems.map((item, index) => (
              <View key={index}>
                <View style={styles.productRow}>
                  <Image
                      source={{ uri: `http://10.0.2.2:5000${item.variantId.images[0]}` }}
                      style={styles.image}
                  />
                  <View style={styles.info}>
                    <Text>{item.productId.name}</Text>
                    <Text>
                      {item.variantId.size} - {item.variantId.color}
                    </Text>
                    <Text>Số lượng: {item.quantity}</Text>
                    <Text style={styles.price}>
                      ₫{item.variantId.price.toLocaleString()}
                    </Text>
                  </View>
                </View>

                {/* Đường kẻ sau mỗi sản phẩm, trừ sản phẩm cuối */}
                {index < order.orderItems.length - 1 && (
                    <View style={styles.divider} />
                )}
              </View>
          ))}

        </View>


        <View style={styles.footer}>
          <View style={styles.section}>
            <Text style={styles.label}>Chi tiết giá tiền</Text>

            {order.orderItems.map((item, index) => (
                <View key={index} style={styles.priceRow}>
                  <Text style={{ flex: 1 }}>
                    {item.productId.name} ({item.variantId.size}/{item.variantId.color}) x {item.quantity}
                  </Text>
                  <Text>
                    ₫{(item.variantId.price * item.quantity).toLocaleString()}
                  </Text>
                </View>
            ))}

            <View style={styles.priceRow}>
              <Text style={{ flex: 1, fontWeight: 'bold' }}>Phí vận chuyển</Text>
              <Text>₫{order.shippingFee.toLocaleString()}</Text>
            </View>

            <View style={[styles.priceRow, { borderTopWidth: 1, borderColor: '#ccc', paddingTop: 6 }]}>
              <Text style={{ flex: 1, fontWeight: 'bold' }}>Tổng cộng</Text>
              <Text style={{ fontWeight: 'bold' }}>₫{order.totalAmount.toLocaleString()}</Text>
            </View>
          </View>


          {order.history && order.history.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.label}>Lịch sử đơn hàng:</Text>
                {order.history.map((event, index) => (
                    <Text
                        key={index}
                        style={[
                          styles.historyItem,
                          event.includes('bị hủy') && { color: 'red' },
                          event.includes('giao hàng') && { color: '#1abc9c' },
                        ]}
                    >
                      • {formatHistoryText(event)}
                    </Text>
                ))}
              </View>
          )}



        </View>

      </ScrollView>
      {order.orderStatus === 'Delivered' && (
          <View style={styles.buttons}>
            <TouchableOpacity style={styles.btnOutline}>
              <Text>Trả hàng/Hoàn tiền</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnPrimary}>
              <Text style={{ color: '#B35A00' }}>Đã nhận được hàng</Text>
            </TouchableOpacity>
          </View>
      )}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#FFF',
    backgroundColor:'#1abc9c',
    borderRadius:10,
    padding:10
  },
  section: {
    marginBottom: 20
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 6
  },
  success: {
    color: 'green'
  },
  productRow: {
    flexDirection: 'row',
    gap: 10
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8
  },
  info: {
    flex: 1
  },
  price: {
    marginTop: 4,
    fontWeight: '600'
  },
  footer: {
    marginTop: 20
  },
  total: {
    fontWeight: 'bold',
    textAlign: 'right',
    fontSize: 16
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    alignItems:'center',
    marginBottom:20,
    alignSelf:'center'
  },
  btnOutline: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    marginRight: 8,
    width:'45%',
    alignItems:'center',
    height:50,
   justifyContent:'center'
  },
  btnPrimary: {
    backgroundColor: '#fff3e6',
    borderColor: '#B35A00',
    borderWidth: 1,
    padding: 8,
    borderRadius: 6,
    width:'45%',
    alignItems:'center',
    height:50,
    justifyContent:'center'
  },
  historyItem: {
    color: '#444',
    fontSize: 15,
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 10,
  },



});

export default DetailOrderScreen;
