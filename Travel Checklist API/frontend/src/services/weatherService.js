import api from './api';
 
// Get weather data for a city
export const getWeather = async (city) => {
  try {
    console.log(`Fetching weather for city: ${city}`);
    const response = await api.get(`/weather?city=${encodeURIComponent(city)}`);
    
    console.log('Weather API response:', response.data);
    
    // Check if the response has the expected structure
    if (!response.data) {
      throw new Error('No data received from weather API');
    }
    
    // Extract data from the correct path in the response
    if (response.data && response.data.success && response.data.data) {
      return {
        data: response.data.data
      };
    } else {
      // Return the response as is for the component to handle
      return response;
    }
  } catch (error) {
    console.error('Weather API error:', error);
    // Rethrow to let the component handle it
    throw error;
  }
}; 