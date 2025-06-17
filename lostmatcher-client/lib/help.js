import backendBaseURL from '../utils/backendBaseURL.jsx';
import handleApiError from '../utils/handleApiError.js';
const fetchFAQData =async (setMessage,setIsError) => {
    try {
    const response = await backendBaseURL.get(`/faqs/fetchAll`);
    console.log('faqs data gotten successfully');
    return response.data; // Ensure we are returning the actual data
  } catch (error) {
        setMessage(handleApiError(error, setIsError));
        console.log(handleApiError(error, setIsError));
        return null;
    }
}
export default fetchFAQData;