const bcrypt = require('bcrypt');
const Doctor = require('./../models/doctor');
const Patient = require('./../models/patient');
const jwt = require('jsonwebtoken');
const config = require('./../config');

/* DOCTOR REGISTRATION */
module.exports.register = async (req, res)=>{
    /* NAME, USERNAME, PASSWORD REQUIRED */
    if(!req.body.name || !req.body.username || !req.body.password){
        return res.json({success: false, message: "All Fields(Name, Username & Password) Required."});
    }
    try {
        /* GET DOCTOR WITH THE HELP OF USERNAME */
        const doctor = await Doctor.findOne({username: req.body.username});

        /* IF USERNAME ALREADY TAKE THEN ABORT OPERATION */
        if(doctor){
            console.error("Sorry, Username already taken.");
            return res.json({success: false, message: "Sorry, Username already taken."});
        }

        /* IF USERNAME NOT EXISTS THEN CREATE HASH FOR PASSWORD & CREATE DOCTOR */
        const salt = bcrypt.genSaltSync(5);
        const hash = await bcrypt.hashSync(req.body.password, salt);
        await Doctor.create({
            name: req.body.name,
            username: req.body.username,
            password: hash
        })
        return res.json({success: true, message: "Doctor Registered Successfully!!"});
    } catch (e) {
        console.error("Error while registering doctor.");
        return res.json({success: false, message: "Error while registering doctor." + e});
    }
}

/* DOCTOR LOGIN */
module.exports.login = async (req, res)=>{
    /* USERNAME, PASSWORD REQUIRED */
    if(!req.body.username || !req.body.password){
        return res.json({success: false, message: "All Fields(Username & Password) Required."});
    }
    try {
        /* GET DOCTOR WITH THE HELP OF USERNAME */
        const doctor = await Doctor.findOne({username: req.body.username});

        /* IF USERNAME NOT EXISTS THEN ABORT OPERATION */
        if(!doctor){
            console.error("Sorry, Wrong Credentials.");
            return res.json({success: false, message: "Sorry, Wrong Credentials."});
        }

        /* IF PASSWORD IS INCORRECT THEN ABORT OPERATION */
        const passwordValid = await bcrypt.compareSync(req.body.password, doctor.password);
        if(!passwordValid){
            console.error("Sorry, Wrong Credentials.");
            return res.json({success: false, message: "Sorry, Wrong Credentials."});
        }

        /* IF BOTH USERNAME & PASSWORD IS CORRECT THEN CREATE TOKEN & PASS TOKEN IN RESPONSE */
        const token = jwt.sign({_id: doctor._id, username: doctor.username}, config.secretKey , {expiresIn: '12h'});
        return res.json({success: true, message: "Logged In Successfully!!", token: token});
    } catch (e) {
        console.error("Error in login doctor.");
        return res.json({success: false, message: "Error in login doctor." + e});
    }
}

/* DOCTOR REGISTER PATIENT */
module.exports.registerPatient = async (req, res)=>{
    /* NAME, PHONE NUMBER REQUIRED */
    if(!req.body.name || !req.body.phoneNumber){
        return res.json({success: false, message: "All Fields(Name & phone Number) Required."});
    }
    try {
        /* GET PATIENT WITH THE HELP OF PHONE NUMBER */
        const patient = await Patient.findOne({phoneNumber: req.body.phoneNumber});

        /* IF PATIENT IS EXISTS THEN SNED ALL DETAILS OF PATIENT */
        if(patient){
            return res.json({success: true, patientDetails: patient});
        }

        /* IF PATIENT IS NOT EXISTS THEN CREATE NEW PATIENT & ALSO PUSH THAT PATIENT IN DOCTOR'S PATIENTS */
        const doctor = await Doctor.findOne({_id: req.user});
        if(!doctor){
            throw new Error("Doctor is Not Found.");
        }
        const newPatient = await Patient.create({
            name: req.body.name,
            phoneNumber: req.body.phoneNumber,
            assignedDoctor: req.user
        })
        doctor.patients.push(newPatient);
        doctor.save();
        return res.json({success: true, message: "Patient Registered Successfully!!"});
    } catch (e) {
        console.error("Error while registering patient.");
        return res.json({success: false, message: "Error while registering patient." + e});
    }
}