const SupportTicket = require('../models/SupportTicket');

// @desc    Get all support tickets
// @route   GET /api/support/tickets
// @access  Private
const getTickets = async (req, res, next) => {
  try {
    const { category, priority, status } = req.query;
    const query = {};
    if (category) query.category = category;
    if (priority) query.priority = priority;
    if (status) query.status = status;

    const tickets = await SupportTicket.find(query)
      .populate('createdBy', 'name email role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tickets.length,
      data: tickets,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create support ticket
// @route   POST /api/support/tickets
// @access  Private
const createTicket = async (req, res, next) => {
  try {
    const { title, description, category, priority } = req.body;
    const ticket = await SupportTicket.create({
      title,
      description,
      category,
      priority,
      createdBy: req.user ? req.user._id : null,
    });

    res.status(201).json({
      success: true,
      data: ticket,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update support ticket
// @route   PUT /api/support/tickets/:id
// @access  Private
const updateTicket = async (req, res, next) => {
  try {
    const ticket = await SupportTicket.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    res.status(200).json({
      success: true,
      data: ticket,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTickets,
  createTicket,
  updateTicket,
};

