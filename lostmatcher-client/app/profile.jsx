import { View, Text, ScrollView, Image, TouchableOpacity, TextInput } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FontAwesome, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useGlobalContext } from '../context/globalContext';

const Profile = () => {
  const {userData}=useGlobalContext();
  return (
    <SafeAreaView className='flex-1 bg-white'>
      <ScrollView className='flex-1  p-4'>
        <View className="flex-col justify-between gap-3 relative p-4">
          <View className="items-center p-4">
            <View>{/**profile */}
              <Image
                source={require('../assets/images/profile.jpg')}
                className=" w-44 h-44 rounded-full"
              />
              <TouchableOpacity className="absolute right-0 bottom-0 bg-primary p-2 rounded-full">
                <FontAwesome name="camera" size={30} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          <View className="mt-4 flex-col gap-y-4">
            <View className="flex-row gap-x-4 items-start mb-4">{/**Name */}
                <View className='pt-2'>
                  <FontAwesome name="user" size={24} color="gray" />
                </View>
                <View className="flex-1 items-center flex-row justify-between border-gray-300 border-b-2">
                  <View className='flex-1'>
                    <Text className="text-gray-600">Name</Text>
                    <TextInput
                      value={userData?userData.name: "user's name"}
                      className="py-1"
                      editable={false}
                    />
                  </View>
                  <View>
                    <FontAwesome name="pencil" size={16} color="#7454f4" />
                  </View>
                </View>
                
              </View>

              <View className="flex-row gap-x-4 items-start mb-4">{/**Email */}
                <View className='pt-2'>
                  <FontAwesome name="user" size={24} color="gray" />
                </View>
                <View className="flex-1 items-center flex-row justify-between border-gray-300 border-b-2">
                  <View className='flex-1'>
                    <Text className="text-gray-600">Email</Text>
                    <TextInput
                      value={userData?userData.email: "user's email"}
                      className="py-1"
                      editable={false}
                    />
                  </View>
                  <View className='flex-row relative justify-center items-center w-10 h-6'>
                    <FontAwesome name="lock" size={16} color="#7454f4" className=''/>
                    <View className='absolute left-6 top-0.5'>
                      <FontAwesome name="pencil" size={16} color="#7454f4"/>
                    </View>
                  </View>
                </View>
                
              </View>

              <View className="flex-row gap-x-4 items-start mb-4">{/**Phone */}
                <View className='pt-2'>
                  <FontAwesome name="phone" size={24} color="gray" />
                </View>
                <View className="flex-1 items-center flex-row justify-between border-gray-300 border-b-2">
                  <View className='flex-1'>
                    <Text className="text-gray-600">Phone</Text>
                    <TextInput
                      value={userData?(userData.phone || 'not bind yet'): "user's phone number" }
                      className="py-1"
                      editable={false}
                    />
                  </View>
                  <View>
                  
                  {
                      userData && !userData.phone && (
                        <Text className='text-primary'>Bind</Text>
                      )
                  }
                  {
                    userData && userData.phone && (
                      <FontAwesome name='pencil' size={16} color="#7454f4" />
                    )
                  }

                  
                  </View>
                </View>
                
              </View>

              <View className="flex-row gap-x-4 items-start mb-4">{/**Address */}
                <View className='pt-2'>
                  <FontAwesome name="map-marker" size={24} color="gray" />
                </View>
                <View className="flex-1  border-gray-300 border-b-2">
                  <View className='flex-row flex-1 justify-between'>
                    <View>
                      <Text className="text-gray-600">Address</Text>
                    </View>
                    <View>
                      <Text className='text-primary'>Add</Text>
                    </View>
                  </View>
                  <View className='flex-1'>
                    <Text className="py-1 text-gray-400">
                        This a place consisting of town(village), and quarter where we can find you, this will not be shared without your concernment
                    </Text>
                  </View>
                  
                </View>
                 
              </View>
           
          </View>
          <View className=' mb-6'>
              <View>
                <TouchableOpacity className="mt-4 bg-primary p-3 rounded-lg">
                  <Text className="text-white text-center">Change Password</Text>
                </TouchableOpacity>
              </View>
              <View className='flex-row gap-x-4'>
                <TouchableOpacity className='mt-4 bg-primary rounded-lg flex-1'>
                  <Link href='/settings' className='w-full p-3 rounded-lg text-center'>
                        <Text className="text-white text-center">Settings</Text>
                  </Link>
                </TouchableOpacity>
                <TouchableOpacity className='mt-4 bg-primary rounded-lg flex-1'>
                  <Link href='/history' className='w-full p-3 rounded-lg text-center'>
                        <Text className="text-white text-center">History</Text>
                  </Link>
                </TouchableOpacity>
              </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Profile