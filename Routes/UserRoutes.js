const { Router } = require('express')
const route = Router();
const fileUpload = require("express-fileupload")


const UserControllers = require('../Controllers/UserControllers');
const { isLogged, isNotLogged } = require('../middlewares/userAuth');

route.post('/register', fileUpload({
    useTempFiles: true
    }), isNotLogged,  UserControllers.postSignin)

route.post('/login', isNotLogged, UserControllers.postLogin)

route.post('/update/user', fileUpload({
    useTempFiles: true
    }), isLogged, UserControllers.postUpdateUser)





route.get('/userNotLoggedIn', isNotLogged, (req, res) => {
    res.send()
})
route.get('/isUserLogged', isLogged, (req, res) => {
    res.send( req.userDetails )
})

module.exports = route;