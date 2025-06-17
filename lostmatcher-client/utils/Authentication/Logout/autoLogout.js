import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState } from 'react-native';
import checkTokenExpiration from './chechTokenExpiration.js';
import logout from './manualLogout';

const autoLogout = async (setMessage, setIsLoggedIn, setIsError, navigation) => {
  // Retrieve the access token and refresh token from AsyncStorage
  const accessToken = await AsyncStorage.getItem('accessToken');
  const refreshToken = await AsyncStorage.getItem('refreshToken');

  // Return if no access token or refresh token is found
  if (!accessToken || !refreshToken) { 
    setMessage('Not logged in');
    setIsError(true);
    setIsLoggedIn(false);
    await AsyncStorage.removeItem('isLoggedIn');
    return;
  }

  // Check if the access token has expired
  if (checkTokenExpiration(accessToken)) {
    // Access token has expired
    setMessage('Your session has expired. Please log in again.');
    await logout(setMessage, setIsError, navigation);
    setIsLoggedIn(false);
    setIsError(true);
    await AsyncStorage.removeItem('isLoggedIn');
    return;
  }

  // Check if the refresh token has expired
  if (checkTokenExpiration(refreshToken)) {
    // Refresh token has expired
    await logout(setMessage, setIsError, navigation);
    setIsLoggedIn(false);
    await AsyncStorage.removeItem('isLoggedIn');
    return;
  }

  // Function to handle user activity
  const handleActivity = () => {
    // Reset the inactivity timeout
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(async () => {
      setMessage('You have been inactive for too long. Please log in again.');
      await logout(setMessage, setIsError, navigation);
      setIsLoggedIn(false);
      setIsError(true);
      await AsyncStorage.removeItem('isLoggedIn');
    }, 30 * 60 * 1000); // 30 minutes in milliseconds
  };

  // Set up initial inactivity timeout
  let inactivityTimer = setTimeout(async () => {
    setMessage('You have been inactive for too long. Please log in again.');
    await logout(setMessage, setIsError, navigation);
    setIsLoggedIn(false);
    setIsError(true);
    await AsyncStorage.removeItem('isLoggedIn');
  }, 30 * 60 * 1000); // 30 minutes in milliseconds

  // Listen for user activity events
  const subscription = AppState.addEventListener('change', handleActivity);

  // Clean up the event listener on unmount
  return () => {
    clearTimeout(inactivityTimer);
    subscription.remove();
  };
};

export default autoLogout;
