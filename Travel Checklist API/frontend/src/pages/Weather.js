import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner, Badge } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { getWeather } from '../services/weatherService';

const Weather = () => {
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract city from URL parameters on component mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cityParam = params.get('city');
    
    if (cityParam) {
      setCity(cityParam);
      fetchWeatherData(cityParam);
    }
  }, [location.search]);

  const fetchWeatherData = async (cityName) => {
    if (!cityName.trim()) return;
    
    try {
      setLoading(true);
      setError('');
      console.log(`Fetching weather for: ${cityName}`);
      
      const response = await getWeather(cityName);
      console.log('Weather API response:', response);
      
      // Extract data from the correct path in the response
      if (response && response.data) {
        setWeatherData(response.data);
        // Update URL with the city parameter
        navigate(`/weather?city=${encodeURIComponent(cityName)}`, { replace: true });
      } else {
        throw new Error('Invalid weather data format');
      }
    } catch (err) {
      console.error('Weather error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch weather data');
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    fetchWeatherData(city);
  };

  // Rest of the component remains the same
  const getWeatherIcon = (temp) => {
    if (temp < 10) return 'bi-thermometer-snow';
    if (temp > 25) return 'bi-thermometer-sun';
    return 'bi-thermometer-half';
  };

  const getWeatherBackground = (temp) => {
    if (temp < 10) return 'bg-info text-white';
    if (temp > 25) return 'bg-warning text-dark';
    return 'bg-light';
  };

  const renderPackingSuggestions = (temp) => {
    if (temp < 10) {
      return (
        <div>
          <h5 className="mt-4">Cold Weather Packing List</h5>
          <ul className="list-group mt-3">
            <li className="list-group-item"><i className="bi bi-check-circle-fill text-success me-2"></i>Heavy coat or jacket</li>
            <li className="list-group-item"><i className="bi bi-check-circle-fill text-success me-2"></i>Thermal underwear</li>
            <li className="list-group-item"><i className="bi bi-check-circle-fill text-success me-2"></i>Gloves and scarf</li>
            <li className="list-group-item"><i className="bi bi-check-circle-fill text-success me-2"></i>Winter hat</li>
            <li className="list-group-item"><i className="bi bi-check-circle-fill text-success me-2"></i>Warm socks</li>
            <li className="list-group-item"><i className="bi bi-check-circle-fill text-success me-2"></i>Waterproof boots</li>
          </ul>
        </div>
      );
    } else if (temp > 25) {
      return (
        <div>
          <h5 className="mt-4">Hot Weather Packing List</h5>
          <ul className="list-group mt-3">
            <li className="list-group-item"><i className="bi bi-check-circle-fill text-success me-2"></i>Light, breathable clothing</li>
            <li className="list-group-item"><i className="bi bi-check-circle-fill text-success me-2"></i>Sunscreen (SPF 30+)</li>
            <li className="list-group-item"><i className="bi bi-check-circle-fill text-success me-2"></i>Sunglasses</li>
            <li className="list-group-item"><i className="bi bi-check-circle-fill text-success me-2"></i>Hat for sun protection</li>
            <li className="list-group-item"><i className="bi bi-check-circle-fill text-success me-2"></i>Insect repellent</li>
            <li className="list-group-item"><i className="bi bi-check-circle-fill text-success me-2"></i>Refillable water bottle</li>
          </ul>
        </div>
      );
    } else {
      return (
        <div>
          <h5 className="mt-4">Moderate Weather Packing List</h5>
          <ul className="list-group mt-3">
            <li className="list-group-item"><i className="bi bi-check-circle-fill text-success me-2"></i>Layered clothing options</li>
            <li className="list-group-item"><i className="bi bi-check-circle-fill text-success me-2"></i>Light jacket or sweater</li>
            <li className="list-group-item"><i className="bi bi-check-circle-fill text-success me-2"></i>Comfortable walking shoes</li>
            <li className="list-group-item"><i className="bi bi-check-circle-fill text-success me-2"></i>Umbrella or rain jacket</li>
            <li className="list-group-item"><i className="bi bi-check-circle-fill text-success me-2"></i>Light scarf</li>
            <li className="list-group-item"><i className="bi bi-check-circle-fill text-success me-2"></i>Sunglasses</li>
          </ul>
        </div>
      );
    }
  };

  return (
    <Container className="py-5">
      <h1 className="mb-4">Weather Information</h1>
      <p className="lead mb-4">
        Check the weather at your destination and get packing suggestions.
      </p>
      
      <Row className="justify-content-center mb-5">
        <Col md={8} lg={6}>
          <Card className="shadow">
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>City Name</Form.Label>
                  <div className="d-flex">
                    <Form.Control
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Enter city name (e.g., London)"
                      className="me-2"
                    />
                    <Button 
                      type="submit" 
                      disabled={loading}
                    >
                      {loading ? (
                        <Spinner animation="border" size="sm" />
                      ) : (
                        <i className="bi bi-search"></i>
                      )}
                    </Button>
                  </div>
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}
      
      {loading && !weatherData && (
        <div className="text-center py-4">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Loading weather data...</p>
        </div>
      )}
      
      {weatherData && (
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className={`shadow ${getWeatherBackground(weatherData.temperature)}`}>
              <Card.Header className="text-center">
                <h3 className="mb-0">Weather in {weatherData.city} {weatherData.country && <span>({weatherData.country})</span>}</h3>
              </Card.Header>
              <Card.Body className="text-center">
                <div className="mb-3">
                  <i className={`bi ${getWeatherIcon(weatherData.temperature)} fs-1`}></i>
                </div>
                <h2 className="display-4 mb-0">{Math.round(weatherData.temperature)}°C</h2>
                <p className="text-muted">Feels like {Math.round(weatherData.feelsLike)}°C</p>
                <p className="lead text-capitalize">{weatherData.weatherDescription}</p>
                
                <div className="d-flex flex-wrap justify-content-center gap-2 mb-4">
                  <Badge bg="secondary" className="p-2">
                    <i className="bi bi-droplet-fill me-1"></i>
                    Humidity: {weatherData.humidity || 'N/A'}%
                  </Badge>
                  <Badge bg="secondary" className="p-2">
                    <i className="bi bi-wind me-1"></i>
                    Wind: {weatherData.windSpeed || 'N/A'} m/s
                  </Badge>
                  <Badge bg="secondary" className="p-2">
                    <i className="bi bi-speedometer me-1"></i>
                    Pressure: {weatherData.pressure || 'N/A'} hPa
                  </Badge>
                </div>
                
                <Row className="mb-4">
                  <Col xs={6}>
                    <Card className="bg-light">
                      <Card.Body className="py-2">
                        <i className="bi bi-sunrise text-warning me-2"></i>
                        <strong>Sunrise:</strong> {weatherData.sunrise || 'N/A'}
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col xs={6}>
                    <Card className="bg-dark text-white">
                      <Card.Body className="py-2">
                        <i className="bi bi-sunset text-warning me-2"></i>
                        <strong>Sunset:</strong> {weatherData.sunset || 'N/A'}
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
                
                <Alert variant="info" className="mt-4">
                  <i className="bi bi-info-circle-fill me-2"></i>
                  <strong>Packing Advice:</strong> {weatherData.packingAdvice}
                </Alert>
                
                {renderPackingSuggestions(weatherData.temperature)}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Weather; 