const express = require('express');
const router = express.Router();
const {
  getTickets,
  createTicket,
  updateTicket,
} = require('../controllers/supportController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/tickets')
  .get(getTickets)
  .post(createTicket);

router.route('/tickets/:id')
  .put(updateTicket);

module.exports = router;

