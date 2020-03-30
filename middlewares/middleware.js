const jwt = require('jsonwebtoken');
const config = require('./../config');

/* AUTHENTICATE DOCTORS WITH THE HELP OF TOKEN GIVEN WHEN LOGGING */
module.exports.checkToken = (req, res, next)=>{
    if(req.headers.token){
        try {
            const decodedToken = jwt.verify(req.headers.token, config.secretKey);
            /* SET USER AS DOCTOR */
            req.user = decodedToken._id;
            next();
        } catch (e) {
            console.log("Token is not valid.")
            return res.json({success: false, message: "Token is not valid." + e})
        }
    }else{
        console.log("Route is Protected...This Route required Token.")
        return res.json({success: false, message: "Route is Protected...This Route required Token."})
    }
}