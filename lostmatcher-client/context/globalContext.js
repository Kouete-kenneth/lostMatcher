import {createContext, useContext,useState, useEffect} from "react";
import fetchUserData from "../lib/user.js";
import handleApiError from '../utils/handleApiError.js';
import { useNavigation } from "expo-router";

const GlobalContext=createContext();

const GlobalProvider=({children})=>{
    const [userData, setUserData] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [message,setMessage]=useState('');
    const [isError, setIsError] = useState(false)
    const navigation = useNavigation();
useEffect(() => {
  const loadUserData = async () => {
    const userdata = await fetchUserData(setMessage, setIsError);
    if (userdata) {
      setIsLoggedIn(true);
      setUserData(userdata);
        setIsLoading(false);
         navigation.navigate('(Tabs)',{
            screen:'home'
        })
        
    } else {
      setIsLoggedIn(false);
        setUserData(null);
        setIsLoading(false);
      console.log('ooooops');
    }
    
  };

  loadUserData().catch((error) => {
    setMessage(handleApiError(error, setIsError));
    setIsLoading(false);
  });
}, []);
    return (
        <GlobalContext.Provider
            value={{
                userData,
                setUserData,
                isLoading,
                setIsLoading,
                setIsLoggedIn,
                isLoggedIn,
                message,
                setMessage,
                isError,
                setIsError
            }}
        >
            {children}
        </GlobalContext.Provider>
    )
}

export const useGlobalContext=()=>useContext(GlobalContext);

export default GlobalProvider;