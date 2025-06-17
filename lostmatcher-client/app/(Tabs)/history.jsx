import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Navbar from '../../components/navbar'
import { FontAwesome } from '@expo/vector-icons'
import fetchUserHistoryData from '../../lib/history'
import { useGlobalContext } from '../../context/globalContext'

const History = () => {
    const historyItems = [
        { id: 1, title: 'Wallet', description: 'Brown leather wallet', date: '2024-07-10', image: require('../../assets/images/temp/wallet.webp'), recovered: true, source: 'found' },
        { id: 2, title: 'Phone', description: 'Black ITEL Phone', date: '2023-07-09', image: require('../../assets/images/IMG_20240708_183140_111.jpg'), recovered: false, source: 'uploaded' },
        { id: 3, title: 'Keys', description: 'Set of car keys', date: '2024-01-08', image: require('../../assets/images/temp/keys.png'), recovered: true, source: 'found' },
        { id: 4, title: 'Bag', description: 'Black leather bag', date: '2024-07-07', image: require('../../assets/images/temp/bag.jpg'), recovered: false, source: 'uploaded' },
        { id: 5, title: 'watch', description: 'HiWatch, a smart watch, orange in color', date: '2022-07-12', image: require('../../assets/images/temp/watch2.jpg'), recovered: true, source: 'found' },
        { id: 6, title: 'passport', description: 'Bluewish passpart', date: '2021-07-07', image: require('../../assets/images/temp/passport.jpg'), recovered: false, source: 'uploaded' },
  ];
  const [historyData, setHistoryData] = useState(null);
  const {userData,setMessage,setIsError}=useGlobalContext()
  useEffect(() => {
    const loadData = async() => {
      try {
        const history = await fetchUserHistoryData(userData.id,setMessage,setIsError)
        if (history) {
          setHistoryData(history);
          } 
      } catch (error) {
        console.log(error)
      }
    }
    loadData();
  }, [])
  
      const renderItem = ({ item }) => (
        <View className="mb-6 p-4 border border-gray-300 rounded-lg flex-row items-center">
          <Image
            source={{uri:item.image}}
            className="w-16 h-16 rounded-lg mr-4"
            resizeMode='contain'
          />
          <View className="flex-1">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-lg font-bold">{item.title}</Text>
              <TouchableOpacity>
                <FontAwesome name="trash" size={24} color="purple" />
              </TouchableOpacity>
            </View>
            <Text className="text-gray-700">{item.description}</Text>
            <Text className="text-gray-500 text-sm mt-1">{item.date}</Text>
            <Text className={`mt-1 ${item.recovered ? 'text-green-500' : 'text-red-500'}`}>
              {item.recovered ? 'Recovered' : 'Not Recovered'}
            </Text>
            <Text className="text-gray-500 text-sm mt-1">
              {item.source === 'found' ? 'Found by You' : 'Uploaded by You'}
            </Text>
          </View>
        </View>
      );
  return (
    <SafeAreaView className='flex-1 bg-white'>
        <Navbar/>
        <View className="flex-1 bg-white p-4">
            <Text className="text-2xl font-extrabold text-center mb-4">History</Text>
            <FlatList
                data={historyData}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
            />
        </View>
    </SafeAreaView>
  )
}

export default History