const jwt = require('jsonwebtoken');
const config = require('./../config');

module.exports.checkToken = (req, res, next)=>{
    if(req.headers.token){
        try {
            const decodedToken = jwt.verify(req.headers.token, config.secretKey);
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