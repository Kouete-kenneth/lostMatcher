
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import backendBaseURL from "../utils/backendBaseURL.jsx";
import handleApiError from "../utils/handleApiError.js";

const Register = () => {

  const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword,setConfirmPassword]=useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError]=useState(false);
	const [registerResponse, setRegisterResponse] = useState(null);
    const [emailResponse, setEmailResponse] = useState(null);
    const [loginButtonClicked,setLoginButtonClicked]=useState(false)
    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoginButtonClicked(true);
        // Reset message state
        setMessage('');
        try {
            // Make API call to register user
            const response = await backendBaseURL.post('/auth/register', { name, email, password });
            setRegisterResponse(response.data);
        } catch (error) {
            console.log(error);
            setMessage(handleApiError(error,setIsError))
        }
    };

    useEffect(() => {
        if (registerResponse) {
            // Extract user data and tokens from registerResponse
            const { user, tokens } = registerResponse;

            // Send verification email with access token in the header
            backendBaseURL.post('/auth/send-verification-email', {}, {
                headers: {
                    'Authorization': `Bearer ${tokens.access.token}`
                }
            })
            .then(response => {
                setEmailResponse(response.data);
                setMessage('Verification email has been sent');
                setIsError(false);
                setName("");
                setEmail("");
                setPassword("");
            })
            .catch(error => {
                setMessage(handleApiError(error,setIsError))
            });
        }
    }, [registerResponse]); // Trigger effect when registerResponse changes

  return (
      <ScrollView className="min-h-full">
          <View className="flex-col justify-center items-center px-8 gap-1">
            <View className="w-full flex-col items-center mb-2 pt-3 gap-1">
              <View className="p-1 pb-0 flex-row justify-center items-center">
                <Image source={require('../assets/images/Logo_redesigned.png')} style={{objectFit:'contain',width:60,height:60}}/>
              </View>
              <Text className="text-xsm mb-4 text-center font-thin" style={{ flexWrap: 'wrap', width: '60%' }}>Fill in your information  to create an account</Text>
            </View>
            <View className="w-full mb-4">
                <View className="w-full mb-4">
                    <View className="flex-row border-b-2 border-gray-300 py-2">
                        <TextInput className="flex-1"  placeholder="Enter your Name" onChangeText={(text) => setName(text)}/>
                        <FontAwesome name="user" size={20} color="gray" />
                    </View>
                </View>
                <View className="w-full mb-4">
                    <View className="flex-row border-b-2 border-gray-300 py-2">
                        <TextInput className="flex-1"  placeholder="Enter your Email" onChangeText={(text) => setEmail(text)}/>
                        <FontAwesome name="envelope" size={20} color="gray" />
                    </View>
                </View>
                <View className="w-full mb-4">
                    <View className="flex-row items-center border-b-2 border-gray-300 py-2">
                        <TextInput className="flex-1" placeholder="Password" secureTextEntry onChangeText={(text) => setPassword(text)}/>
                        <FontAwesome name="eye-slash" size={20} color="gray" />
                    </View>
                </View>
                <View className="w-full mb-4">
                    <View className="flex-row items-center border-b-2 border-gray-300 py-2">
                    <TextInput className="flex-1" placeholder=" Confirm Password" secureTextEntry onChangeText={(text) => setConfirmPassword(text)}/>
                    <FontAwesome name="eye-slash" size={20} color="gray" /> 
                    </View>
                </View>
                {(message && !isError) && (<View className="w-full"><Text className='text-green-600 text-lg font-mRoboto'>{message}</Text></View>)}
              {(message && isError) && (<View className="w-full"><Text className='text-amber-700 text-lg font-mRoboto'>{message}</Text></View>)}
            </View>
            <TouchableOpacity className="w-full bg-primary py-1 rounded-md font-mRoboto mb-4" onPress={handleSubmit}>
              <Text className="text-center text-white text-lg ">Sign Up</Text>
            </TouchableOpacity>
            <Text className='font-rRougeScript text-2xl'>Or</Text>
            <Text className="mb-4">sign up with</Text>
            <View className="flex-row justify-between w-full mb-6 px-1">
              <TouchableOpacity className="items-center bg-slate-300 p-2 rounded-full">
                <FontAwesome name="apple" size={20} color="white"/>
              </TouchableOpacity>
              <TouchableOpacity className="items-center bg-slate-300 p-2 rounded-full">
                <FontAwesome name="google" size={20} color="purple" />
              </TouchableOpacity>
              <TouchableOpacity className="items-center bg-slate-300 p-2 rounded-full">
                <FontAwesome name="facebook" size={20} color="blue" /> 
              </TouchableOpacity>
            </View>
            <TouchableOpacity className='w-full'>
              <Text className="text-text">already have an account?&nbsp;&nbsp; 
                <Link href="/login" className=' text-primary underline'>Sign In</Link>
              </Text>
            </TouchableOpacity>
          </View>
      </ScrollView>
  );
};

export default Register;
