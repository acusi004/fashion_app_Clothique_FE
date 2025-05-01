import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  FlatList,
  ActivityIndicator,
  Image,
} from 'react-native';
import { getCoupons } from '../service/couponService';
import {useRoute} from '@react-navigation/native'; // Giả sử bạn có dịch vụ lấy mã giảm giá

// @ts-ignore
const CouponScreen = ({navigation}) => {
  const [activeTab, setActiveTab] = useState<'available' | 'manual'>('available');
  const [inputCode, setInputCode] = useState('');
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchedCoupon, setSearchedCoupon] = useState<any | null>(null);
  const [searchError, setSearchError] = useState('');
  const [selectedCouponId, setSelectedCouponId] = useState<string | null>(null);
  const [selectedCoupon, setSelectedCoupon] = useState<any | null>(null);

  const route = useRoute();
  // @ts-ignore
  const { orderTotal } = route.params || {};


  useEffect(() => {
    // Hàm để lấy mã giảm giá từ API
    const fetchCoupons = async () => {
      try {
        const data = await getCoupons(); // Thay thế bằng hàm API thực tế của bạn
        setCoupons(data.coupons); // Giả sử dữ liệu trả về có trường coupons chứa danh sách mã giảm giá
        setLoading(false);
      } catch (error) {
        console.error('Lỗi khi lấy mã giảm giá:', error);
        setLoading(false);
      }
    };

    fetchCoupons(); // Lấy mã giảm giá khi component được mount
  }, []);
  useEffect(() => {
    if (inputCode.trim() === '') {
      setSearchedCoupon(null);
      setSearchError('');
    }
  }, [inputCode]);

  const renderCouponItem = ({ item }: { item: any }) => {
    const isAvailable = orderTotal >= item.minOrderValue;

    return (

      <View style={[styles.couponCard, !isAvailable && { opacity: 0.4 }]}>

        <Image source={require('../Image/coupon.jpg')} style={styles.logo} />

        <View style={styles.couponText}>
          <Text style={styles.discount}>
            {item.discountType === 'fixed'
              ? `Giảm ₫${(item.discountValue / 1000).toLocaleString()}k`
              : `Giảm ${item.discountValue}%`}
          </Text>
          <Text style={styles.minOrder}>Đơn tối thiểu ₫{item.minOrderValue?.toLocaleString()}k</Text>
          <Text style={styles.expiry}>HSD: {new Date(item.validUntil).toLocaleDateString('vi-VN')}</Text>
        </View>



        <TouchableOpacity
          disabled={!isAvailable}
          onPress={() => {
            if (isAvailable) {
              setSelectedCouponId(item._id);
              setSelectedCoupon(item);
            }
          }}

          style={styles.radioWrapper}
        >
          <View style={[styles.radioCircle, selectedCouponId === item._id && styles.radioSelected]} />
        </TouchableOpacity>

      </View>
    );
  };


  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'available' && styles.activeTab]}
          onPress={() => setActiveTab('available')}>
          <Text style={[styles.tabText, activeTab === 'available' && styles.activeTabText]}>Mã đang có</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'manual' && styles.activeTab]}
          onPress={() => setActiveTab('manual')}>
          <Text style={[styles.tabText, activeTab === 'manual' && styles.activeTabText]}>Nhập mã</Text>
        </TouchableOpacity>
      </View>

      {/* Nội dung */}
      {activeTab === 'available' ? (
        loading ? (
          <ActivityIndicator size="large" color="#000" />
        ) : (
          <FlatList
            data={coupons}
            keyExtractor={item => item._id}  // Chỉnh sửa keyExtractor thành item._id
            renderItem={renderCouponItem}
            contentContainerStyle={{ paddingVertical: 10 }}
          />


        )
      ) : (
        <View style={{flexDirection:'column', flex:1}}>
         <View style={styles.manualContainer}>
           <TextInput
             placeholder="Nhập mã tại đây"
             style={styles.input}
             value={inputCode}
             onChangeText={setInputCode}
           />

           <TouchableOpacity
             style={styles.applyButton}
             onPress={async () => {

               try {
                 const data = await getCoupons(inputCode);
                 if (data.coupons.length > 0) {
                   setSearchedCoupon(data.coupons[0]);
                 } else {
                   setSearchedCoupon(null);
                   setSearchError('Không tìm thấy mã phù hợp');
                 }
               } catch (error) {
                 console.error('Lỗi khi tìm mã:', error);
                 setSearchError('Đã xảy ra lỗi khi tìm mã');
               } finally {
                 setLoading(false);
               }
             }}
           >
             <Text style={styles.applyText}>Áp dụng</Text>
           </TouchableOpacity>
         </View>

          <View style={{ marginTop: 16 }}>
            {loading ? (
              <ActivityIndicator size="large" color="#000" />
            ) : searchedCoupon ? (
              renderCouponItem({ item: searchedCoupon })
            ) : searchError ? (
              <Text style={{ color: 'red', textAlign: 'center' }}>{searchError}</Text>
            ) : null}
          </View>
        </View>


      )}

      {selectedCoupon && (
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={() => {
            // @ts-ignore
            route.params?.onSelectCoupon?.(selectedCoupon);
            navigation.goBack();
          }}
        >
          <Text style={styles.confirmText}>Đồng ý</Text>
        </TouchableOpacity>
      )}
    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 16
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  activeTab: {
    backgroundColor: '#000',
  },
  tabText: {
    fontSize: 16,
    color: '#000'
  },
  activeTabText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  couponCard: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    paddingRight:10,
    marginBottom: 16,
    alignItems: 'center',
    borderLeftWidth:0
  },
  logo: {
    width: 170,
    height:100,



  },
  couponText: {
    flex: 1,
    marginLeft:10
  },
  code: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  discount: {
    fontSize: 14,
    fontWeight: '600'
  },
  description: {
    fontSize: 14,
    marginTop: 6 },
  expiry: {
    fontSize: 13,
    color: '#555'
  },
  selectButton: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  selectText: { fontWeight: 'bold' },
  manualContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 45,
    marginRight: 10,
    color: '#000',
  },
  applyButton: {
    backgroundColor: '#000',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  applyText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  minOrder: {
    fontSize: 14,
    color: '#555',
    marginTop: 2,
  },
  radioWrapper: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },

  radioCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'transparent',
  },

  radioSelected: {
    backgroundColor: '#000',
  },
  confirmButton: {
    backgroundColor: '#000',
    paddingVertical: 14,
    marginTop: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  confirmText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },



});

export default CouponScreen;
