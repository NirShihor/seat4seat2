import Flight from '../database/models/flight.js';
import User from '../database/models/user.js';

export const flightResolver = {
	Query: {
		flights: async () => {
			try {
				const flights = await Flight.find({}).populate('users');
				return flights;
			} catch (err) {
				console.error(err);
				throw new Error('An error occurred while fetching flights');
			}
		},
	},

	Mutation: {
		createFlight: async (_, { flight }) => {
			try {
				const newFlight = new Flight(flight);
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
			const users = await User.find({ flight: parent.id });
			return users;
		},
	},
};
