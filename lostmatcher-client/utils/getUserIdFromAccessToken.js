import AsyncStorage from '@react-native-async-storage/async-storage';
import parseToken from './Authentication/Logout/DecodeTokenGetExpTime.js';

const getLoggedInUserId=async(setMessage,setIsError)=>{
    const accessToken = await AsyncStorage.getItem('accessToken');
    if (!accessToken) {
      setMessage('This action require the user to be logged in');
      console.log('This action require the user to be logged in');
      setIsError(true)
      return
    }
    // Decode the access token to extract the expiration time
    const decodedToken = parseToken(accessToken);
    if (!decodedToken) {
      setMessage('Error while trying to identify the current user')
      console.log('Error while trying to identify the current user')
      setIsError(true)
      return 
    }
    setMessage('user identified successfully');
    setIsError(false);
    console.log(decodedToken.sub)
    return decodedToken.sub;
}
export default getLoggedInUserId;