const supertest = require('supertest')
const mongoose = require('mongoose')

const app = require('../app')
const api = supertest(app)

const { blogsInDb, initialBlogs } = require('../utils/list_helper')

describe('when there are initially some blogs saved', () => {
	test('blogs are returned as json', async () => {
		await api
			.get('/api/blogs')
			.expect(200)
			.expect('Content-Type', 'application/json; charset=utf-8')
	})

	test('all blogs are returned', async () => {
		const response = await api.get('/api/blogs')
		const identify = response.body.map(n => n.id)

		expect(identify).toBeDefined()
	})
})

describe('viewing a specific blog', () => {
	test('succeeds with a valid id', async () => {
		const blogStart = await blogsInDb()
		const blog = blogStart[0]

		const response = await api
			.get(`/api/blogs/${blog.id}`)
			.expect(200)
			.expect('Content-Type', 'application/json; charset=utf-8')

		expect(response.body).toEqual(blog)
	})

	test('fails with statuscode 404 if note does not exist', async () => {
		const id = '5a3ed99f9f9f9f9f9f9f9f9f'
		await api
			.get(`/api/blogs/${id}`)
			.expect(404)
			.expect('Content-Type', 'application/json; charset=utf-8')
	})

	test('fails with statuscode 400 if id is invalid', async () => {
		const id = '5a3ed99f9f9f9f9f9f9f9ff'
		await api
			.get(`/api/blogs/${id}`)
			.expect(400)
			.expect('Content-Type', 'application/json; charset=utf-8')
	})
})

describe('Addition of a new blog', () => {
	const newBloge = {
		'title': 'Canonical string reduction',
		'author': 'Edsger W. Dijkstra',
		'url': 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
		'likes': 12
	}
	test('a valid blog can be added', async () => {
		const newBlog = {
			title: 'test blog',
			author: 'test author',
			url: 'test url',
			likes: 3
		}

		await api
			.post('/api/blogs')
			.send(newBlog)
			.expect(201)
			.expect('Content-Type', /application\/json/)

		const blogsAtEnd = await blogsInDb()
		expect(blogsAtEnd).toHaveLength(initialBlogs.length + 1)
	})

	test('a valid blog can be added default likes', async () => {
		const newBlog = {
			title: newBloge.title,
			author: newBloge.author,
			url: newBloge.url
		}

		const response = await api
			.post('/api/blogs')
			.send(newBlog)
			.expect(201)
			.expect('Content-Type', /application\/json/)

		expect(response.body.likes).toBe(0)
	})

	test('a valid blog to title and url', async () => {
		const newBlog = {
			author: '',
		}

		await api
			.post('/api/blogs')
			.send(newBlog)
			.expect(400)
	})

})

describe('deletion of a blog', () => {
	test('succeeds with status code 204 if id is valid', async () => {
		const blogsAtStart = await blogsInDb()
		const blogToDelete = blogsAtStart[1]

		await api
			.delete(`/api/blogs/${blogToDelete.id}`)
			.expect(204)

		const blogsAtEnd = await blogsInDb()
		expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)

		const titles = blogsAtEnd.map(r => r.title)

		expect(titles).not.toContain(blogToDelete.title)
	})
})

afterAll(async () => {
	await mongoose.connection.close()
})