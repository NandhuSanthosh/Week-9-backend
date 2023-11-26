const jwt = require("jsonwebtoken");

module.exports.isLogged = async(req, res, next) => {
    const {adminToken} = req.cookies
    try {
        if(adminToken) {
            let admin = await jwt.verify(adminToken, process.env.JWT_ADMIN_KEY);
            if(admin.email){
                next();
                return;
            }
        }
        res.clearCookie('adminToken');
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
    const {adminToken} = req.cookies
    try {
        if(adminToken) {
            let admin = jwt.verify(adminToken, process.env.JWT_ADMIN_KEY);
            if(admin.email){
                let err = new Error("Looks like you are already logged in.")
                err.status = 409;
                throw err;
            }
            else res.clearCookie('adminToken')
        }
        next();
    } catch (error) {
        next({
            status: error.status ? error.status : 404, 
            message: error.message
        })
    }
}