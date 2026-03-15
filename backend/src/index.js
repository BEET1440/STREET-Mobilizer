const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const childRecordRoutes = require('./routes/childRecordRoutes');
const userRoutes = require('./routes/userRoutes');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/records', childRecordRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send('Street Mobilizer API is running...');
});

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/street-mobilizer';

mongoose.connect(mongoURI)
  .then(() => {
    console.log('MongoDB Connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error(`Error: ${err.message}`);
    // If mongo fails, we still start the server for development purposes (using mock blockchain)
    console.warn('MongoDB connection failed, but starting server anyway for development...');
    app.listen(PORT, () => console.log(`Server running on port ${PORT} (without MongoDB)`));
  });
