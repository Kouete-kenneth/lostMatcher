import { StatusBar } from 'expo-status-bar';
import { Text, View, ScrollView,ImageBackground, Image, Pressable, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useNavigation } from 'expo-router';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { FlatList } from 'react-native'
import Swiper from 'react-native-swiper'
import checkifLogin from '../utils/Authentication/Login/checkIfLogin.js'
// import getLoggedInUserId from '../utils/getUserIdFromAccessToken.js';
import { useGlobalContext } from '../context/globalContext.js';
import { useEffect, useState } from 'react';
const reviews = [
    {
      name: 'Jean paul',
      review: 'Great app for finding missing objects',
      rating: 5,
      image: require('../assets/images/profile.jpg'), 
    },
    {
      name: 'John peter',
      review: 'Very helpful, found item quickly',
      rating: 4,
      image: require('../assets/images/profile.jpg'),
    },
    {
        name: 'kouete laurant',
        review: 'Very helpful, found item quickly',
        rating: 4,
        image: require('../assets/images/profile.jpg'), 
      },
    // Add more reviews as needed
  ];

 
  const renderReviewItem = ({ item }) => (
    <View className="flex-row items-center border-b border-gray-300 py-4 px-2">
      <Image source={item.image} className="w-12 h-12 rounded-full mr-4" />
      <View className="flex-1">
        <Text className="font-semibold text-lg">{item.name}</Text>
        <Text>{item.review}</Text>
      </View>
      <View className="flex-row items-center">
        {[...Array(item.rating)].map((_, index) => (
          <Text key={index} className="text-yellow-400 text-xl">⭐</Text>
        ))}
      </View>
    </View>
  );

export default function App() {
    const features = [
        {
          title: 'Discover',
          description1: 'Explore the features of Lost & Found app',
          description2: 'Find lost items with ease using our advanced AI technology.',
          image: require('../assets/images/search.jpg'), 
        },
        {
          title: 'Contribute',
          description1: 'Help others find their missing objects',
          description2: 'Report found objects to reunite them with their owners.',
          image: require('../assets/images/contribute-title.png'),
        },
        {
          title: 'Track',
          description1: 'Real-time tracking and location updates',
          description2: 'Track the progress of found objects.',
          image: require('../assets/icons/globe.png'),
        },
      ];
      const [isError,setIsError]=useState(false)
      const [message,setMessage]=useState('');
      const {isLoading,isLoggedIn,setIsLoggedIn}=useGlobalContext()
      const navigation = useNavigation();
      
const handleGetStart=async()=>{
    
    console.log('LOGIN',isLoggedIn)
    if (isLoggedIn) {
        navigation.navigate('(Tabs)',{
            screen:'home'
        });
    }
    else {
        navigation.navigate('onboarding')
    }
   
}

const handleLoginbtnClicked=async()=>{
    
    console.log('LOGIN',isLoggedIn)
    if (isLoggedIn) {
        navigation.navigate('(Tabs)',{
            screen:'home'
        });
    }
    else {
        navigation.navigate('login')
    }
   
}
    
  return (
    <SafeAreaView className="flex-1 bg-white">
        {/* Navigation Bar */}
        <View className="flex-row justify-between items-center py-0 px-4 border-b border-gray-200" style={{ height: 60, width: '100%', backgroundColor: '#ffffff' }}>
            {/* Logo */}
            <View className="flex items-center justify-center p-2 rounded-full">
                <Image
                    source={require('../assets/images/Logo_redesigned.png')}
                    className="rounded-full"
                    style={{resizeMode: 'contain',width:40,height:40 }}
                />
            </View>

            {/* Menu Icons */}
            <View className="flex-row gap-x-4 items-center p-1 rounded-lg">
                <View className="p-0 hover:bg-gray-200 transition-colors" style={{height:30}}>
                    <Link href="/home">
                        <Image
                            source={require('../assets/icons/ic_baseline-home.png')}
                            style={{ width: 20, height: 20,resizeMode: 'contain' }}
                        />
                    </Link>
                </View>
                <View className="p-0 hover:bg-gray-200 transition-colors" style={{height:30}}>
                    <TouchableOpacity className="flex-row justify-center items-center p-2 bg-primary h-8 rounded-md hover:bg-gray-200 transition-colors" onPress={handleLoginbtnClicked}>
                        <FontAwesome name='user-o' size={20} color='#ffffff'/>
                        <Text className="font-bold text-xs text-bgsecondary ml-1">Login</Text>
                    </TouchableOpacity>
                </View>
                <View className="p-0   hover:bg-gray-200 transition-colors" style={{height:30}}>
                    <Link href="/menu">
                        <Image
                        className="mt-0"
                            source={require('../assets/icons/ic_baseline-menu.png')}
                            style={{ width: 20, height: 20,resizeMode: 'contain', marginTop:0 }}
                        />
                    </Link>
                </View>
            </View>
        </View>
        <ScrollView className="flex-col" contentContainerStyle={{alignItems:'center'}}>
            {/* Hero Section */}
            <ImageBackground
            source={require('../assets/images/hero_image.jpg')}
            className="w-full h-64 items-center justify-center"
            style={{ width: '100%', height: 300 }}
            imageStyle={{ resizeMode: 'cover' }}>
                <View className="bg-black absolute  opacity-40 w-full h-full">
                </View>
                <Text className="text-4xl text-primary font-bold font-Poppins">
                    Welcome to Find<Text className="font-extrabold">I</Text>t
                </Text>
                <Text className="text-lg text-bgsecondary mt-2 font-rRougeScript">
                    Helping you find what is lost
                </Text>
            </ImageBackground>
            <View className="flex-row gap-2 mt-0 ml-0 mr-3  py-3 px-4 justify-evenly items-center" style={{width:'100%',height:130}}>
                {/* Home Tab */}
                <Pressable className=" flex-1 items-center border-2 rounded-md border-gray-300" style={{height:'100%'}}>
                    <Text className="text-blue-500 text-4xl p-2">🔍</Text>
                    <Text className="text-sm">Search</Text>
                </Pressable>

                {/* Report Tab */}
                <Pressable className="items-center flex-1 border-2 rounded-md border-gray-300" style={{height:'100%'}}>
                    <Text className="text-blue-500 text-4xl p-2">📷</Text>
                    <Text className="text-sm">Report</Text>
                </Pressable>

                {/* Track Tab */}
                <Pressable className="items-center flex-1 border-2 border-gray-300 rounded-md" style={{height:'100%'}}>
                    <Text className="text-blue-500 text-4xl p-2">🌎</Text>
                    <Text className="text-sm">Track</Text>
                </Pressable>
            </View>
            {/**get started */}
            <View className="flex-1 mt-6 w-full items-center justify-center bg-white px-4">
                {/* Get Started Button */}
                <TouchableOpacity className="w-full  bg-primary py-2 rounded-lg items-center" onPress={handleGetStart}>
                     <Text className="text-white text-[#ffffff] text-lg font-semibold">Get Started</Text>
                </TouchableOpacity>

                {/* Or Text */}
                <Text className="text-gray-400 my-2 font-rRougeScript text-2xl">Or</Text>

                {/* Get Help Link */}
                <Link href="/help" className="text-primary text-lg font-semibold">
                    Get help
                </Link>
            </View>

            <View className="p-5 w-full">{/**more about findit */}
            <Text className="text-2xl font-bold mb-4">More About FindIt</Text>
                {features.map((feature, index) => (
                <View key={index} className="flex-row text-sm items-center mb-4 border-b border-gray-300 pb-4">
                    <Image
                    source={feature.image}
                    className="w-16 h-16 mr-4 rounded"
                    style={{ resizeMode: 'cover' }}
                    />
                    <View className="flex-1">
                    <Text className="text-lg font-bold">{feature.title}</Text>
                    <Text className="text-gray-600 text-xs">{feature.description1}</Text>
                    <Text className=" text-text mt-1">{feature.description2}</Text>
                    </View>
                </View>
                ))}
            </View>

            {/* User Reviews Section */}
            <View className="flex-1" style={{height:310}}>
            <View className="pl-5">
                <Text className="font-bold text-2xl">User Reviews</Text>
            </View>
            <Swiper
                style={{height:300}}
                showsPagination={false} // Disable default pagination dots
                horizontal={true} // Ensure horizontal scrolling
                showsButtons={true} // Enable navigation buttons
                nextButton={<Ionicons name="arrow-forward" size={24} color="black" />} 
                prevButton={<Ionicons name="arrow-back" size={24} color="black" />} >
                {reviews.map((review, index) => (
                    <View key={index} className="flex-1 justify-center items-center" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <View className="py-7 px-4 rounded-lg bg-bgsecondary">
                            <View className="flex-row justify-between items-center">
                                <View className="flex-row justify-start gap-x-2 items-center">
                                    <Image className="rounded-full" source={review.image} style={{ width: 40, height: 40 }} />
                                    <Text className="text-primary">{review.name}</Text>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                {[...Array(review.rating)].map((_, index) => (
                                <Ionicons key={index} name="star" size={10} color="gold" />
                                ))}
                                </View>
                            </View>
                            <View className="mt-4">
                                <Text>{review.review}</Text>
                            </View>
                    
                        </View>
                    </View>
                ))}
            </Swiper>
            </View>
            {/* Footer */}
            <View className="py-4 bg-primary w-full items-center">
            <Text className="text-white text-center text-base font-Roboto-Regular">
                © 2024 Find-IT. All rights reserved.
            </Text>
            </View>
        </ScrollView>
      {/* <StatusBar style="auto" /> */}
    </SafeAreaView>
  );
}
