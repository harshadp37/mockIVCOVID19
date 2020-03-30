const express = require('express');
const router = express.Router();
const doctorController = require('../../controllers/doctor');

/* DOCTOR REGISTRATION */
router.post('/register', doctorController.register);

/* DOCTOR LOGIN */
router.post('/login', doctorController.login);

/* DOCTOR REGISTER PATIENT */
router.post('/register_patient', doctorController.registerPatient);

module.exports = router;