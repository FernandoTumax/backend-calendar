/*
    Rutas de Usuarios / AUTH
    host + /api/auth
*/

const { Router } = require('express')
const { check } = require('express-validator')
const { createUser, revalidToken, loginUser } = require('../controllers/auth')
const { fieldValidator } = require('../middlewares/fieldValidator')
const { jwtValidator } = require('../middlewares/jwtValidator')

const router = Router()

router.post('/new', 
[
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password debe de ser de 6 caracteres o más').isLength({ min: 6 }),
    fieldValidator
],  createUser)

router.post('/', [
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password debe de ser de 6 caracteres o más').isLength({ min: 6 }),
    fieldValidator
], loginUser)

router.get('/renew', [ jwtValidator ],  revalidToken)

module.exports = router

