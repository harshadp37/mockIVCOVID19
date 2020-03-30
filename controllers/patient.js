const Doctor = require('./../models/doctor');
const Patient = require('./../models/patient');
const Report = require('./../models/report');

/* CREATE REPORT FOR SPECIFIC PATIENT */
module.exports.createReport = async (req, res)=>{
    /* STATUS OF PATIENT REQUIRED */
    if(!req.body.status){
        return res.json({success: false, message: "All Fields(Status) Required."});
    }
    try {
        /* CHECK WHETHER STATUS VALUE IS VALID */
        if(!Report.schema.path('status').enumValues.includes(req.body.status)){
            throw new Error("Status value is not valid. Use value from this array : " + Report.schema.path('status').enumValues)
        }

        /* GET PATIENT WITH THE HELP OF ID PASSED IN PARAMS */
        const patient = await Patient.findOne({_id: req.params.id});

        /* IF PATIENT IS NOT EXISTS THEN THROW NEW ERROR */
        if(!patient){
            throw new Error("Patient is Not Found.");
        }

        /* IF PATIENT IS EXISTS THEN CREATE NEW REPORT & ALSO PUSH THAT REPORT IN PATIENT'S REPORT */
        const doctor = await Doctor.findOne({_id: req.user});
        if(!doctor){
            throw new Error("Doctor is Not Found.");
        }

        /* CREATE NEW REPORT */
        const newReport = await Report.create({
            createdBy: doctor,
            relatedTo: patient,
            status: req.body.status
        })

        /* PUSH NEW REPORT IN PATIENT'S REPORT */
        patient.reports.push(newReport);
        patient.save();

        /* SUCCESS RESPONSE */
        return res.json({success: true, message: "Report Created Successfully!!"});

    } catch (e) {
        /* ERROR RESPONSE */
        console.error("Error while Creating report.");
        return res.json({success: false, message: "Error while creating report." + e});
    }
}

/* GET ALL REPORTS OF SPECIFIC PATIENT */
module.exports.allReports = async (req, res)=>{
    try {
        /* GET PATIENT WITH THE HELP OF ID PASSED IN PARAMS */
        /* QUERY DESCRIPTION : POPULATED REPORTS, SORT THEM LATEST TO OLDEST, THEN POPULATE DOCTOR & PATIENT OF EACH REPORT */
        const patient = await Patient.findOne({_id: req.params.id}).populate({path: 'reports', options: {sort: {createdAt: -1}}, populate: [{path: 'createdBy', select: 'name -_id'}, {path: 'relatedTo', select: 'name -_id'}]})

        /* IF PATIENT IS NOT EXISTS THEN THROW NEW ERROR */
        if(!patient){
            throw new Error("Patient is Not Found.");
        }

        /* SUCCESS RESPONSE */
        res.json({success: true, Patient_Name: patient.name, reports: patient.reports});
        
    } catch (e) {
        /* ERROR RESPONSE */
        console.error("Error while Fetching reports of patient.");
        return res.json({success: false, message: "Error while Fetching reports of patient." + e});
    }
}