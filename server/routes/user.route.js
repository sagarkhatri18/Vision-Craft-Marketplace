const router = require('express').Router()
const userController = require('../controllers/user.controller')

router.get('/', userController.index)
router.get('/:id', userController.find)
router.delete('/:id', userController.delete)
router.get('/add', userController.addNewUser)

module.exports = router