const express = require('express');
const router = express.Router();
const middleware = require('./../../middlewares/middleware');
const patientController = require('../../controllers/patient');

/* CREATE REPORT FOR SPECIFIC PATIENT */
router.post('/:id/create_report', middleware.checkToken, patientController.createReport);

/* GET ALL REPORTS OF SPECIFIC PATIENT */
router.get('/:id/all_reports', middleware.checkToken, patientController.allReports);

module.exports = router;