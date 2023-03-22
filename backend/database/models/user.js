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
	flight: [
		{
			flightId: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Flight',
			},
			seatSwaps: {
				seatUsing: {
					type: String,
					required: true,
				},
				seatToSwap: {
					type: String,
					required: true,
				},
				seatsWanted: [
					{
						type: String,
						required: true,
					},
				],
			},
		},
	],
});

module.exports = mongoose.model('User', userSchema);
