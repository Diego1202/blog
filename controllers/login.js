const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/user')

const { Router } = require('express')
const loginRouter = Router()


loginRouter.post('/', async (req, res) => {
	const { username, password } = req.body

	const user = await User.findOne({ username })

	const passwordCorrect = user === null ? false : await bcrypt.compare(password, user.passwordHash)

	if (!(passwordCorrect && user)) return res.status(401).json({ error: 'invalid username or password' })

	const userForToken = {
		username: user.username,
		id: user._id
	}

	const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: 60 * 20 })
	console.log(token)
	return res.status(200).json({ token, username: user.username, name: user.name })
})

module.exports = loginRouter