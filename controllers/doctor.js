const bcrypt = require('bcrypt');
const Doctor = require('./../models/doctor');
const Patient = require('./../models/patient');
const jwt = require('jsonwebtoken');
const config = require('./../config');

/* DOCTOR REGISTRATION */
module.exports.register = async (req, res)=>{
    if(!req.body.name || !req.body.username || !req.body.password){
        return res.json({success: false, message: "All Fields(Name, Username & Password) Required."});
    }
    try {
        const doctor = await Doctor.findOne({username: req.body.username});
        if(doctor){
            console.error("Sorry, Username already taken.");
            return res.json({success: false, message: "Sorry, Username already taken."});
        }
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
    if(!req.body.username || !req.body.password){
        return res.json({success: false, message: "All Fields(Username & Password) Required."});
    }
    try {
        const doctor = await Doctor.findOne({username: req.body.username});
        if(!doctor){
            console.error("Sorry, Wrong Credentials.");
            return res.json({success: false, message: "Sorry, Wrong Credentials."});
        }
        const passwordValid = await bcrypt.compareSync(req.body.password, doctor.password);
        if(!passwordValid){
            console.error("Sorry, Wrong Credentials.");
            return res.json({success: false, message: "Sorry, Wrong Credentials."});
        }
        const token = jwt.sign({_id: doctor._id, username: doctor.username}, config.secretKey , {expiresIn: '12h'});
        return res.json({success: true, message: "Logged In Successfully!!", token: token});
    } catch (e) {
        console.error("Error in login doctor.");
        return res.json({success: false, message: "Error in login doctor." + e});
    }
}

/* DOCTOR REGISTER PATIENT */
module.exports.registerPatient = async (req, res)=>{
    if(!req.body.name || !req.body.phoneNumber){
        return res.json({success: false, message: "All Fields(Name & phone Number) Required."});
    }
    try {
        const patient = await Patient.findOne({phoneNumber: req.body.phoneNumber});
        if(patient){
            return res.json({success: true, patientDetails: patient});
        }
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