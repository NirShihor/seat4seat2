const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
	flightNumber: {
		type: String,
		required: true,
	},
	flightDate: {
		type: Date,
		required: true,
	},
	users: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
	],
});

module.exports = mongoose.model('Flight', flightSchema);
