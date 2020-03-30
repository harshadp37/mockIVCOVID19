const express = require('express');
const router = express.Router();
const reportController = require('../../controllers/report');

/* GET ALL REPORTS BY STATUS */
router.get('/:status', reportController.reportByStatus);

module.exports = router;