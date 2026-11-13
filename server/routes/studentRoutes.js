const express = require('express');
const router = express.Router();
const {
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
} = require('../controllers/studentController');
const { protect } = require('../middleware/auth');
const { studentValidator } = require('../validators/studentValidator');

router.use(protect);

router.route('/')
  .get(getStudents)
  .post(studentValidator, createStudent);

router.route('/:id')
  .get(getStudent)
  .put(updateStudent)
  .delete(deleteStudent);

module.exports = router;

