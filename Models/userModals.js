const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: [true, "Please enter the name"], 
    }
    ,email: {
        type: String, 
        lowercase: true,
    },
    userProfile: {
        type: String, 
    }
    ,password: {
        type: String,
        required: [true, "Password not valid"],
    }
    ,createdAt:{
        type: Date, 
        immutable: true,
        default: ()=> Date.now()
    }
    ,isBlocked: {
        type: Boolean, 
        default: false
    }
    ,isVerified: {
        type: Boolean, 
        default: false
    }
})

userSchema.pre('save', async function(next){
    this.password = await bcrypt.hash(this.password, 10);
    next();
})




module.exports = mongoose.model('Users', userSchema);