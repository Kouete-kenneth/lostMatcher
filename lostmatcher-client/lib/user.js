import { Alert } from 'react-native';
import checkIfLogin from '../utils/Authentication/Login/checkIfLogin.js'
import backendBaseURL from '../utils/backendBaseURL.jsx';
import getLoggedInUserId from '../utils/getUserIdFromAccessToken.js';
import handleApiError from '../utils/handleApiError.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
const fetchUserData = async (setMessage, setIsError) => {
  const isLoggedIn = await checkIfLogin();
  if (!isLoggedIn) {
    console.log('user is not login');
    return null;
  }

  const accessToken = await AsyncStorage.getItem('accessToken');
  if (!accessToken) {
    setMessage('This action require the user to be logged in');
    console.log('This action require the user to be logged in');
    setIsError(true);
    return null;
  }

  const userId = await getLoggedInUserId(setMessage, setIsError);
  if (!userId) {
    setMessage('unable to identify the user');
    console.log('unable to identify the user');
    setIsError(true);
    return null;
  }

  console.log(userId);
  console.log(accessToken);
  try {
    const response = await backendBaseURL.get(`/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log('user data gotten successfully');
    return response.data; // Ensure we are returning the actual data
  } catch (error) {
    setMessage(handleApiError(error, setIsError));
    return null;
  }
};


    export default fetchUserData;