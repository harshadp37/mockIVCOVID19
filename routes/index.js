const express = require('express');
const router = express.Router();

/* ROUTES FOR DOCTORS */
router.use('/doctors', require('./doctors/doctor'));

/* ROUTES FOR PATIENTS */
router.use('/patients', require('./patients/patient'));

/* ROUTES FOR REPORTS */
router.use('/reports', require('./reports/report'));

module.exports = router;