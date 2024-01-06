const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes')
const fileRoutes = require('./routes/fileRoutes')
const app = express();
const MONGOSTRING = process.env.MONGODB_STRING;
const PORT = process.env.PORT | 3000;
require('dotenv').config();


app.use(cors());  


app.use(express.json());
app.use('/', userRoutes)
app.use('/', fileRoutes);
// Connect to MongoDB
mongoose.connect(MONGOSTRING);

// Handle MongoDB connection events
const db = mongoose.connection;

db.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

db.once('open', () => {
  console.log('Connected to MongoDB');

  // Start Express server
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});

// Handle process termination events
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('MongoDB connection disconnected through app termination');
    process.exit(0);
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Application-specific logging, throwing an error, or other logic here
});
