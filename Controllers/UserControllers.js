const { uploadImage } = require('../middlewares/CloudinaryUpload');
const userModals = require('../Models/userModals');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const validateName = (name)=> {
    const fullNameRegex = /^([a-zA-Z]+(?: [a-zA-Z]+)?)(?: ([a-zA-Z]+))? ([a-zA-Z]+)$/;
    return fullNameRegex.test(name)
}
const validateEmail = (email)=> {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email)
}
const validatePassword = (password)=> {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password)
}

function createToken( userDetails) {
  return jwt.sign(
    userDetails, 
    process.env.JWT_KEY
  );
}


module.exports.postSignin = async (req, res, next)=>{
    try {
        let imageUrl;
        if(req.files)
            imageUrl = (await uploadImage(req.files.userProfile.tempFilePath)).secure_url;

        console.log("after image upload in post signin")
        
        const {name, email, password} = req.body;
        if(validateName(name) && validateEmail(email) && validatePassword(password)){
            // add user to the db
            let isAlreadyUsed = await userModals.findOne({email: email});
            if(isAlreadyUsed) {
                let err = new Error("Email already associated with another account.");
                err.status = 409;
                throw err;
            }
            let userDetails = {
                name, 
                email, 
                password
            }
            if(imageUrl) 
                userDetails.userProfile = imageUrl

            let user = await userModals.create(userDetails)
            const jwtToken =  createToken({email, _id: user._id});
            console.log("we are here ", jwtToken)
            res.cookie("userToken", jwtToken);
            res.send({user});
        }
        else {
            let err = new Error("User input not valid");
            err.status = 400
            throw err;
        }
        
    } catch (error) {
        let status, message;
        if(error.status) status = error.status;
        message = error.message;
        next({ status, message})
    }

}

module.exports.postLogin = async (req, res, next) => {
    try {
        const {email, password} = req.body;
        let user = await userModals.findOne({email});
        if(user && !user.isBlocked){
            if(await bcrypt.compare(password, user?.password)){
                const jwtToken = createToken({email, _id: user._id});
                res.cookie("userToken", jwtToken);
                res.send();
                return;
            }
        }
        else if(user && user.isBlocked){
            let err = new Error("Account blocked from the platform.")
            err.status = 401
            throw err;
        }
        let err = new Error("Incorrect email or password.");
        err.status = 400
        throw err;
    } catch (error) {
        next({
            status: error.status ? error.status : 500, 
            messsage: error.message
        })  
    }
}

module.exports.postUpdateUser = async (req, res, next) => {
    try {
        let {name} = req.body
        let file = req.files;
        
        if(validateName(name)){
            let updateUser = {
                name: name, 
            }
            let imageUrl;
            if(req.files){
                imageUrl = (await uploadImage(req.files.userProfile.tempFilePath)).secure_url;
                updateUser.userProfile = imageUrl
            }

            const user = await userModals.findByIdAndUpdate( req.userDetails._id, updateUser, {new : true})
            res.send(user)
            return;
        }
        let err = new Error("Invalid data!")
        err.status = 400
        throw err;
    } catch (error) {
        next( {
            status : error.status ? error.status : 500,
            message : error.message
        })
    }
}



