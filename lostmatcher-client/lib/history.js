import backendBaseURL from '../utils/backendBaseURL.jsx';
import handleApiError from '../utils/handleApiError.js';
import { getItemById } from './items.js';
const fetchUserHistoryData = async (userId, setMessage, setIsError) => {
  try {
    const response = await backendBaseURL.get(`/history/user/${userId}`);
    if (response.data.length === 0) {
      console.log('No history data found');
      return [];
    }
    const historyItemsPromises = response.data.map(async (historyItem) => {
        const itemDetails = await getItemById(historyItem.itemId, setMessage, setIsError);
        if (!itemDetails) {
            console.log('item not fetched')
            throw new Error('item not fetched')
        }
        return {
            id: historyItem._id,
            title: itemDetails.title,
            description: itemDetails.description,
            date: new Date(historyItem.timestamp).toLocaleDateString(),
            image: itemDetails.imageURL,
            recovered: historyItem.recovered,
            source: historyItem.actionType === 'upload' ? 'uploaded' : 'found',
      };
    });
    const historyItems = await Promise.all(historyItemsPromises);
    console.log('User history data gotten successfully:');
    return historyItems;
  } catch (error) {
    setMessage(handleApiError(error, setIsError));
    console.error('Error fetching user history data:', error);
    return [];
  }
};
export default fetchUserHistoryData;