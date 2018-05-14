
const express = require('express')
const routes = express.Router()
let usercontroller = require('../controllers/User_controller')

routes.post('/login',usercontroller.LoginUser)
routes.post('/register',usercontroller.registerUser)
routes.post('/studentenhuis',)
routes.get('/studentenhuis',)
routes.get('/studentenhuis/:id',)
routes.put('/stdentenhuis/:id',)
routes.delete('studentenhuis/:id',)
routes.post('/studentenhuis/:id/maaltijd',)
routes.get('/studentenhuis/:id/maaltijd',)
routes.get('/studentenhuis/:id/maaltijd/:maaltijdid',)
routes.put('/studentenhuis/:id/maaltijd/:maaltijdid',)
routes.delete('/studentenhuis/:id/maaltijd/:maaltijdid',)
routes.post('/studentenhuis/:id/maaltijd/:maaltijdid',)
routes.get('/studentenhuis/:id/maaltijd/:maaltijdid/deelnemers',)
routes.delete('/studentenhuis/:id/maaltijd/:maaltijdid/deelnemers',)

module.exports = routes;