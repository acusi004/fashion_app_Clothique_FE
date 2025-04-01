import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// @ts-ignore
const CustomAlert = ({ visible, onClose, header, message }) => {
    return (
        <Modal transparent visible={visible} animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.alertContainer}>
                    <View style={styles.iconWrapper}>
                        <MaterialIcons name="info" size={28} color="#fff" />
                    </View>

                    <Text style={styles.header}>{header}</Text>
                    <Text style={styles.message}>{message}</Text>

                    <TouchableOpacity style={styles.button} onPress={onClose}>
                        <Text style={styles.buttonText}>Okay</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    alertContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingVertical: 30,
        paddingHorizontal: 20,
        width: 260,
        alignItems: 'center',
        position: 'relative',
    },
    iconWrapper: {
        position: 'absolute',
        top: -30,
        backgroundColor: '#5b5d6b',
        padding: 15,
        borderRadius: 50,
    },
    header: {
        marginTop: 20,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    message: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginVertical: 10,
    },
    button: {
        backgroundColor: '#5b5d6b',
        paddingHorizontal: 25,
        paddingVertical: 10,
        borderRadius: 8,
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default CustomAlert;
