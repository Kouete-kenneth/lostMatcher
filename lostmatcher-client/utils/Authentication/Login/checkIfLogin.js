import AsyncStorage from '@react-native-async-storage/async-storage';
import parseToken from '../Logout/DecodeTokenGetExpTime';

const isLoggedIn = async () => {
  try {
    // Check if access token exists in AsyncStorage
    const accessToken = await AsyncStorage.getItem('accessToken');
    if (!accessToken) {
      return false; // Access token doesn't exist, user is not logged in
    }

    // Decode the access token to extract the expiration time
    const decodedToken = parseToken(accessToken);
    if (!decodedToken) {
      return false; // Failed to decode the token, user is not logged in
    }

    // Check if the token is expired
    const currentTime = Date.now() / 1000; // Convert current time to seconds
    if (decodedToken.exp < currentTime) {
      return false; // Token is expired, user is not logged in
    }
    return true; // Access token exists and is not expired, user is logged in
  } catch (error) {
    console.error('Error checking login status:', error);
    return false; // In case of any error, consider the user not logged in
  }
};

export default isLoggedIn;
