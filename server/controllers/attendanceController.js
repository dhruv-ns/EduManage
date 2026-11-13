const Attendance = require('../models/Attendance');

// @desc    Get attendance records
// @route   GET /api/attendance
// @access  Private
const getAttendance = async (req, res, next) => {
  try {
    const { course, subject, date, session, page = 1, limit = 50 } = req.query;
    const query = {};

    if (course) query.course = course;
    if (subject) query.subject = { $regex: subject, $options: 'i' };
    if (date) {
      const targetDate = new Date(date);
      const nextDate = new Date(targetDate);
      nextDate.setDate(nextDate.getDate() + 1);
      query.date = { $gte: targetDate, $lt: nextDate };
    }
    if (session) query.session = session;

    const total = await Attendance.countDocuments(query);
    const attendance = await Attendance.find(query)
      .populate('student', 'fullName rollNumber email')
      .populate('course', 'name courseCode')
      .populate('markedBy', 'name')
      .sort({ date: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      data: attendance,
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

// @desc    Create attendance records (accepts array)
// @route   POST /api/attendance
// @access  Private
const createAttendance = async (req, res, next) => {
  try {
    let records = req.body;

    // If single record, wrap in array
    if (!Array.isArray(records)) {
      records = [records];
    }

    // Add markedBy to each record
    records = records.map((record) => ({
      ...record,
      markedBy: req.user._id,
    }));

    const results = [];
    const errors = [];

    for (const record of records) {
      try {
        // Check for existing record (prevent duplicates)
        const existing = await Attendance.findOne({
          student: record.student,
          subject: record.subject,
          date: record.date,
        });

        if (existing) {
          // Update existing record instead of creating duplicate
          existing.status = record.status || existing.status;
          existing.remarks = record.remarks || existing.remarks;
          existing.session = record.session || existing.session;
          existing.markedBy = record.markedBy;
          await existing.save();
          results.push(existing);
        } else {
          const attendance = await Attendance.create(record);
          results.push(attendance);
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
      message: `${results.length} attendance record(s) processed${errors.length > 0 ? `, ${errors.length} error(s)` : ''}`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update attendance record
// @route   PUT /api/attendance/:id
// @access  Private
const updateAttendance = async (req, res, next) => {
  try {
    const attendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found',
      });
    }

    res.status(200).json({
      success: true,
      data: attendance,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get attendance for a specific student with percentage
// @route   GET /api/attendance/student/:studentId
// @access  Private
const getStudentAttendance = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const { course, subject } = req.query;

    const query = { student: studentId };
    if (course) query.course = course;
    if (subject) query.subject = { $regex: subject, $options: 'i' };

    const attendance = await Attendance.find(query)
      .populate('course', 'name courseCode')
      .populate('markedBy', 'name')
      .sort({ date: -1 });

    // Calculate percentage per subject
    const subjectStats = {};
    attendance.forEach((record) => {
      const subj = record.subject;
      if (!subjectStats[subj]) {
        subjectStats[subj] = { total: 0, present: 0, absent: 0, late: 0, excused: 0 };
      }
      subjectStats[subj].total++;
      if (record.status === 'Present') subjectStats[subj].present++;
      else if (record.status === 'Absent') subjectStats[subj].absent++;
      else if (record.status === 'Late') subjectStats[subj].late++;
      else if (record.status === 'Excused') subjectStats[subj].excused++;
    });

    // Calculate percentage for each subject
    const subjectSummary = Object.entries(subjectStats).map(
      ([subjectName, stats]) => ({
        subject: subjectName,
        ...stats,
        percentage:
          stats.total > 0
            ? Math.round(((stats.present + stats.late) / stats.total) * 100 * 100) / 100
            : 0,
      })
    );

    // Overall stats
    const totalClasses = attendance.length;
    const totalPresent = attendance.filter(
      (a) => a.status === 'Present' || a.status === 'Late'
    ).length;
    const overallPercentage =
      totalClasses > 0
        ? Math.round((totalPresent / totalClasses) * 100 * 100) / 100
        : 0;

    res.status(200).json({
      success: true,
      data: attendance,
      summary: {
        totalClasses,
        totalPresent,
        overallPercentage,
        subjects: subjectSummary,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAttendance,
  createAttendance,
  updateAttendance,
  getStudentAttendance,
};
