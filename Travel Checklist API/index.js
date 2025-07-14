const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Route files
const authRoutes = require('./routes/authRoutes');
const travelItemRoutes = require('./routes/travelItemRoutes');
const weatherRoutes = require('./routes/weatherRoutes');

const app = express();

// Body parser
app.use(express.json());

// Enable CORS with more permissive configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: false,
  maxAge: 86400 // 24 hours
}));

// Static folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/travel-items', travelItemRoutes);
app.use('/api/weather', weatherRoutes);

// Basic route for API information
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Travel Checklist API',
    version: '1.0.0'
  });
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

const server = app.listen(
  PORT,
  console.log(`Server running in development mode on port ${PORT}`)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
}); 