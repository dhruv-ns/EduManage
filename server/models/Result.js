const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student is required'],
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Course is required'],
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
    },
    semester: {
      type: Number,
      required: [true, 'Semester is required'],
    },
    examType: {
      type: String,
      enum: ['Mid Term', 'End Term', 'Internal'],
      default: 'End Term',
    },
    internalMarks: {
      type: Number,
      default: 0,
    },
    midTermMarks: {
      type: Number,
      default: 0,
    },
    endTermMarks: {
      type: Number,
      default: 0,
    },
    totalMarks: {
      type: Number,
      default: 0,
    },
    percentage: {
      type: Number,
      default: 0,
    },
    grade: {
      type: String,
    },
    gpa: {
      type: Number,
    },
    resultStatus: {
      type: String,
      enum: ['Pass', 'Fail', 'Withheld', 'Published'],
      default: 'Pass',
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to auto-calculate totalMarks, percentage, grade, and gpa
resultSchema.pre('save', function () {
  // Calculate total marks
  this.totalMarks = (this.internalMarks || 0) + (this.midTermMarks || 0) + (this.endTermMarks || 0);

  // Calculate percentage (total out of 100)
  this.percentage = (this.totalMarks / 100) * 100;

  // Determine grade based on percentage
  if (this.percentage >= 90) {
    this.grade = 'A+';
    this.gpa = 4.0;
  } else if (this.percentage >= 80) {
    this.grade = 'A';
    this.gpa = 4.0;
  } else if (this.percentage >= 70) {
    this.grade = 'B+';
    this.gpa = 3.5;
  } else if (this.percentage >= 60) {
    this.grade = 'B';
    this.gpa = 3.0;
  } else if (this.percentage >= 50) {
    this.grade = 'C+';
    this.gpa = 2.5;
  } else if (this.percentage >= 40) {
    this.grade = 'C';
    this.gpa = 2.0;
  } else {
    this.grade = 'F';
    this.gpa = 0;
  }

  // Auto-set result status
  if (this.percentage < 40) {
    this.resultStatus = 'Fail';
  }
});

module.exports = mongoose.model('Result', resultSchema);
