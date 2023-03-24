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
	seatsBucket: [
		{
			type: String,
		},
	],
});

module.exports = mongoose.model('Flight', flightSchema);
