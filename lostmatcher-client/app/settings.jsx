import { View, Text, ScrollView, Switch, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';

const Settings = () => {
  const [showPushNotifications, setShowPushNotifications] = useState(true);
  const [showOverOtherApps, setShowOverOtherApps] = useState(true);
  const [potentialMatchNotification, setPotentialMatchNotification] = useState(true);
  const [generalNotification, setGeneralNotification] = useState(true);
  const [updateReminder, setUpdateReminder] = useState(true);
  const [showOnBoarding, setShowOnBoarding] = useState(true);
  const [autoLogout, setAutoLogout] = useState(true);
  const [confirmBeforeUploading, setConfirmBeforeUploading] = useState(true);
  const [theme, setTheme] = useState('System default');

  const [isNotificationExpanded, setIsNotificationExpanded] = useState(false);

  const toggleSwitch = (setter) => {
    setter(previousState => !previousState);
  };

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <ScrollView className='flex-1 p-4'>
        <View className="flex-col gap-3 p-4">
          
          <TouchableOpacity className="mb-4">
            <Text className="text-lg font-bold text-gray-800">Edit profile</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="mb-4">
            <Text className="text-lg font-bold text-gray-800">Change password</Text>
          </TouchableOpacity>

          <View className="mb-4">
            <TouchableOpacity 
              className="flex-row justify-between items-center mb-2"
              onPress={() => setIsNotificationExpanded(!isNotificationExpanded)}
            >
              <Text className="text-lg font-bold text-gray-800">Notification</Text>
              <FontAwesome 
                name={isNotificationExpanded ? "chevron-up" : "chevron-down"} 
                size={16} 
                color="gray" 
              />
            </TouchableOpacity>
            {isNotificationExpanded && (
              <View className='bg-gray-100 p-2'>
                <View className="flex-row justify-between items-center mb-4">
                  <Text className="text-gray-600">Show push notification</Text>
                  <Switch
                    value={showPushNotifications}
                    onValueChange={() => toggleSwitch(setShowPushNotifications)}
                    trackColor={{ false: "#767577", true: "#7454f4" }}
                    thumbColor={showPushNotifications ? "#f4f3f4" : "#f4f3f4"}
                  />
                </View>
                <View className="flex-row justify-between items-center mb-4">
                  <Text className="text-gray-600">Show over other apps</Text>
                  <Switch
                    value={showOverOtherApps}
                    onValueChange={() => toggleSwitch(setShowOverOtherApps)}
                    trackColor={{ false: "#767577", true: "#7454f4" }}
                    thumbColor={showOverOtherApps ? "#f4f3f4" : "#f4f3f4"}
                  />
                </View>
                <View className="flex-row justify-between items-center mb-4">
                  <Text className="text-gray-600">Potential match notification</Text>
                  <Switch
                    value={potentialMatchNotification}
                    onValueChange={() => toggleSwitch(setPotentialMatchNotification)}
                    trackColor={{ false: "#767577", true: "#7454f4" }}
                    thumbColor={potentialMatchNotification ? "#f4f3f4" : "#f4f3f4"}
                  />
                </View>
                <View className="flex-row justify-between items-center mb-4">
                  <Text className="text-gray-600">General Notification</Text>
                  <Switch
                    value={generalNotification}
                    onValueChange={() => toggleSwitch(setGeneralNotification)}
                    trackColor={{ false: "#767577", true: "#7454f4" }}
                    thumbColor={generalNotification ? "#f4f3f4" : "#f4f3f4"}
                  />
                </View>
              </View>
            )}
          </View>

          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold text-gray-800">Update reminder</Text>
            <Switch
              value={updateReminder}
              onValueChange={() => toggleSwitch(setUpdateReminder)}
              trackColor={{ false: "#767577", true: "#7454f4" }}
              thumbColor={updateReminder ? "#f4f3f4" : "#f4f3f4"}
            />
          </View>
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold text-gray-800">Show onBoarding</Text>
            <Switch
              value={showOnBoarding}
              onValueChange={() => toggleSwitch(setShowOnBoarding)}
              trackColor={{ false: "#767577", true: "#7454f4" }}
              thumbColor={showOnBoarding ? "#f4f3f4" : "#f4f3f4"}
            />
          </View>

          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold text-gray-800">Auto logout when inactive</Text>
            <Switch
              value={autoLogout}
              onValueChange={() => toggleSwitch(setAutoLogout)}
              trackColor={{ false: "#767577", true: "#7454f4" }}
              thumbColor={autoLogout ? "#f4f3f4" : "#f4f3f4"}
            />
          </View>

          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold text-gray-800">Confirm before uploading</Text>
            <Switch
              value={confirmBeforeUploading}
              onValueChange={() => toggleSwitch(setConfirmBeforeUploading)}
              trackColor={{ false: "#767577", true: "#7454f4" }}
              thumbColor={confirmBeforeUploading ? "#f4f3f4" : "#f4f3f4"}
            />
          </View>

          <View className="mb-4">
            <Text className="text-lg font-bold text-gray-800 mb-2">Theme</Text>
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-gray-600">System default</Text>
              <Switch
                value={theme === 'System default'}
                onValueChange={() => setTheme('System default')}
                trackColor={{ false: "#767577", true: "#7454f4" }}
                thumbColor={theme === 'System default' ? "#f4f3f4" : "#f4f3f4"}
              />
            </View>
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-gray-600">Dark</Text>
              <Switch
                value={theme === 'Dark'}
                onValueChange={() => setTheme('Dark')}
                trackColor={{ false: "#767577", true: "#7454f4" }}
                thumbColor={theme === 'Dark' ? "#f4f3f4" : "#f4f3f4"}
              />
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-gray-600">Light</Text>
              <Switch
                value={theme === 'Light'}
                onValueChange={() => setTheme('Light')}
                trackColor={{ false: "#767577", true: "#7454f4" }}
                thumbColor={theme === 'Light' ? "#f4f3f4" : "#f4f3f4"}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Settings;
