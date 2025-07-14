import React, { useState, useEffect } from 'react';
import { Container, Button, ListGroup, Form, Modal, Alert, Badge, Spinner, Collapse, Card, Row, Col } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { getAllItems, createItem, updateItem, deleteItem, togglePackedStatus } from '../services/travelItemService';
import { getWeather } from '../services/weatherService';

const Dashboard = () => {
  const [travelItems, setTravelItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [weatherData, setWeatherData] = useState({});
  const [weatherLoading, setWeatherLoading] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [expandedWeather, setExpandedWeather] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchTravelItems();
  }, []);

  const fetchTravelItems = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getAllItems();
      
      // Check if the response has the expected structure
      if (response && response.data && response.data.success && Array.isArray(response.data.data)) {
        setTravelItems(response.data.data);
      } else if (response && response.data && Array.isArray(response.data)) {
        setTravelItems(response.data);
      } else {
        console.error('Unexpected data format:', response);
        setTravelItems([]);
        setError('Received invalid data format from server');
      }
    } catch (err) {
      setError('Failed to load travel items');
      console.error('Error fetching travel items:', err);
      setTravelItems([]); // Ensure it's an array even on error
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteItem(id);
        setTravelItems(prevItems => prevItems.filter(item => item._id !== id));
      } catch (err) {
        console.error('Error deleting item:', err);
        alert('Failed to delete item. Please try again.');
      }
    }
  };

  const handleTogglePacked = async (id, currentStatus) => {
    try {
      if (!id) {
        console.error('Cannot toggle item without ID');
        alert('Error: Item ID is missing');
        return;
      }
      
      const response = await togglePackedStatus(id, !currentStatus);
      
      if (response && response.data && response.data.success) {
        // If we get a successful response with data
        setTravelItems(prevItems =>
          prevItems.map(item =>
            item._id === id ? { ...item, isPacked: !currentStatus } : item
          )
        );
      } else {
        // If the response doesn't have the expected structure
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Error toggling packed status:', err);
      alert('Failed to update item status. Please try again.');
    }
  };

  const handleModalOpen = (item = null) => {
    setCurrentItem(item);
    setImagePreview(item?.imagePath ? `http://localhost:3000/${item.imagePath}` : null);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setCurrentItem(null);
    setImagePreview(null);
    setShowModal(false);
  };

  const handleFileChange = (event, setFieldValue) => {
    const file = event.currentTarget.files[0];
    
    // Check if file is too large (over 5MB)
    if (file && file.size > 5000000) {
      alert('File is too large! Maximum size is 5MB.');
      event.target.value = '';
      return;
    }
    
    setFieldValue('image', file);
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const fetchWeatherForCity = async (city, itemId) => {
    try {
      setWeatherLoading(prev => ({ ...prev, [city]: true }));
      console.log(`Requesting weather for ${city}`);
      
      // Navigate to the Weather page with the city as a query parameter
      navigate(`/weather?city=${encodeURIComponent(city)}`);
    } catch (err) {
      console.error(`Error navigating to weather for ${city}:`, err);
      setWeatherLoading(prev => ({ ...prev, [city]: false }));
    }
  };
  
  const toggleWeatherDetails = (itemId) => {
    setExpandedWeather(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };
  
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

  const validationSchema = Yup.object({
    itemName: Yup.string().required('Item name is required'),
    destinationCity: Yup.string().required('Destination city is required')
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      setSubmitting(true);
      let response;
      
      if (currentItem) {
        // Update existing item
        response = await updateItem(currentItem._id, values);
        if (response && response.data && response.data.success && response.data.data) {
          setTravelItems(prevItems =>
            prevItems.map(item => 
              item._id === currentItem._id ? response.data.data : item
            )
          );
        } else if (response && response.data) {
          setTravelItems(prevItems =>
            prevItems.map(item => 
              item._id === currentItem._id ? response.data : item
            )
          );
        } else {
          throw new Error('Invalid response from server');
        }
      } else {
        // Create new item
        response = await createItem(values);
        if (response && response.data && response.data.success && response.data.data) {
          setTravelItems(prev => [...prev, response.data.data]);
        } else if (response && response.data) {
          setTravelItems(prev => [...prev, response.data]);
        } else {
          throw new Error('Invalid response from server');
        }
      }
      
      handleModalClose();
      resetForm();
    } catch (err) {
      console.error('Error saving item:', err);
      alert('Failed to save item. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className="py-4">
      <h1 className="mb-4">Travel Checklist</h1>
      
      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}
      
      <div className="d-flex justify-content-end mb-4">
        <Button onClick={() => handleModalOpen()} variant="primary">
          <i className="bi bi-plus-circle me-2"></i>
          Add New Item
        </Button>
      </div>
      
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-3">Loading your travel items...</p>
        </div>
      ) : travelItems.length === 0 ? (
        <div className="text-center p-5 bg-light rounded shadow-sm">
          <i className="bi bi-luggage display-1 text-muted"></i>
          <h3 className="mt-3">No items yet</h3>
          <p className="text-muted">Start adding items to your travel checklist</p>
          <Button onClick={() => handleModalOpen()} variant="primary">
            Add First Item
          </Button>
        </div>
      ) : (
        <ListGroup className="mb-4">
          {travelItems.map((item) => (
            <ListGroup.Item key={item._id} className="border rounded mb-2 shadow-sm">
              <div className="d-flex align-items-start">
                <Form.Check
                  type="checkbox"
                  checked={item.isPacked}
                  onChange={() => handleTogglePacked(item._id, item.isPacked)}
                  className="me-3 mt-1"
                />
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className={item.isPacked ? 'text-decoration-line-through text-muted mb-0' : 'mb-0'}>
                      {item.itemName}
                    </h5>
                    <div>
                      <Button 
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        onClick={() => handleModalOpen(item)}
                      >
                        <i className="bi bi-pencil"></i>
                      </Button>
                      <Button 
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(item._id)}
                      >
                        <i className="bi bi-trash"></i>
                      </Button>
                    </div>
                  </div>
                  <div className="text-muted small mb-2">
                    Destination: {item.destinationCity}
                    <Button
                      variant="link"
                      size="sm"
                      className="p-0 ms-2"
                      onClick={() => fetchWeatherForCity(item.destinationCity, item._id)}
                      disabled={weatherLoading[item.destinationCity]}
                    >
                      {weatherLoading[item.destinationCity] ? (
                        <Spinner animation="border" size="sm" />
                      ) : (
                        <span>
                          <i className="bi bi-cloud-sun me-1"></i>
                          Check Weather
                        </span>
                      )}
                    </Button>
                  </div>
                  
                  {weatherData[item.destinationCity] && (
                    <Collapse in={expandedWeather[item._id]}>
                      <div>
                        <Card className={`mb-3 ${getWeatherBackground(weatherData[item.destinationCity].temperature)}`}>
                          <Card.Body>
                            <h6 className="mb-2">Weather in {weatherData[item.destinationCity].city} {weatherData[item.destinationCity].country && `(${weatherData[item.destinationCity].country})`}</h6>
                            
                            <div className="d-flex align-items-center mb-2">
                              <i className={`bi ${getWeatherIcon(weatherData[item.destinationCity].temperature)} fs-4 me-2`}></i>
                              <div>
                                <div className="fw-bold">{Math.round(weatherData[item.destinationCity].temperature)}°C</div>
                                <div className="text-capitalize small">{weatherData[item.destinationCity].weatherDescription}</div>
                              </div>
                            </div>
                            
                            <div className="d-flex flex-wrap gap-2 mb-2">
                              <Badge bg="secondary" className="p-2">
                                <i className="bi bi-droplet-fill me-1"></i>
                                Humidity: {weatherData[item.destinationCity].humidity || 'N/A'}%
                              </Badge>
                              <Badge bg="secondary" className="p-2">
                                <i className="bi bi-wind me-1"></i>
                                Wind: {weatherData[item.destinationCity].windSpeed || 'N/A'} m/s
                              </Badge>
                            </div>
                            
                            <Row className="g-2 mb-2">
                              <Col xs={6}>
                                <div className="small">
                                  <i className="bi bi-sunrise text-warning me-1"></i>
                                  Sunrise: {weatherData[item.destinationCity].sunrise || 'N/A'}
                                </div>
                              </Col>
                              <Col xs={6}>
                                <div className="small">
                                  <i className="bi bi-sunset text-warning me-1"></i>
                                  Sunset: {weatherData[item.destinationCity].sunset || 'N/A'}
                                </div>
                              </Col>
                            </Row>
                            
                            <Alert variant="info" className="py-2 mb-0">
                              <i className="bi bi-info-circle-fill me-1"></i>
                              <strong>Packing Advice:</strong> {weatherData[item.destinationCity].packingAdvice}
                            </Alert>
                          </Card.Body>
                        </Card>
                      </div>
                    </Collapse>
                  )}
                  
                  {item.imagePath && (
                    <div>
                      <img 
                        src={`http://localhost:3000/${item.imagePath}`} 
                        alt={item.itemName}
                        className="rounded mt-2"
                        style={{ maxWidth: '100%', maxHeight: '150px' }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
      
      {/* Add/Edit Item Modal */}
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>{currentItem ? 'Edit Travel Item' : 'Add Travel Item'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{
              itemName: currentItem?.itemName || '',
              destinationCity: currentItem?.destinationCity || '',
              isPacked: currentItem?.isPacked || false,
              image: null
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ handleSubmit, handleChange, setFieldValue, values, touched, errors, isSubmitting }) => (
              <Form noValidate onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Item Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="itemName"
                    value={values.itemName}
                    onChange={handleChange}
                    isInvalid={touched.itemName && !!errors.itemName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.itemName}
                  </Form.Control.Feedback>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Destination City</Form.Label>
                  <Form.Control
                    type="text"
                    name="destinationCity"
                    value={values.destinationCity}
                    onChange={handleChange}
                    isInvalid={touched.destinationCity && !!errors.destinationCity}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.destinationCity}
                  </Form.Control.Feedback>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    name="isPacked"
                    label="Item is packed"
                    checked={values.isPacked}
                    onChange={handleChange}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Upload Image (Optional - Max 5MB)</Form.Label>
                  <Form.Control
                    type="file"
                    name="image"
                    onChange={e => handleFileChange(e, setFieldValue)}
                    accept="image/*"
                  />
                  <Form.Text className="text-muted">
                    Upload an image of your travel document or item
                  </Form.Text>
                </Form.Group>
                
                {imagePreview && (
                  <div className="text-center mb-3">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="img-thumbnail"
                      style={{ maxHeight: '200px' }}
                    />
                  </div>
                )}
                
                <div className="d-flex justify-content-end">
                  <Button variant="secondary" onClick={handleModalClose} className="me-2">
                    Cancel
                  </Button>
                  <Button 
                    variant="primary" 
                    type="submit" 
                    disabled={isSubmitting || submitting}
                  >
                    {isSubmitting || submitting ? (
                      <>
                        <Spinner 
                          as="span" 
                          animation="border" 
                          size="sm" 
                          role="status" 
                          aria-hidden="true" 
                          className="me-2"
                        />
                        Saving...
                      </>
                    ) : currentItem ? 'Update' : 'Add'}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Dashboard; 