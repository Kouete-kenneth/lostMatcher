import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import backendBaseURL from '../../backendBaseURL';
import handleApiError from '../../handleApiError';

// Function to log out the user by clearing tokens from AsyncStorage and handling messages
const logout = async (setMessage, setIsError) => {
  try {
    // Get refreshToken from AsyncStorage
    const refreshToken = await AsyncStorage.getItem('refreshToken');

    if (!refreshToken) {
      setMessage("refresh Token not found")
      console.log("refresh Token not found")
      return null
    }
    console.log('REFRESHTOKEN:', refreshToken);
    // Make a request to the backend to logout using the refreshToken
    await backendBaseURL.post('/auth/logout', { refreshToken });
    
    // Remove tokens from AsyncStorage
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('refreshToken');
    
    // Set success message
    setMessage('Logout successfully');
    console.log('Logout successfully');
    setIsError(false);
  
  } catch (error) {
    // Set error message
    setMessage('Unable to logout, please try again');
    setIsError(true);
    console.error('Logout failed:', handleApiError(error,setIsError));
  }
};

export default logout;
