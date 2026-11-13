const express = require('express');
const router = express.Router();
const {
  getDepartments,
  getDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} = require('../controllers/departmentController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getDepartments)
  .post(createDepartment);

router.route('/:id')
  .get(getDepartment)
  .put(updateDepartment)
  .delete(deleteDepartment);

module.exports = router;

