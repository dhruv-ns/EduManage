const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide course name'],
      trim: true,
    },
    courseCode: {
      type: String,
      required: [true, 'Please provide course code'],
      unique: true,
      trim: true,
    },
    degreeType: {
      type: String,
      enum: ['Undergraduate', 'Postgraduate', 'Diploma'],
      default: 'Undergraduate',
    },
    duration: {
      type: String,
      trim: true,
    },
    semesters: {
      type: Number,
    },
    totalCredits: {
      type: Number,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
    },
    headOfDepartment: {
      type: String,
      trim: true,
    },
    hodImage: {
      type: String,
    },
    enrollmentCapacity: {
      type: Number,
      default: 100,
    },
    currentEnrollment: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Course', courseSchema);
