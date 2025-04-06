import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  Alert,
} from 'react-native';
import AddressForm from './AddressFrom.tsx';
import EditAddressForm from './EditAddressForm.tsx'; // 🔹 Import form sửa địa chỉ
import tokenService from '../service/tokenService';
import {jwtDecode, JwtPayload} from 'jwt-decode';

interface CustomJwtPayload extends JwtPayload {
  email?: string;
}

import axios, {AxiosError} from 'axios';
import {useNavigation, useRoute} from '@react-navigation/native';
import CustomAlert from "../styles/CustomAlert.tsx";

const AddressScreen = () => {
  interface Address {
    _id: string;
    name?: string;
    addressDetail?: string;
    phoneNumber?: string;
    province?: {id: number; name: string};
    district?: {id: number; name: string};
    ward?: {id: number; name: string};
    provinceName?: string;
    districtName?: string;
    wardName?: string;
  }

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [add, setadd] = useState([]);
  const navigation = useNavigation();
  const route = useRoute();

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertHeader, setAlertHeader] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const showAlert = (header: string, message: string) => {
    setAlertHeader(header);
    setAlertMessage(message);
    setAlertVisible(true);
  };


  const { selectedProducts, paymentMethod } = route.params || {};



  const closeModal = () => {
    setEditModalVisible(false);
    setSelectedAddress(null);
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const token = await tokenService.getToken();
      if (!token) {
        console.error('❌ Không tìm thấy token!');
        return showAlert('Lỗi', 'Bạn chưa đăng nhập!');
      }

      let decodedToken: CustomJwtPayload;
      try {
        decodedToken = jwtDecode<CustomJwtPayload>(token);
      } catch (err) {
        console.error('❌ Lỗi giải mã token:', err);
        return showAlert('Lỗi', 'Token không hợp lệ!');
      }

      const userEmail = decodedToken?.email;
      if (!userEmail) {
        console.error('❌ Không lấy được email từ token!', decodedToken);
        return showAlert('Lỗi', 'Email không hợp lệ!');
      }

      console.log('📌 Token gửi đi:', token);
      console.log('📌 Email gửi đi:', userEmail);

      const response = await axios.get(
        'http://10.0.2.2:5000/v1/user/addresses',
        {
          headers: {Authorization: `Bearer ${token}`},
          params: {email: userEmail},
        },
      );

      const normalized = response.data.addresses.map((addr: any) => ({
        ...addr,
        province: {id: addr.provinceId, name: addr.provinceName},
        district: {id: addr.districtId, name: addr.districtName},
        ward: {id: addr.wardCode, name: addr.wardName},
      }));

      console.log('📌 API trả về danh sách địa chỉ:', response.data);
      console.log('✅ Danh sách địa chỉ nhận được:', response.data);
      setAddresses(normalized);
      setAddresses(response.data.addresses);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          '❌ Lỗi khi lấy danh sách địa chỉ:',
          error.response?.data || error.message,
        );
        showAlert(
          'Lỗi',
          error.response?.data?.message || 'Không thể tải danh sách địa chỉ.',
        );
      } else if (error instanceof Error) {
        console.error('❌ Lỗi khi lấy danh sách địa chỉ:', error.message);
        showAlert('Lỗi', error.message);
      } else {
        console.error('❌ Lỗi khi lấy danh sách địa chỉ:', error);
        showAlert("Lỗi","Không thể tải danh sách địa chỉ.")
      }
    }
  };

  

  // @ts-ignore
  const handleEditAddress = selected => {
    console.log('📌 Địa chỉ được chọn để chỉnh sửa:', selected);

    if (!selected || !selected._id) {
      console.error('❌ Không có ID hợp lệ!', selected);
     showAlert('Lỗi', 'Dữ liệu địa chỉ bị thiếu ID!');
      return;
    }
    setSelectedAddress(selected);
    setTimeout(() => setEditModalVisible(true), 100);
  };

  
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Địa chỉ của bạn</Text>

      <FlatList
        data={addresses}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => {
          const isSelected = selectedAddressId === item._id;
          return (
            <TouchableOpacity
              style={[styles.addressCard, isSelected && styles.selectedCard]}
              onPress={() => handleEditAddress(item)}>
              <View style={styles.addressContent}>
                <Text style={styles.name}>{item?.name || 'Không có tên'}</Text>
                <Text style={styles.address}>
                  {item?.addressDetail || 'Không có địa chỉ'},{' '}
                  {item?.province?.name ||
                    item?.provinceName ||
                    'Không có tỉnh'}
                  ,{' '}
                  {item?.district?.name ||
                    item?.districtName ||
                    'Không có huyện'}
                  , {item?.ward?.name || item?.wardName || 'Không có xã'}
                </Text>
                <Text>{item?.phoneNumber || 'Khong co so'}</Text>
              </View>

              {/* Nút radio box chọn địa chỉ */}
              <TouchableOpacity
                onPress={() => {
                  setSelectedAddressId(item._id), setadd(item);
                }}>
                <View
                  style={
                    isSelected ? styles.radioSelected : styles.radioUnselected
                  }
                />
              </TouchableOpacity>

           
            </TouchableOpacity>
          );
        }}
      />
     
      <TouchableOpacity
          style={styles.confirmButton}
          onPress={() => {
            if (!selectedAddressId) {
              return showAlert('Thông báo', 'Vui lòng chọn địa chỉ trước khi tiếp tục!');
            }
            navigation.navigate('PaymentScreen', {
              address: add,
              selectedProducts: selectedProducts,
              paymentMethod1:paymentMethod
            });
          }}>
        <Text style={styles.confirmButtonText}>Xác nhận</Text>
      </TouchableOpacity>


      <Modal visible={modalVisible} animationType="slide">
       
      </Modal>
      {editModalVisible && selectedAddress && (
        <Modal visible={editModalVisible} animationType="slide">
          <EditAddressForm
            address={selectedAddress}
            onClose={closeModal}
            refreshAddresses={fetchAddresses}
          />
        </Modal>
      )}

      <CustomAlert
          visible={alertVisible}
          header={alertHeader}
          message={alertMessage}
          onClose={() => setAlertVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff', padding: 20},
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  addressCard: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  name: {fontSize: 16, fontWeight: 'bold'},
  address: {fontSize: 14, color: 'gray'},
  addButton: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    backgroundColor: 'black',
    borderRadius: 150,
    width:45,
    height:45,
    alignItems:'center',
    justifyContent:'center'
  },
  addButtonText: {color: 'white', fontSize: 20},
  confirmButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,

    right: 20,
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  confirmButtonText: {color: 'white', fontSize: 16, fontWeight: 'bold',},
  addressContent: {
    flex: 1,
  },
  selectedCard: {
    borderColor: 'green',
    backgroundColor: '#e6ffe6',
  },
  defaultText: {
    fontSize: 14,
    color: 'red', // ✅ Mặc định màu đỏ
    fontWeight: 'bold',
    textAlign: 'right',
    marginTop: 5,
  },
  deleteButton: {
    backgroundColor: 'gray',
    width: 40, // Nhỏ gọn hơn
    height: 40,
    borderRadius: 20, // Bo tròn hoàn toàn
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 300,
  },
  deleteIcon: {
    color: 'black',
    fontSize: 20, // Biểu tượng lớn hơn
    fontWeight: 'bold',
  },
  radioUnselected: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'gray',
    marginLeft: 'auto',
  },
  radioSelected: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'red',
    borderWidth: 2,
    borderColor: 'red',
    marginLeft: 'auto',
  },
});

export default AddressScreen;
