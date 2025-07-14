import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Container className="py-5">
      <Row className="text-center mb-5">
        <Col>
          <h1 className="display-4">Travel Checklist App</h1>
          <p className="lead">
            Plan your travels with ease. Keep track of what to pack and get weather information for your destination.
          </p>
          
          {isAuthenticated ? (
            <Button as={Link} to="/dashboard" variant="primary" size="lg">
              Go to Dashboard
            </Button>
          ) : (
            <div className="d-flex justify-content-center gap-3">
              <Button as={Link} to="/login" variant="primary" size="lg">
                Login
              </Button>
              <Button as={Link} to="/register" variant="outline-primary" size="lg">
                Register
              </Button>
            </div>
          )}
        </Col>
      </Row>

      <Row className="mt-5">
        <Col md={4} className="mb-4">
          <Card className="h-100 shadow">
            <Card.Body className="d-flex flex-column align-items-center">
              <div className="text-center mb-3">
                <i className="bi bi-list-check fs-1"></i>
              </div>
              <Card.Title className="text-center">Packing List</Card.Title>
              <Card.Text className="text-center">
                Create and manage your travel packing list. Check off items as you pack them and stay organized.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="h-100 shadow">
            <Card.Body className="d-flex flex-column align-items-center">
              <div className="text-center mb-3">
                <i className="bi bi-cloud-sun fs-1"></i>
              </div>
              <Card.Title className="text-center">Weather Integration</Card.Title>
              <Card.Text className="text-center">
                Check the weather at your destination and get packing recommendations based on the forecast.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="h-100 shadow">
            <Card.Body className="d-flex flex-column align-items-center">
              <div className="text-center mb-3">
                <i className="bi bi-file-earmark-image fs-1"></i>
              </div>
              <Card.Title className="text-center">File Upload</Card.Title>
              <Card.Text className="text-center">
                Attach images of your travel documents, tickets, or passport to keep everything in one place.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home; 