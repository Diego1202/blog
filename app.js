const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const blogRouter = require('./controllers/blog')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')
const usersRouter = require('./controllers/users')
const authRouter = require('./controllers/auth')

mongoose.set('strictQuery', false)

mongoose.connect(
	config.MONGODB_URI)
	.then(() => logger.info('Connected to mongoDB'))
	.catch(err => logger.error(err)
	)


app.set('x-powered-by', false)
app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)

app.use(middleware.tokenExtractor)

app.use('/api/blogs', blogRouter)
app.use('/api/users', usersRouter)
app.use('/api/auth', authRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

app.listen(config.PORT, () => logger.info(`Server running on port ${config.PORT}`))
