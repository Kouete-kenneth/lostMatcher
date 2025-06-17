import AsyncStorage from '@react-native-async-storage/async-storage';
import backendBaseURL from '../../backendBaseURL';

const login = async (formData, setMessage, handleApiError, setIsError) => {
  
  try {
    const response = await backendBaseURL.post('/auth/login', formData);
    const { tokens, user } = response.data;

    // Check if the user's email is verified
    if (!user.isEmailVerified) {
      const errorMessage = 'Email is not verified. Please verify your email before logging in. You will receive a verification email shortly.';
      setMessage(errorMessage);
      setIsError(true);

      // Send verification email to the user
      await backendBaseURL.post('/auth/send-verification-email', {}, {
        headers: {
          'Authorization': `Bearer ${tokens.access.token}`
        }
      }).catch(error => {
        setMessage(handleApiError(error, setIsError));
        console.error('Error sending verification email:', error);
      });

      return Promise.reject('Email is not verified');
    }

    // Store tokens in AsyncStorage
    await AsyncStorage.setItem('accessToken', tokens.access.token);
    await AsyncStorage.setItem('refreshToken', tokens.refresh.token);

    setMessage('Login successfully');
    setIsError(false);

    return user;
  } catch (error) {
    setMessage(handleApiError(error, setIsError));
    setIsError(true);
    console.error('Login failed:', error);
    return Promise.reject('Login failed');
  }
};

export default login;
