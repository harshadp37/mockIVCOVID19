const mongoose = require('mongoose');

/* REPORT SCHEMA */
const reportSchema = new mongoose.Schema({
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    relatedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true,
    },
    status: {
        type: String,
        enum : ['Negative', 'Travelled-Quarantine', 'Symptoms-Quarantine', 'Positive-Admit'],
        required: true,
    },
}, {timestamps: true});

module.exports = mongoose.model('Report', reportSchema);