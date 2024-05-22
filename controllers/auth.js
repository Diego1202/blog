const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/user')

const { Router } = require('express')
const authRouter = Router()


authRouter.post('/sign-in', async (req, res) => {
	const { username, password } = req.body

	const user = await User.findOne({ username })

	const passwordCorrect = user === null ? false : await bcrypt.compare(password, user.passwordHash)

	if (!(passwordCorrect && user)) return res.status(400).json({ error: 'Nombre de usuario o contraseña incorrecta' })

	const userForToken = {
		username: user.username,
		id: user._id
	}

	const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: 60 * 20 })
	return res.status(200).json({ token, username: user.username, name: user.name })
})

authRouter.post('/sign-up', async (req, res, next) => {
	const { username, name, password } = req.body
	if (password.length < 3) return res.status(400).json({ error: 'La contraseña debe tener al menos 3 caracteres' })
	const passwordHash = await bcrypt.hash(password, 10)
	const user = new User({
		username,
		name,
		passwordHash
	})
	user.save().then(savedUser => {
		res.status(201).json(savedUser)
	}).catch(error => next(error))

})

module.exports = authRouter