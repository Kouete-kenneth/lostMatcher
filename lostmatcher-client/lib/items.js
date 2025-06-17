import backendBaseURL from "../utils/backendBaseURL";
import handleApiError from "../utils/handleApiError";
/**
 * Creates a new item via API.
 * @param {Object} newItem - The item data to be created.
 * @returns {Promise<Object>} - The created item data.
 */

const createNewItem = async (newItem, setMessage, setIsError) => {
    try {
        const response = await backendBaseURL.post('/items', newItem);
        
        try {
            const data = response.data;
            if (!data) {
                throw new Error('No data returned from API');
            }
            console.log('Item saved successfully!')
            setMessage('Item saved successfully!');
            setIsError(false);
            return data;
        } catch (responseDataError) {
            console.error('Error processing response data:', responseDataError.message);
            setMessage('Error processing response data');
            setIsError(true);
        }

    } catch (apiError) {
            setMessage(handleApiError(apiError,setIsError));
    }
};

const getItemById = async(itemId,setMessage,setIsError) => {
    try {
        const response = await backendBaseURL.get(`/items/${itemId}`);
        const data = response.data;
        if (!data) {    
            setMessage('No data returned from API')
            return null;
        }

        return data;
        
    } catch (error) {
        setMessage(handleApiError(error,setIsError))
        console.log(handleApiError(error, setIsError))
        return null;
    }
}

export {
    createNewItem,
    getItemById
};
