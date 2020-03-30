const mongoose = require('mongoose');

/* PATIENT SCHEMA */
const patientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: Number,
        required: true,
        unique: true
    },
    assignedDoctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor'
    },
    reports: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Report'
    }]
}, {timestamps: true});

module.exports = mongoose.model('Patient', patientSchema);