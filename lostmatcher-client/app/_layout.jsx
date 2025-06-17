import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import {SplashScreen,Stack} from 'expo-router';
import { useFonts } from 'expo-font';
import GlobalProvider from '../context/globalContext';

SplashScreen.preventAutoHideAsync();
const RootLayout = () => {
  const [fontsLoaded, error]=useFonts({
    "Poppins":require("../assets/fonts/Poppins-Regular.ttf"),
    "Roboto-Reguler":require("../assets/fonts/Roboto-Regular.ttf"),
    "Roboto-Thin":require("../assets/fonts/Poppins-Thin.ttf"),
    "Roboto-Medium":require("../assets/fonts/Roboto-Medium.ttf"),
    "RougeScript-Regular":require("../assets/fonts/RougeScript-Regular.ttf")
  })
  useEffect(()=>{
    if(error)  throw error;

    if (fontsLoaded) SplashScreen.hideAsync()
    
  },[fontsLoaded,error])
  
    if (!fontsLoaded && !error) {
       return null;
    }
  return (
    <GlobalProvider>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: '#f2f2f2',
            },
            headerTintColor: '#000',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}>
            
          {/* Optionally configure static options outside the route.*/}
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(Tabs)" options={{headerShown:false}} />
        </Stack>
    </GlobalProvider>
      
   );
}

export default RootLayout

