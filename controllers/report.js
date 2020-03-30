const Report = require('./../models/report');

/* GET ALL REPORTS BY STATUS */
module.exports.reportByStatus = async (req, res)=>{
    try {
        /* CHECK WHETHER STATUS VALUE IS VALID */
        if(!Report.schema.path('status').enumValues.includes(req.params.status)){
            throw new Error("Status value is not valid. Use value from this array : " + Report.schema.path('status').enumValues)
        }
        /* GET ALL REPORTS WITH THE HELP OF STATUS PASSED IN PARAMS */
        /* QUERY DESCRIPTION : SORT REPORTS LATEST TO OLDEST, THEN POPULATE DOCTOR & PATIENT OF EACH REPORT */
        const reports = await Report.find({status: req.params.status}).sort({createdAt: -1}).populate({path: 'createdBy', select: 'name -_id'}).populate({path: 'relatedTo', select: 'name -_id'});

        /* NO REPORTS FOUND WITH THAT STATUS */
        if(reports.length == 0){
            return res.json({success: true, message: "No Reports Found with Status : " + req.params.status});
        }

        /* SUCCESS RESPONSE */
        res.json({success: true, Status_Name: req.params.status, reports: reports});
        
    } catch (e) {
        /* ERROR RESPONSE */
        console.error("Error while Fetching reports of patient.");
        return res.json({success: false, message: "Error while Fetching reports of patient." + e});
    }
}