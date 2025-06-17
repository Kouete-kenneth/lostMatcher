import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Tabs,Redirect } from 'expo-router'
import { FontAwesome } from '@expo/vector-icons';
const TabsLayout = () => {
  
  return (
    <>
        <Tabs 
          screenOptions={{
            tabBarStyle:{
              backgroundColor:'#7454f4',
              height: 50,
            },
            tabBarActiveTintColor:'#FFFF99',
            tabBarActiveBackgroundColor:'#5b3dcc',
            tabBarInactiveTintColor:'#FFFFFF'
          }}
        
        >
            <Tabs.Screen
                name='home'
                options={{
                    title:'Home',
                    headerShown:false,
                    tabBarIcon:({focused})=>(
                      <Text>
                          <FontAwesome name='home' size={25} color={`${focused?'#FFFF99':'#FFFFFF'}`}/>
                      </Text>
                    )
                }}
            />
            <Tabs.Screen
                name='faqs'
                options={{
                    title:'Help',
                    headerShown:false,
                    tabBarIcon:({focused})=>(
                      <Text>
                          <FontAwesome name='question-circle-o' size={25} color={`${focused?'#FFFF99':'#FFFFFF'}`}/>
                      </Text>
                    )
                }}
            />
            <Tabs.Screen
                name='Feedback'
                options={{
                    title:'FeedBack',
                    headerShown:false,
                    tabBarIcon:({focused})=>(
                      <Text>
                          <FontAwesome name='comment-o' size={25} color={`${focused?'#FFFF99':'#FFFFFF'}`}/>
                      </Text>
                    )
                }}
            />
            <Tabs.Screen
                name='history'
                options={{
                    title:'History',
                    headerShown:false,
                    tabBarIcon:({focused})=>(
                      <Text>
                          <FontAwesome name='history' size={25} color={`${focused?'#FFFF99':'#FFFFFF'}`}/>
                      </Text>
                    )
                }}
            />
            
        </Tabs>
    </>
  )
}

export default TabsLayout