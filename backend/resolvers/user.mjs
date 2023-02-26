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
			try {
				const { email, password, flight } = user;
				const alreadyUser = await User.findOne({ email: user.email });
				if (alreadyUser) {
					throw new Error('User already exists');
				}

				const newFlight = await Flight.findOne({
					flightNumber: flight.flightNumber,
					flightDate: flight.flightDate,
				});

				if (!newFlight) {
					const createdFlight = await Flight.create({
						flightNumber: flight.flightNumber,
						flightDate: flight.flightDate,
					});
					const newUser = new User({
						email,
						password,
						flight: createdFlight._id,
					});
					const result = await newUser.save();

					return result.populate('flight');
				}

				const newUser = new User({ email, password, flight: newFlight._id });
				const result = await newUser.save();

				return result.populate('flight');
			} catch (err) {
				console.error(err);
				if (err.message === 'User already exists') {
					throw err;
				}
				throw new Error('An error occurred while creating a new user');
			}
		},
	},
};
