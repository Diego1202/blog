const { Router } = require('express')
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const blogRouter = Router()

const verify = (req, res) => {
	const decodedToken = jwt.verify(req.token, process.env.SECRET)
	if (!decodedToken.id) return res.status(401).json({ error: 'token invalido' })
	return decodedToken
}

blogRouter.get('/', async (req, res, next) => {
	try {
		if (req.token) {
			const token = verify(req, res, next)
			await Blog
				.find({ user: token.id }).populate('user', { username: 1, name: 1 })
				.then(blogs => { res.status(200).json(blogs) })
		} else {
			await Blog
				.find().populate('user', { username: 1, name: 1 })
				.then(blogs => { res.status(200).json(blogs) })
		}
	} catch (error) {
		next(error)
	}
})

blogRouter.get('/:id', async (req, res, next) => {
	await Blog
		.findById(req.params.id)
		.then(blog => {
			if (blog) {
				res.status(200).json(blog)
			} else {
				res.status(404).json({ message: 'Not found' })
			}
		}).catch(error => next(error))
})

blogRouter.post('/', async (req, res, next) => {
	const { title, author, url, likes } = req.body
	const token = verify(req, res, next)

	const user = await User.findOne({ _id: token.id })
	if (!user) res.status(400).json({ error: 'User not found' })

	const blog = new Blog({
		title,
		author,
		url,
		likes,
		user: user._id
	})

	await blog
		.save()
		.then(async (result) => {
			user.blogs = user.blogs.concat(result._id)
			await user.save()
			res.status(201).json(result)
		}).catch(error => {
			res.status(400).send({ error })
		})
})

blogRouter.delete('/:id', async (req, res, next) => {
	await Blog
		.findByIdAndDelete(req.params.id)
		.then(() => {
			res.status(204).end()
		}).catch(error => next(error))
})

module.exports = blogRouter