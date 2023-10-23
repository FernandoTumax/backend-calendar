const { response } = require('express')
const jwt = require('jsonwebtoken')

const jwtValidator = (req, res = response, next) => {

    // Como voy a recibir el jwt (x-token Headers)

    const token = req.header('x-token')

    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la peticion'
        })
    }

    try {

        const { uid, name } = jwt.verify(
            token,
            process.env.SECRET_JWT_SEED
        )

        req.uid = uid
        req.name = name

    } catch (e) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no valido'
        })
    }

    next()
}

module.exports = {
    jwtValidator
}