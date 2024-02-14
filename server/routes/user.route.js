var router = require('express').Router()
var userController = require('../controllers/user.controller')

router.get('/', userController.index)
router.get('/add', userController.addNewUser)

module.exports = router