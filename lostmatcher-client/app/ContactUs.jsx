import { View, Text, TouchableOpacity, ScrollView, Image, TextInput } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link } from 'expo-router'
import { FontAwesome } from '@expo/vector-icons'
import Menu from '../components/menu'
import backendBaseURL from '../utils/backendBaseURL'
import Navbar from '../components/navbar'

const ContactUs = () => {
    const [subject, setsubject] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async () => {
      if (!email || !subject || !message) {
          alert("Error", "All fields are required.");
          return;
      }

      try {
          const response = await backendBaseURL.post('/emails', {
              from: email,
              subject: subject,
              message: message
          });

          if (response.status === 200 ||response.status === 201) {
              alert("Success", "Email sent successfully!");
              setEmail('');
              setsubject('');
              setMessage('');
          } else {
              Alert.alert("Error", "Failed to send email.");
          }
      } catch (error) {
        console.log(error)
          alert("Error", "An error occurred while sending the email.");
      }
  };
  return (
      <SafeAreaView className="flex-1 bg-white">
        <ScrollView className="flex-1 w-full">
        <View className="flex-1 justify-center items-center mb-4 mt-2">
          <Image
            source={ require('../assets/images/contactus.jpg') }
            style={{ width:'100%', height: 200,objectFit:'cover' }}
          />
        </View>
        <View className='w-full p-4 flex-col items-center justify-center'>
          <View className='w-full pr-6 mt-4 bg-bgsecondary p-6 rounded-md'>
            <View className=' space-x-2 mb-4 flex-row'>
               <FontAwesome name='phone' size={20} color='#7454F4'/>
               <Text className=''>+237 654130795</Text>
            </View>
            <View className=' space-x-2 mb-4 flex-row'>
               <FontAwesome name='envelope' size={20} color='#7454F4'/>
               <Text className=''>kouete678@gmail.com</Text>
            </View>
            <View className=' space-x-2 mb-4 flex-row'>
               <FontAwesome name='facebook-square' size={20} color='#7454F4'/>
               <Text className=''>http://facebook.com</Text>
            </View>
          </View>
          <View className='w-full p-4 flex-col items-center justify-center'>
          <View className="w-full mb-4">
                <View className="w-full mb-4">
                    <View className="flex-row border-b-2 border-gray-300 py-2">
                        <TextInput className="flex-1"  placeholder="Enter your Email" value={email} onChangeText={(text) => setEmail(text)}/>
                        <FontAwesome name="envelope" size={20} color="gray" />
                    </View>
                </View>
                <View className="w-full mb-4">
                    <View className="flex-row border-b-2 border-gray-300 py-2">
                        <TextInput className="flex-1"  placeholder="Enter the subject" value={subject} onChangeText={(text) => setsubject(text)}/>
                        <FontAwesome name="user" size={20} color="gray" />
                    </View>
                </View>
                <View className="w-full mb-4">
                    <View className="flex-row items-center border-b-2 border-gray-300 py-2">
                        <TextInput className="flex-1" placeholder="type the meassage here" value={message} onChangeText={(text) => setMessage(text)}/>
                        <FontAwesome name="envelope" size={20} color="gray" />
                    </View>
                </View>
            </View>
            <TouchableOpacity className="w-full bg-primary py-1 rounded-md font-mRoboto mb-4" onPress={handleSubmit}>
              <Text className="text-center text-white text-lg ">Send Mail</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default ContactUs