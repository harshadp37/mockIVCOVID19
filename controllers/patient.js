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
        const newReport = await Report.create({
            createdBy: doctor,
            relatedTo: patient,
            status: req.body.status
        })
        patient.reports.push(newReport);
        patient.save();
        return res.json({success: true, message: "Report Created Successfully!!"});
    } catch (e) {
        console.error("Error while Creating report.");
        return res.json({success: false, message: "Error while creating report." + e});
    }
}

/* GET ALL REPORTS OF SPECIFIC PATIENT */
module.exports.allReports = (req, res)=>{
    
}