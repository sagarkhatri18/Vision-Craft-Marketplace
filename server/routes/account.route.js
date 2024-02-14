var router = require('express').Router()
var accountController = require('../controllers/account.controller')

router.post('/login', accountController.login)
router.post('/register', accountController.register)
router.get('/account/verify/:id/:token', accountController.verify)

module.exports = router