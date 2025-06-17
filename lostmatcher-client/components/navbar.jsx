import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'
import Menu from './menu'
import { FontAwesome } from '@expo/vector-icons'

const Navbar = () => {
  return (
   <>
    {/* Navigation Bar */}
      <View className="flex-row z-50 bg-slate-600 justify-between items-center py-0 pl-1 pr-5 border-b border-gray-200" style={{ height: 60, width: '100%', backgroundColor: '#ffffff' }}>
            {/* Logo */}
            <TouchableOpacity className="flex items-center justify-center p-2 rounded-full">
                <Image
                    source={require('../assets/images/Logo_redesigned.png')}
                    className="rounded-full"
                    resizeMethod='contain'
                    style={{resizeMode: 'contain',width:40,height:40 }}
                />
            </TouchableOpacity>

            {/* Menu Icons */}
            <View className="flex-row gap-x-4 items-center justify-center p-1 rounded-lg">
                <TouchableOpacity>
                  <Link href='/notification'><FontAwesome name='bell-o' size={20} /></Link>
                </TouchableOpacity>
                <TouchableOpacity className='bg-black rounded-full'>
                  <Link href="/profile" className='rounded-full bg-slate-400'>
                    <View className='rounded-full'>
                      <Image 
                        className="rounded-full" 
                        source={require('../assets/images/profile.jpg')} 
                        resizeMethod='contain'
                        style={{ width: 25, height: 25 }} />
                    </View>
                  </Link>
                </TouchableOpacity>
                <TouchableOpacity className='z-50'>
                    <Link href='/'>
                        <Menu/>
                    </Link>
                </TouchableOpacity>
            </View>
      </View>
   </>
  )
}

export default Navbar