const express = require('express');
const router = express.Router();

/* ROUTES FOR DOCTORS */
router.use('/doctors', require('./doctors/doctor'));

/* ROUTES FOR PATIENTS */
router.use('/patients', require('./patients/patient'));

module.exports = router;