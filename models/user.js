const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: [true, 'El nombre de usuario ya existe'],
		minlength: [3, 'El nombre de usuario debe tener al menos 3 caracteres']
	},
	name: String,
	passwordHash: {
		type: String,
		required: true
	},
	blogs: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Blog'
		}
	]
}, {
	versionKey: false
})

userSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject._id = returnedObject._id.toString()
		delete returnedObject.passwordHash
	}
})

module.exports = mongoose.model('User', userSchema)