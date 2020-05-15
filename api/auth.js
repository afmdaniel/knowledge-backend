const { authSecret } = require('../.env')
const jwt = require('jwt-simple')
const bcrypt = require('bcrypt-nodejs')

module.exports = app => {
    const { existsOrError } = app.api.validation

    const signin = async (req, res) => {
        if (!req.body.email || !req.body.password) {
            return res.status(400).send("Informe usuário e senha!")
        }

        const user = await app.db('users').where({ email: req.body.email }).first()

        try {
            existsOrError(user, 'Usuário não encontrado!')
        } catch(msg) {
            res.status(400).send(msg)
        }

        const matchPassword = bcrypt.compareSync(req.body.password, user.password)
        if (!matchPassword) return res.status(401).send('Email e/ou senha inválidos')

        const currentDateInSeconds = Math.floor(Date.now() / 1000)
        const tokenExpInSeconds = 60 * 60 * 24 * 3

        const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
            admin: user.admin,
            iat: currentDateInSeconds,
            exp: currentDateInSeconds + tokenExpInSeconds
        }

        res.json({
            ...payload,
            token: jwt.encode(payload, authSecret)
        })
    }

    const validateToken = async (req, res) => {
        const userData = req.body || null
        try {
            if(userData){
                const token = jwt.decode(userData.token, authSecret)
                if (new Date(token.exp * 1000) > new Date()) {
                    return res.send(true)
                }
            }
        } catch(err) {
            // Token problem
        }

        res.send(false)
    }

    return { signin, validateToken}
}
