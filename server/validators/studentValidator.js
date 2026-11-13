const { body } = require('express-validator');

const studentValidator = [
  body('fullName')
    .trim()
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({ min: 2 })
    .withMessage('Full name must be at least 2 characters'),
  body('rollNumber')
    .trim()
    .notEmpty()
    .withMessage('Roll number is required'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('gender')
    .optional()
    .isIn(['Male', 'Female', 'Other'])
    .withMessage('Gender must be Male, Female, or Other'),
  body('semester')
    .optional()
    .isInt({ min: 1, max: 12 })
    .withMessage('Semester must be between 1 and 12'),
  body('status')
    .optional()
    .isIn([
      'Active',
      'Inactive',
      'Academic Leave',
      'Suspended',
      'Graduated',
      'Alumni',
    ])
    .withMessage('Invalid status'),
];

module.exports = { studentValidator };
