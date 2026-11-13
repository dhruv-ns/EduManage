const Result = require('../models/Result');

// @desc    Get results
// @route   GET /api/results
// @access  Private
const getResults = async (req, res, next) => {
  try {
    const { course, semester, subject, examType, page = 1, limit = 50 } = req.query;
    const query = {};

    if (course) query.course = course;
    if (semester) query.semester = Number(semester);
    if (subject) query.subject = { $regex: subject, $options: 'i' };
    if (examType) query.examType = examType;

    const total = await Result.countDocuments(query);
    const results = await Result.find(query)
      .populate('student', 'fullName rollNumber email')
      .populate('course', 'name courseCode')
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      data: results,
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

// @desc    Create or update results (accepts array)
// @route   POST /api/results
// @access  Private
const createResult = async (req, res, next) => {
  try {
    let records = req.body;

    if (!Array.isArray(records)) {
      records = [records];
    }

    const results = [];
    const errors = [];

    for (const record of records) {
      try {
        // Check if result already exists for this student+subject+semester+examType
        const existing = await Result.findOne({
          student: record.student,
          subject: record.subject,
          semester: record.semester,
          examType: record.examType || 'End Term',
        });

        if (existing) {
          // Update existing result
          existing.internalMarks = record.internalMarks ?? existing.internalMarks;
          existing.midTermMarks = record.midTermMarks ?? existing.midTermMarks;
          existing.endTermMarks = record.endTermMarks ?? existing.endTermMarks;
          existing.course = record.course || existing.course;
          await existing.save(); // triggers pre-save hook
          results.push(existing);
        } else {
          const result = await Result.create(record);
          results.push(result);
        }
      } catch (err) {
        errors.push({
          record,
          error: err.message,
        });
      }
    }

    res.status(201).json({
      success: true,
      data: results,
      errors: errors.length > 0 ? errors : undefined,
      message: `${results.length} result(s) processed${errors.length > 0 ? `, ${errors.length} error(s)` : ''}`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update result
// @route   PUT /api/results/:id
// @access  Private
const updateResult = async (req, res, next) => {
  try {
    const result = await Result.findById(req.params.id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Result not found',
      });
    }

    // Update fields
    Object.keys(req.body).forEach((key) => {
      result[key] = req.body[key];
    });

    await result.save(); // triggers pre-save hook for auto-calculation

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get results for a specific student
// @route   GET /api/results/student/:studentId
// @access  Private
const getStudentResults = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const { semester, examType } = req.query;

    const query = { student: studentId };
    if (semester) query.semester = Number(semester);
    if (examType) query.examType = examType;

    const results = await Result.find(query)
      .populate('course', 'name courseCode')
      .sort({ semester: 1, subject: 1 });

    // Calculate semester-wise GPA
    const semesterGpa = {};
    results.forEach((result) => {
      const sem = result.semester;
      if (!semesterGpa[sem]) {
        semesterGpa[sem] = { totalGpa: 0, count: 0, subjects: [] };
      }
      semesterGpa[sem].totalGpa += result.gpa || 0;
      semesterGpa[sem].count++;
      semesterGpa[sem].subjects.push({
        subject: result.subject,
        grade: result.grade,
        gpa: result.gpa,
        totalMarks: result.totalMarks,
        percentage: result.percentage,
      });
    });

    const semesterSummary = Object.entries(semesterGpa).map(([sem, data]) => ({
      semester: Number(sem),
      sgpa: data.count > 0 ? Math.round((data.totalGpa / data.count) * 100) / 100 : 0,
      subjectCount: data.count,
      subjects: data.subjects,
    }));

    // Overall CGPA
    const totalGpa = results.reduce((sum, r) => sum + (r.gpa || 0), 0);
    const cgpa =
      results.length > 0
        ? Math.round((totalGpa / results.length) * 100) / 100
        : 0;

    res.status(200).json({
      success: true,
      data: results,
      summary: {
        cgpa,
        totalSubjects: results.length,
        semesters: semesterSummary,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Publish results for a course/semester/subject
// @route   POST /api/results/publish
// @access  Private
const publishResults = async (req, res, next) => {
  try {
    const { course, semester, subject } = req.body;

    if (!course || !semester) {
      return res.status(400).json({
        success: false,
        message: 'Course and semester are required to publish results',
      });
    }

    const query = { course, semester: Number(semester) };
    if (subject) query.subject = subject;

    const updateResult = await Result.updateMany(query, {
      isPublished: true,
      resultStatus: 'Published',
    });

    res.status(200).json({
      success: true,
      message: `${updateResult.modifiedCount} result(s) published successfully`,
      modifiedCount: updateResult.modifiedCount,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getResults,
  createResult,
  updateResult,
  getStudentResults,
  publishResults,
};
