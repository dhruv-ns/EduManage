const { validationResult } = require('express-validator');
const Student = require('../models/Student');

// @desc    Get all students (paginated, searchable, filterable, sortable)
// @route   GET /api/students
// @access  Private
const getStudents = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      course,
      semester,
      status,
      department,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    const query = {};

    // Search by name, rollNumber, or email
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { rollNumber: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    // Filters
    if (course) query.course = course;
    if (semester) query.semester = Number(semester);
    if (status) query.status = status;
    if (department) query.department = department;

    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const total = await Student.countDocuments(query);
    const students = await Student.find(query)
      .populate('course', 'name courseCode')
      .populate('department', 'name code')
      .sort(sort)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      data: students,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single student
// @route   GET /api/students/:id
// @access  Private
const getStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('course', 'name courseCode degreeType duration semesters')
      .populate('department', 'name code');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create student
// @route   POST /api/students
// @access  Private
const createStudent = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const student = await Student.create(req.body);

    res.status(201).json({
      success: true,
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Private
const updateStudent = async (req, res, next) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Private
const deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Student deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
};
