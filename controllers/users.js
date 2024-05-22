const { Router } = require('express')
const bcrypt = require('bcrypt')
const User = require('../models/user')

const usersRouter = Router()

usersRouter.get('/', async (req, res) => {
	await User.find().populate('blogs', { title: 1, author: 1, url: 1, likes: 1 }).then(users =>
		res.status(200).json(users)
	)
})

usersRouter.post('/', async (req, res, next) => {
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

module.exports = usersRouter