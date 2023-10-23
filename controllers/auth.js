const { response } = require('express')
const bcrypt = require('bcryptjs')
const { validationResult } = require('express-validator')
const { generarJWT } = require('../helpers/jwt')

const Usuario = require('../models/User')

const createUser = async(req, res = response) => {

    const { email, password } = req.body

    try {

        let usuario = await Usuario.findOne({ email })

        if (usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario ya existe con ese correo'
            })
        }

        usuario = new Usuario( req.body )

        // Encriptar contraseña

        const salt = bcrypt.genSaltSync()

        usuario.password = bcrypt.hashSync(password, salt)

        await usuario.save()

        // Generar JWT

        const token = await generarJWT(usuario.id, usuario.name)

        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })

    } catch (e) {
        console.log(e)
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        })
    }
}

const loginUser = async(req, res = response) => {

    const { email, password } = req.body

    try {

        const usuario = await Usuario.findOne({ email })

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'El email o password no son correctos'
            })
        }

        const validPassword = bcrypt.compareSync(password, usuario.password)

        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'El email o password no son correctos'
            })
        }

        // Generar nuestor JWT

        const token = await generarJWT(usuario.id, usuario.name)

        res.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })

    } catch (e) {
        console.log(e)
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        })
    }
}

// SI SE NECESITA QUE TODOS LOS USUARIOS VUELVA A GENERAR TOKEN CAMBIAR EL SECRET KEY

const revalidToken = async(req, res = response) => {

    const uid = req.uid
    const name = req.name

    const token = await generarJWT(uid, name)

    res.json({
        ok: true,
        token
    })
}

module.exports = {
    createUser,
    loginUser,
    revalidToken
}