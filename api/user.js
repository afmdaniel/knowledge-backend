const bcrypt = require('bcrypt-nodejs')

module.exports = app => {
    const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation

    const encryptPassaword = password => {
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(password, salt)
    }

    const save = async (req, res) => {
        const user = { ...req.body }
        let isDeletedUser = false

        if (req.params.id) user.id = req.params.id

        if(!req.originalUrl.startsWith('/users')) user.admin = false
        if(!req.user || !req.user.admin) user.admin = false

        try {
            existsOrError(user.name, "Nome não informado!")
            existsOrError(user.email, "E-mail não informado!")
            existsOrError(user.password, "Senha não informada!")
            existsOrError(user.confirmPassword, "Confirmação inválida!")
            equalsOrError(user.password, user.confirmPassword, "Senhas não conferem")

            const userFromDB = await app.db('users').where({ email: user.email }).first()
            isDeletedUser = userFromDB.deletedAt? true : false
            if (!user.id && !isDeletedUser) notExistsOrError(userFromDB, "Usuário já cadastrado")
        } catch (msg) {
            return res.status(400).send(msg)
        }

        user.password = encryptPassaword(req.body.password)
        delete user.confirmPassword

        if (user.id) {
            app.db('users')
                .update(user)
                .where({ id: user.id })
                .whereNull('deletedAt')
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else if (isDeletedUser) {
            user.deletedAt = null
            app.db('users')
                .update(user)
                .where( {email: user.email })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            app.db('users')
                .insert(user)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const get = (req, res) => {
        app.db('users')
            .select('id', 'name', 'email', 'admin')
            .whereNull('deletedAt')
            .orderBy('id')
            .then(users => res.json(users))
            .catch(err => res.status(500))
    }

    const getById = (req, res) => {
        app.db('users')
            .where('id', req.params.id)
            .select('id', 'name', 'email', 'admin')
            .whereNull('deletedAt')
            .first()
            .then(user => res.json(user))
            .catch(err => res.status(500))
    }

    const remove = async (req, res) => {
        try {
            const articles = await app.db('articles')
                .where({userId: req.params.id})
            notExistsOrError(articles, 'Usuário possui artigos.')

            const rowsUpdated = await app.db('users')
                .update({ deletedAt: new Date() })
                .whereNull('deletedAt')
                .where({ id: req.params.id })
            existsOrError(rowsUpdated, 'Usuário não foi encontrado.')

            res.status(204).send()
        } catch (err) {
            res.status(400).send(err)
        }
    }

    return { save, get, getById, remove }
}