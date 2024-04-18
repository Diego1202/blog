const lodash = require('lodash')
const blog = require('../models/blog')

const dummy = (blogs) => {
	return 1
}

const totalLikes = (blogs) => {
	const sum = blogs.map(e => { return e.likes })
	return sum.reduce((a, b) => { return a + b }, 0)
}

const favoriteBlog = (blogs) => {
	const result = blogs.reduce((a, b) => {
		return a.likes > b.likes ? a : b
	})
	console.log(result)
	return result.length > 1 ? result[0] : result
}

const mostBlogsAuthor = (blogs) => {
	const result = lodash.countBy(blogs, 'author')
	const maxVal = Math.max(...Object.values(result))
	const rs = Object.keys(result).find(key => result[key] === maxVal)
	return {
		author: rs,
		blogs: maxVal
	}
}

const mostLike = (blogs) => {
	let authorWithMostLikes = {}
	blogs.forEach(blog => blog.author in authorWithMostLikes
		? authorWithMostLikes[blog.author] += blog.likes // aumenta al contado
		: authorWithMostLikes[blog.author] = blog.likes // añade al autor
	)

	const maxValue = Math.max(...Object.values(authorWithMostLikes))
	const maxIndex = Object.keys(authorWithMostLikes).find(key => authorWithMostLikes[key] === maxValue)

	return {
		'author': maxIndex,
		'likes': maxValue
	}
}

const initialBlogs = [
	{
		id: '66120c0fda4bfd04b192f64a',
		title: 'React patterns',
		author: 'Michael Chan',
		url: 'https://reactpatterns.com/',
		likes: 7,
		createdAt: '2024-04-07T02: 59: 27.503 +00:00',
		updatedAt: '2024-04-07T02: 59: 27.503 +00:00',
	}
]

const blogsInDb = async () => {
	const notes = await blog.find({})
	const result = notes.map(note => note.toJSON())
	return result
}


module.exports = {
	dummy,
	totalLikes,
	favoriteBlog,
	mostBlogsAuthor,
	mostLike,
	blogsInDb,
	initialBlogs
}