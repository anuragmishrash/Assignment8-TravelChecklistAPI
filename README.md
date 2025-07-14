# Travel Checklist API

A RESTful API for managing travel checklist items with user authentication, weather integration, and file upload capabilities.

## Features

- User Authentication (JWT-based)
- Travel Packing List CRUD operations
- Weather API Integration with OpenWeatherMap
- File Upload with Multer
- Global Error Handling

## Setup and Installation

1. Clone the repository
2. Install dependencies
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   WEATHER_API_KEY=your_openweathermap_api_key
   ```
4. Create an `uploads` directory in the root folder for storing uploaded files
5. Start the server
   ```
   npm start
   ```
   or for development mode with nodemon:
   ```
   npm run dev:all
   ```

## API Endpoints

### Authentication

- **Register a new user**
  - `POST /api/auth/register`
  - Request body: `{ "name": "John Doe", "email": "john@example.com", "password": "password123" }`

- **Login**
  - `POST /api/auth/login`
  - Request body: `{ "email": "john@example.com", "password": "password123" }`

- **Get current user profile**
  - `GET /api/auth/me`
  - Header: `Authorization: Bearer YOUR_TOKEN`

### Travel Items

- **Get all travel items**
  - `GET /api/travel-items`
  - Header: `Authorization: Bearer YOUR_TOKEN`

- **Get a specific travel item**
  - `GET /api/travel-items/:id`
  - Header: `Authorization: Bearer YOUR_TOKEN`

- **Create a new travel item**
  - `POST /api/travel-items`
  - Header: `Authorization: Bearer YOUR_TOKEN`
  - Content-Type: `multipart/form-data`
  - Form fields:
    - `itemName`: String (required)
    - `destinationCity`: String (required)
    - `isPacked`: Boolean (optional, defaults to false)
    - `image`: File (optional)

- **Update a travel item**
  - `PUT /api/travel-items/:id`
  - Header: `Authorization: Bearer YOUR_TOKEN`
  - Content-Type: `multipart/form-data`
  - Form fields: Same as create

- **Delete a travel item**
  - `DELETE /api/travel-items/:id`
  - Header: `Authorization: Bearer YOUR_TOKEN`

### Weather

- **Get weather data for a city**
  - `GET /api/weather?city=CityName`
  - Header: `Authorization: Bearer YOUR_TOKEN`

## Error Handling

The API has a global error handling mechanism that captures and formats various errors, including:
- Validation errors
- Authentication errors
- Database errors
- Not found errors
- Server errors 
