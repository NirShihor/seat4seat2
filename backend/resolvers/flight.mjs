import Flight from '../database/models/flight.js';
import User from '../database/models/user.js';

export const flightResolver = {
	Query: {
		flights: async () => {
			const flights = await Flight.find({}).populate('users');
			return flights;
		},
	},

	Mutation: {
		createFlight: async (_, { flight }) => {
			const newFlight = new Flight(flight);
			const result = await newFlight.save();
			return result;
		},
	},

	Flight: {
		users: async (parent) => {
			const users = await User.find({ flight: parent.id });
			return users;
		},
	},
};
