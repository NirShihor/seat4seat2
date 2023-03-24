import Flight from '../database/models/flight.js';
import User from '../database/models/user.js';

export const flightResolver = {
	Query: {
		flight: async () => {
			try {
				const flight = await Flight.find({}).populate('users');
				return flight;
			} catch (err) {
				console.error(err);
				throw new Error('An error occurred while fetching flights');
			}
		},
	},

	Mutation: {
		createFlight: async (_, { flight }) => {
			try {
				const newFlight = new Flight({
					flightNumber: flight.flightNumber,
					flightDate: flight.flightDate,
					seatsBucket: flight.seatsBucket,
				});
				const result = await newFlight.save();
				return result;
			} catch (err) {
				console.error(err);
				throw new Error('An error occurred while creating a new flight');
			}
		},
	},

	Flight: {
		users: async (parent) => {
			try {
				const users = await User.find({ flight: parent.id });
				return users;
			} catch (err) {
				console.error(err);
				throw new Error('An error occurred while fetching users');
			}
		},
	},
};
