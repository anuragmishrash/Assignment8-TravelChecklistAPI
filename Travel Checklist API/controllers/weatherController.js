const axios = require('axios');

// @desc    Get weather data for a city
// @route   GET /api/weather?city=CityName
// @access  Private
exports.getWeather = async (req, res, next) => {
  try {
    const { city } = req.query;
    
    if (!city) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a city name'
      });
    }

    const apiKey = process.env.WEATHER_API_KEY;
    
    // First try to get coordinates using the geocoding API for more accurate results
    const geocodeUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${apiKey}`;
    
    try {
      const geocodeResponse = await axios.get(geocodeUrl);
      
      if (geocodeResponse.data && geocodeResponse.data.length > 0) {
        const { lat, lon, name, country, state } = geocodeResponse.data[0];
        console.log(`Geocode successful: ${name}, ${state || ''}, ${country} at coordinates ${lat},${lon}`);
        
        // Now get weather using coordinates for more accuracy
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
        const weatherResponse = await axios.get(weatherUrl);
        const weatherData = weatherResponse.data;
        
        // Process weather data
        const temperature = weatherData.main.temp;
        const weatherDescription = weatherData.weather[0].description;
        const humidity = weatherData.main.humidity;
        const windSpeed = weatherData.wind.speed;
        const feelsLike = weatherData.main.feels_like;
        const pressure = weatherData.main.pressure;
        const visibility = weatherData.visibility;
        const sunrise = new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString();
        const sunset = new Date(weatherData.sys.sunset * 1000).toLocaleTimeString();
        const countryCode = weatherData.sys.country;
        
        // Suggest packing advice based on temperature
        let packingAdvice;
        if (temperature < 10) {
          packingAdvice = 'Pack warm clothes';
        } else if (temperature > 25) {
          packingAdvice = 'Pack light clothes';
        } else {
          packingAdvice = 'Pack layers for variable weather';
        }

        // Construct a more detailed location name if state is available
        const locationName = state ? `${name}, ${state}` : name;
        
        return res.status(200).json({
          success: true,
          data: {
            city: locationName,
            country: countryCode,
            temperature,
            feelsLike,
            weatherDescription,
            humidity,
            windSpeed,
            pressure,
            visibility: visibility / 1000, // Convert to kilometers
            sunrise,
            sunset,
            packingAdvice
          }
        });
      } else {
        throw new Error('Location not found');
      }
    } catch (geoError) {
      console.error('Geocoding error, falling back to direct weather search:', geoError.message);
      
      // Fallback to direct weather search
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`;
      const response = await axios.get(weatherUrl);
      const weatherData = response.data;
      
      console.log('OpenWeatherMap API response:', weatherData);
      
      // Get temperature and weather conditions
      const temperature = weatherData.main.temp;
      const weatherDescription = weatherData.weather[0].description;
      const humidity = weatherData.main.humidity;
      const windSpeed = weatherData.wind.speed;
      const feelsLike = weatherData.main.feels_like;
      const pressure = weatherData.main.pressure;
      const visibility = weatherData.visibility;
      const sunrise = new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString();
      const sunset = new Date(weatherData.sys.sunset * 1000).toLocaleTimeString();
      const country = weatherData.sys.country;
      
      // Suggest packing advice based on temperature
      let packingAdvice;
      if (temperature < 10) {
        packingAdvice = 'Pack warm clothes';
      } else if (temperature > 25) {
        packingAdvice = 'Pack light clothes';
      } else {
        packingAdvice = 'Pack layers for variable weather';
      }

      res.status(200).json({
        success: true,
        data: {
          city: weatherData.name,
          country,
          temperature,
          feelsLike,
          weatherDescription,
          humidity,
          windSpeed,
          pressure,
          visibility: visibility / 1000, // Convert to kilometers
          sunrise,
          sunset,
          packingAdvice
        }
      });
    }
  } catch (err) {
    console.error('Weather API error:', err);
    
    if (err.response) {
      // Error response from OpenWeatherMap API
      if (err.response.status === 404) {
        return res.status(404).json({
          success: false,
          message: 'City not found. Please check spelling and try again.'
        });
      } else if (err.response.status === 401) {
        return res.status(500).json({
          success: false,
          message: 'Weather API key is invalid or expired'
        });
      } else {
        return res.status(err.response.status).json({
          success: false,
          message: err.response.data.message || 'Error fetching weather data'
        });
      }
    } else if (err.request) {
      // No response received from OpenWeatherMap
      return res.status(503).json({
        success: false,
        message: 'Weather service unavailable. Please try again later.'
      });
    } else {
      next(err);
    }
  }
}; 