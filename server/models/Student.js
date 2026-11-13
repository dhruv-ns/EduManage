const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Please provide student full name'],
      trim: true,
    },
    rollNumber: {
      type: String,
      required: [true, 'Please provide a roll number'],
      unique: true,
      trim: true,
    },
    registrationNumber: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
    },
    phone: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    profileImage: {
      type: String,
      default: '',
    },
    guardianName: {
      type: String,
      trim: true,
    },
    motherName: {
      type: String,
      trim: true,
    },
    emergencyContact: {
      type: String,
      trim: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
    },
    semester: {
      type: Number,
      default: 1,
    },
    section: {
      type: String,
      trim: true,
    },
    admissionDate: {
      type: Date,
      default: Date.now,
    },
    previousQualification: {
      type: String,
      trim: true,
    },
    bloodGroup: {
      type: String,
      trim: true,
    },
    medicalInfo: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: [
        'Active',
        'Inactive',
        'Academic Leave',
        'Suspended',
        'Graduated',
        'Alumni',
      ],
      default: 'Active',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Student', studentSchema);
