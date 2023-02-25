const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	flight: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Flight',
	},
});

module.exports = mongoose.model('User', userSchema);
