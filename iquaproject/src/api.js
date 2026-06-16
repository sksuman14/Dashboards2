import axios from 'axios';

const API_URL = 'https://tdkand51a7.execute-api.us-east-1.amazonaws.com/default/chloritron_smart_iqua_data_fetch';

export const fetchIquaData = async (deviceId = 101, startDate = '18-10-2023', endDate = '18-10-2024') => {
  try {
    const response = await axios.get(API_URL, {
      params: { deviceId, startDate, endDate }
    });
    return response.data;
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timed out after 30 seconds');
    } else {
      console.error('Error fetching Iqua data:', error.message || error);
    }
    throw error;
  }
};
