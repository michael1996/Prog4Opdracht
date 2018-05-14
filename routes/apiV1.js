
const express = require('express')
const routes = express.Router()
let usercontroller = require('../controllers/User_controller')
let dormcontroller = require('../controllers/Dorm_controller')
const auth =  require('../auth/authentication');
routes.all(new RegExp("[^(\/loginrgste)]"), function (req, res, next) {

    //
    console.log("VALIDATE TOKEN")

    var token = (req.header('X-Access-Token')) || '';

    auth.decodeToken(token, (err, payload) => {
        if (err) {
            console.log('Error handler: ' + err.message);
            res.status((err.status || 401 )).json({error: new Error("Not authorised").message});
        } else {
            next();
        }
    });
});
routes.route('/login').post(usercontroller.LoginUser);
routes.route('/register').post(usercontroller.registerUser);
routes.post('/studentenhuis',dormcontroller.createDorm)
routes.get('/studentenhuis',dormcontroller.getDorms)
routes.get('/studentenhuis/:id',dormcontroller.getDorm)
routes.put('/studentenhuis/:id',dormcontroller.updateDorm)
routes.delete('/studentenhuis/:id',dormcontroller.deleteDorm)
routes.post('/studentenhuis/:id/maaltijd',)
routes.get('/studentenhuis/:id/maaltijd',)
routes.get('/studentenhuis/:id/maaltijd/:maaltijdid',)
routes.put('/studentenhuis/:id/maaltijd/:maaltijdid',)
routes.delete('/studentenhuis/:id/maaltijd/:maaltijdid',)
routes.post('/studentenhuis/:id/maaltijd/:maaltijdid',)
routes.get('/studentenhuis/:id/maaltijd/:maaltijdid/deelnemers',)
routes.delete('/studentenhuis/:id/maaltijd/:maaltijdid/deelnemers',)

module.exports = routes;