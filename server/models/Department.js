const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide department name'],
      unique: true,
      trim: true,
    },
    code: {
      type: String,
      required: [true, 'Please provide department code'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    departmentHead: {
      type: String,
      trim: true,
    },
    headImage: {
      type: String,
    },
    location: {
      type: String,
      trim: true,
    },
    facultyCount: {
      type: Number,
      default: 0,
    },
    studentsCount: {
      type: Number,
      default: 0,
    },
    programsCount: {
      type: Number,
      default: 0,
    },
    budget: {
      type: Number,
      default: 0,
    },
    researchGrants: {
      type: mongoose.Schema.Types.Mixed,
      default: '$0',
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Department', departmentSchema);
