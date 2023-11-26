const { Router } = require('express');
const { getAllUsers, patchUpdateUser, postLogin, putBlockUnblockUser, getAllUsersSearch } = require('../Controllers/AdminControllers');
const fileUpload = require('express-fileupload');
const { isNotLogged, isLogged } = require('../middlewares/adminAuth');

const route = Router();

route.post('/login', isNotLogged, postLogin)

route.get('/all_users', isLogged, getAllUsers)
route.post('/search_users', isLogged, getAllUsersSearch)
route.patch('/update/user', isLogged, fileUpload({
    useTempFiles: true
    }), patchUpdateUser)

route.put('/block/user', isLogged, putBlockUnblockUser)

route.get('/adminNotLoggedIn', isNotLogged, (req, res) => {
    res.send()
})
route.get('/isAdminLogged', isLogged, (req, res) => {
    res.send( req.userDetails )
})

module.exports = route;