const userModals = require("../Models/userModals");
const { uploadImage } = require("../middlewares/CloudinaryUpload");
const jwt = require("jsonwebtoken")


const validateName = (name)=> {
    const fullNameRegex = /^([a-zA-Z]+(?: [a-zA-Z]+)?)(?: ([a-zA-Z]+))? ([a-zA-Z]+)$/;
    return fullNameRegex.test(name)
}


function createToken( userDetails) {
  return jwt.sign(
    userDetails, 
    process.env.JWT_Admin_KEY
  );
}


module.exports.getAllUsers = async (req, res, next)=>{
    try {
        const users = await userModals.find({}, {password: 0});
        res.send(users)
    } catch (error) {
        next({
            status: 500, 
            message: error.message
        })
    }
}

module.exports.getAllUsersSearch = async (req, res, next)=>{
    try {
        const searchKey = new RegExp(`^${req.body.searchKey}`, 'i');
        console.log(searchKey)
        const users = await userModals.find({$or: [{name: searchKey}, {email: searchKey}]}, {password: 0});
        res.send(users)
    } catch (error) {
        next({
            status: 500, 
            message: error.message
        })
    }
}

module.exports.patchUpdateUser = async (req, res, next) => {
    try {
        let {name, email} = req.body
        let file = req.files;
        
        console.log(name)
        if(validateName(name)){
            console.log("here")
            let updateUser = {
                name: name, 
            }
            let imageUrl;
            if(req.files){
                imageUrl = (await uploadImage(req.files.userProfile.tempFilePath)).secure_url;
                updateUser.userProfile = imageUrl
            }

            
            console.log(updateUser)
            const user = await userModals.findOneAndUpdate( {email: email}, updateUser, {new : true})
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

module.exports.postLogin = async (req, res, next) => {
    try {
        const {email, password} = req.body;
        if(email == process.env.ADMIN_EMAIL && password == process.env.ADMIN_PASSWORD){
            const jwtToken = createToken({email});
            res.cookie("adminToken", jwtToken);
            res.send();
            return;
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

module.exports.putBlockUnblockUser = async(req, res, next) => {
    try {
        let {userId} = req.body;
        if(!userId){
            let err = new Error("Please provide necessary data");
            err.status = 400;
            throw err;
        }
        const user = await userModals.findById(userId)
        console.log(user)
        const updatedUser = await userModals.findByIdAndUpdate(userId, { isBlocked : !user.isBlocked}, {new: true})
        res.send({isBlocked: updatedUser.isBlocked})

    } catch (error) {
        next( {
            status: error.status ? error.status : 500, 
            message: error.message
        })
    }
}