import React from 'react';
import { BlurView } from 'expo-blur';
import { View, StyleSheet, Platform } from 'react-native';

const TabBarBackground: React.FC = () => {
    if (Platform.OS === 'ios') {
        return <BlurView intensity={50} style={StyleSheet.absoluteFill} />;
    }
    return <View style={[StyleSheet.absoluteFill, { backgroundColor: '#fff' }]} />;
};

export default TabBarBackground;