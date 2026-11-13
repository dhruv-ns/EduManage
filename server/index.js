require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Connect Database
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test Route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'EduManage API is healthy and operational' });
});

// Mount Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/departments', require('./routes/departmentRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/results', require('./routes/resultRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/support', require('./routes/supportRoutes'));
app.use('/api/settings', require('./routes/settingsRoutes'));

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`EduManage Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

