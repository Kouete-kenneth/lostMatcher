import { View, Text, TouchableOpacity, TextInput } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Navbar from '../../components/navbar'
import { useNavigation } from 'expo-router'
import { FontAwesome } from '@expo/vector-icons'

const Feedback = () => {
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(0);
  const navigation = useNavigation();

  const submitFeedback = () => {
    // Submit feedback logic here
    console.log({ content, rating });
    // Navigate back or show success message
    navigation.goBack();
  };
  return (
    <SafeAreaView className="flex-1 bg-white">
      <Navbar/>
      <View className="flex-1 flex-col items-center p-4 bg-white">
        <View className='w-72'>
          <Text className="text-xl text-center font-bold mb-4">Submit Your Feedback</Text>
          <Text className="text-xs text-center font-rRoboto text-gray-400 mb-8">This Feaadback helps us Ameliorate the Qualily of services we provide to you!! Thank for Submitting</Text>
        </View>
        <View className='w-full flex-row border p-3 mb-4 border-gray-200 rounded-md'>
          <Text className="text-lg mb-2">Rating us:    </Text>
          <View className="flex-row mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setRating(star)}>
                <FontAwesome
                  name={star <= rating ? 'star' : 'star-o'}
                  size={24}
                  color="gold"
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View className='w-full flex-1 flex-col justify-center items-center border p-3 mb-4 border-gray-200 rounded-md'>
          {/* <Text className="text-lg mb-2">Review</Text> */}
          <TextInput
            value={content}
            onChangeText={setContent}
            placeholder="Write your review here"
            className="border border-gray-300 p-2 rounded-lg mb-4 w-full"
            multiline
            numberOfLines={4}
          />
        </View>
        
        <TouchableOpacity
          onPress={submitFeedback}
          className="bg-primary p-4 rounded-lg w-full"
        >
          <Text className="text-white text-center font-bold">Submit Feedback</Text>
        </TouchableOpacity>
    </View>
    </SafeAreaView>
  )
}

export default Feedback