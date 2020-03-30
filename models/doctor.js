const mongoose = require('mongoose');

/* DOCTOR SCHEMA */
const doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    patients: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient'
    }]
}, {timestamps: true});

module.exports = mongoose.model('Doctor', doctorSchema);