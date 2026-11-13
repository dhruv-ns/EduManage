const Settings = require('../models/Settings');

// @desc    Get system settings
// @route   GET /api/settings
// @access  Private
const getSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({
        institutionName: 'EduManage Metropolitan University & Institute of Technology',
        institutionCode: 'KMU-7419',
        accreditation: 'Autonomous University Council • NAAC',
        domain: 'https://portal.edumanage.edu',
        academicYear: '2024-2025',
        currentSemester: 'Fall',
        gradingScale: '4.0',
        minimumAttendance: 75,
        passingMarks: 40,
        address: '100 Innovation Drive, Academic District, CA 94085',
        phone: '+1 (555) 380-CAMPUS',
        email: 'admin@kathmandu.edu',
        timezone: '(GMT-08:00) Pacific Time (US & Canada)',
      });
    }

    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update system settings
// @route   PUT /api/settings
// @access  Private
const updateSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create(req.body);
    } else {
      settings = await Settings.findByIdAndUpdate(settings._id, req.body, {
        new: true,
        runValidators: true,
      });
    }

    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSettings,
  updateSettings,
};

