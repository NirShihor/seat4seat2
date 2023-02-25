import User from '../database/models/user.js';
import Flight from '../database/models/flight.js';

export const userResolver = {
	Query: {
		users: async () => {
			const users = await User.find({}).populate('flight');
			return users;
		},
	},

	Mutation: {
		createUser: async (_, { user }) => {
			const { email, password, flight } = user;
			const newFlight = await Flight.fineOne({
				flightNumber: flight.flightNumber,
				flightDate: flight.flightDate,
			});

			const newUser = new User({ email, password, flight: newFlight._id });
			const result = await newUser.save();

			return result.populate('flight');
		},
	},
};
