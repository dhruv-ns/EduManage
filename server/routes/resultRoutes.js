const express = require('express');
const router = express.Router();
const {
  getResults,
  createResult,
  updateResult,
  getStudentResults,
  publishResults,
} = require('../controllers/resultController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getResults)
  .post(createResult);

router.route('/publish')
  .post(publishResults);

router.route('/:id')
  .put(updateResult);

router.route('/student/:studentId')
  .get(getStudentResults);

module.exports = router;

