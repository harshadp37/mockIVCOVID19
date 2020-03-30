const express = require('express');
const router = express.Router();
const middleware = require('./../../middlewares/middleware');
const doctorController = require('../../controllers/doctor');

/* DOCTOR REGISTRATION */
router.post('/register', doctorController.register);

/* DOCTOR LOGIN */
router.post('/login', doctorController.login);

/* PATIENT REGISTRATION, CHECK LOGGED IN DOCTOR BEFORE REGISTRATION. */
router.post('/register_patient', middleware.checkToken, doctorController.registerPatient);

module.exports = router;