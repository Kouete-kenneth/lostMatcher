import { View, Text, ScrollView, Image } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const About = () => {
  return (
    <SafeAreaView>
      <ScrollView>
        <View className="w-full flex-col items-center p-3">
          <View className="flex-col w-full p-4 items-center">
            <Image
              source={require("../assets/images/Logo_redesigned_Without_background_V2 2.png")}
              resizeMode='contain'
            />
            <Text className="text-gray-500">helping you reconnect with your missing items</Text>
          </View>
          <View className="p-5">
            <Text className="text-center mb-4 text-lg">
              Findit is a mobile cross platform mobile Application
              the help the users <Text className="text-primary font-semibold">search their missing
              objects</Text> in the database of found items either
              by keyword, description or image matching.
            </Text>
            <Text className="text-center mb-4 text-lg">
              If you don't  find your item immediately,
              don't bother as we will always
              notify you when any potential match is found.
            </Text>
            <Text className="text-center text-lg">
              This app rely on it users to <Text className="text-primary font-semibold">upload any found item into the platform.</Text> Thanks  for helping 
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default About