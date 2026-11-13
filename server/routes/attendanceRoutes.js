const express = require('express');
const router = express.Router();
const {
  getAttendance,
  createAttendance,
  updateAttendance,
  getStudentAttendance,
} = require('../controllers/attendanceController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getAttendance)
  .post(createAttendance);

router.route('/:id')
  .put(updateAttendance);

router.route('/student/:studentId')
  .get(getStudentAttendance);

module.exports = router;

