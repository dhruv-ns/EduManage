require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const User = require('./models/User');
const { seedData } = require('./seed/seed');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'EduManage API is healthy and operational' });
});

// Manual Seed Endpoint (useful for cloud deployments without shell access)
app.get('/api/seed', async (req, res) => {
  const secret = req.query.secret || req.headers['x-seed-secret'];
  const expectedSecret = process.env.SEED_SECRET || 'edumanage2024';

  if (secret !== expectedSecret && process.env.NODE_ENV === 'production') {
    return res.status(403).json({
      success: false,
      message: 'Unauthorized: pass valid ?secret=edumanage2024 to trigger re-seed.'
    });
  }

  try {
    await seedData(false);
    return res.status(200).json({
      success: true,
      message: 'Database seeded successfully!',
      credentials: {
        email: 'admin@kathmandu.edu',
        password: 'adminpassword123'
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
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

// Auto-seed function: seeds if database has no users or AUTO_SEED is set
const autoSeedIfEmpty = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0 || process.env.AUTO_SEED === 'true') {
      console.log('ℹ️ Fresh database detected (0 users) or AUTO_SEED enabled. Starting auto-seed...');
      await seedData(false);
      console.log('✅ Auto-seeding completed successfully!');
    } else {
      console.log(`ℹ️ Database already initialized (${userCount} users found). Skipping auto-seed.`);
    }
  } catch (error) {
    console.error('⚠️ Auto-seed check error:', error.message);
  }
};

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  await autoSeedIfEmpty();

  app.listen(PORT, () => {
    console.log(`EduManage Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
};

startServer();


