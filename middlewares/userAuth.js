const jwt = require("jsonwebtoken");
const userModals = require("../Models/userModals");

module.exports.isLogged = async(req, res, next) => {
    const {userToken} = req.cookies
    try {
        if(userToken) {
            let user = jwt.verify(userToken, process.env.JWT_KEY);
            if(user._id){
                const userDetails = await userModals.findOne({_id: user._id})
                req.userDetails = userDetails
                if(userDetails.isBlocked) { 
                    res.clearCookie('userToken');
                    let err = new Error("This account is blocked from the application.")
                    err.status = 401;
                    throw err;
                }
                else{
                    next();
                    return;
                }
            }
        }
        res.clearCookie('userToken');
        let err = new Error("Login required.")
        err.status = 401;
        throw err;

    } catch (error) {
        next({
            status: error.status ? error.status : 404, 
            message: error.message
        })
    }
}
module.exports.isNotLogged = (req, res, next) => {
    const {userToken} = req.cookies
    try {
        if(userToken) {
            let user = jwt.verify(userToken, process.env.JWT_KEY);
            if(user._id){
                const userDetails = userModals.findOne({_id: user._id})
                if(!userDetails.isBlocked) { 
                    let err = new Error("Looks like you are already logged in.")
                    err.status = 409;
                    throw err;
                }
            }
        }
        next();
    } catch (error) {
        next({
            status: error.status ? error.status : 404, 
            message: error.message
        })
    }
}