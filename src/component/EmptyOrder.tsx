import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const EmptyOrder = () => {
    return (
        <View style={styles.container}>
            <Image source={require('../Image/note.png')} style={styles.image} />
            <Text style={styles.text}>Bạn chưa có đơn hàng nào cả</Text>
        </View>
    );
};

export default EmptyOrder;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: 100,
        height: 100,
        marginBottom: 12,
    },
    text: {
        fontSize: 15,
        color: '#666',
    },
});
