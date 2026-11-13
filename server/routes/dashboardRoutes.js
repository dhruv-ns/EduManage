const express = require('express');
const router = express.Router();
const {
  getStats,
  getRecentAdmissions,
  getEnrollmentOverview,
  getCourseDistribution,
} = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/stats', getStats);
router.get('/recent-admissions', getRecentAdmissions);
router.get('/enrollment-overview', getEnrollmentOverview);
router.get('/course-distribution', getCourseDistribution);

module.exports = router;

