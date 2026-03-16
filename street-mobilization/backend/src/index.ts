import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import childRoutes from './routes/childRoutes';
import authRoutes from './routes/authRoutes';
import interventionRoutes from './routes/interventionRoutes';
import aidRoutes from './routes/aidRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/children', childRoutes);
app.use('/api/interventions', interventionRoutes);
app.use('/api/aid', aidRoutes);

app.get('/', (req, res) => {
  res.send('Street Mobilization API is running...');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
