import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { NativeWindStyleSheet } from 'nativewind';
import { useNavigation } from '@react-navigation/native';

const Onboarding = () => {
  const navigation = useNavigation();

  const handleContinue = () => {
    // Navigate to the next screen
    navigation.navigate('login'); // Replace 'NextScreen' with your target screen
  };

  const openLink = () => {
    Linking.openURL('https://xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
  };

  return (
    <ScrollView className="flex-1 bg-white p-4 w-full">
      <View className='items-center'>
      <Text className="text-2xl text-primary text-center font-extrabold mt-5">How to navigate FindIt</Text>
      <Text className="text-center mb-8 text-xs text-zinc-400">step by step guide to help you navigate the app</Text>

      <View className="flex flex-col items-center space-y-4 mb-10 w-full">
        <View className="flex-row justify-between gap-2 w-full mb-4 ">
            <View className='flex-row flex-1 space-x-2 items-center w-2/5 w- bg-bgsecondary rounded-3xl'>
                <View className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <Text className="text-primary font-bold">1</Text>
                </View>
                <Text className='text-xs'>Sign Up</Text>
          </View>
          <View className='flex-row flex-1 space-x-2 items-center w-2/5 w- bg-bgsecondary rounded-3xl'>
            <View className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <Text className="text-primary font-bold">2</Text>
            </View>
            <Text className='text-xs'>Sign in</Text>
          </View>
        </View>
       
        <Text className="font-bold text-center">Do you want to search a missing item?</Text>
        <View className="flex-row gap-2 justify-between w-full  ">
            <View className='flex-row flex-1 space-x-2 items-center w-2/5 w- bg-bgsecondary rounded-3xl'>
                <View className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <Text className="text-primary font-bold">3</Text>
                </View>
                <Text className='text-xs'>select missing Item</Text>
          </View>
          <View className='flex-row flex-1 space-x-2 items-center w-2/5  bg-bgsecondary rounded-3xl'>
            <View className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <Text className="text-primary font-bold">4</Text>
            </View>
            <Text className='text-xs'>Fill Item Meta data</Text>
          </View>
        </View>
        <View className="flex-row gap-2 justify-between w-full ">
            <View className='flex-row flex-1 space-x-2 items-center w-2/5 w- bg-bgsecondary rounded-3xl'>
                <View className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <Text className="text-primary font-bold">5</Text>
                </View>
                <Text className='text-xs'>Select Max results</Text>
          </View>
          <View className='flex-row flex-1 space-x-2 items-center w-2/5 w- bg-bgsecondary rounded-3xl'>
            <View className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <Text className="text-primary font-bold">6</Text>
            </View>
            <Text className='text-xs'>Click Search</Text>
          </View>
        </View>
        <View className="flex-row gap-2 justify-between w-full mb-4 ">
            <View className='flex-row flex-1 space-x-2 items-center w-2/5 bg-bgsecondary rounded-3xl'>
                <View className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <Text className="text-primary font-bold">7</Text>
                </View>
                <Text className='text-xs'>Select item</Text>
          </View>
          <View className='flex-row flex-1 space-x-2 items-center w-2/5 w- bg-bgsecondary rounded-3xl'>
            <View className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <Text className="text-primary font-bold">8</Text>
            </View>
            <Text className='text-xs'>wait admin Approval</Text>
          </View>
        </View>
        <Text className="font-bold text-center">Do you want to upload a found item?</Text>
        <View className="flex-row gap-2 justify-between w-full mb-4 ">
            <View className='flex-row flex-1 space-x-1 items-center w-2/5 bg-bgsecondary rounded-3xl'>
                <View className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <Text className="text-primary font-bold">9</Text>
                </View>
                <Text className='text-xs'>Select item or capture</Text>
          </View>
          <View className='flex-row flex-1 space-x-2 items-center w-2/5 w- bg-bgsecondary rounded-3xl'>
            <View className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <Text className="text-primary font-bold">10</Text>
            </View>
            <Text className='text-xs'>Fill item's metadata</Text>
          </View>
        </View>
        <View className="flex-row gap-2 justify-between w-full mb-4 ">
            <View className='flex-row flex-1 space-x-2 items-center w-2/5 bg-bgsecondary rounded-3xl'>
                <View className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <Text className="text-primary font-bold">7</Text>
                </View>
                <Text className='text-xs'>Click upload</Text>
          </View>
          <View className='flex-row flex-1 space-x-2 items-center w-2/5 w- bg-bgsecondary rounded-3xl'>
            <View className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <Text className="text-primary font-bold">8</Text>
            </View>
            <Text className='text-xs'>wait for owner</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity onPress={openLink} className="mt-4 mb-10">
        <Text className="text-blue-500 underline">view flow Chart</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleContinue} className="bg-primary py-3 px-8 rounded-lg w-full mb-10">
        <Text className="text-white font-bold text-center">CONTINUE</Text>
      </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Onboarding;

NativeWindStyleSheet.create({
  scrollView: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 40,
  },
  description: {
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  sectionTitle: {
    marginTop: 32,
    marginBottom: 16,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepNumber: {
    width: 32,
    height: 32,
    backgroundColor: 'lightgray',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: {
    color: 'purple',
    fontWeight: 'bold',
  },
  stepText: {
    marginLeft: 8,
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  button: {
    backgroundColor: 'purple',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 9999,
    marginBottom: 40,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
