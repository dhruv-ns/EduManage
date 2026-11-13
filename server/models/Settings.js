const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema(
  {
    institutionName: {
      type: String,
      default: 'Kathmandu Metropolitan University',
    },
    institutionCode: {
      type: String,
      default: 'KMU-7419',
    },
    accreditation: {
      type: String,
      default: 'NAAC',
    },
    domain: {
      type: String,
    },
    academicYear: {
      type: String,
      default: '2024-2025',
    },
    currentSemester: {
      type: String,
      default: 'Fall',
    },
    gradingScale: {
      type: String,
      default: '4.0',
    },
    minimumAttendance: {
      type: Number,
      default: 75,
    },
    passingMarks: {
      type: Number,
      default: 40,
    },
    institutionLogo: {
      type: String,
    },
    address: {
      type: String,
    },
    phone: {
      type: String,
    },
    email: {
      type: String,
    },
    timezone: {
      type: String,
      default: 'Asia/Kolkata',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Settings', settingsSchema);
