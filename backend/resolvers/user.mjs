import bcrypt from 'bcrypt';

import User from '../database/models/user.js';
import Flight from '../database/models/flight.js';

export const userResolver = {
	Query: {
		users: async () => {
			try {
				const users = await User.find({}).populate('flights');
				return users;
			} catch (err) {
				console.error(err);
				throw new Error('An error occurred while fetching users');
			}
		},
		userById: async (_, { id }) => {
			try {
				const user = await User.findById(id).populate('flights');
				return user;
			} catch (err) {
				console.error(err);
				throw new Error('An error occurred while fetching user');
			}
		},
		userByEmail: async (_, { email }) => {
			try {
				const user = await User.findOne({ email: email }).populate('flights');
				return user;
			} catch (err) {
				console.error(err);
				throw new Error('An error occurred while fetching user');
			}
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

				let flightId;

				if (!newFlight) {
					const createdFlight = await Flight.create({
						flightNumber: flight.flightNumber,
						flightDate: flight.flightDate,
					});
					flightId = createdFlight._id;
				} else {
					flightId = newFlight._id;
				}

				const hashedPassword = await bcrypt.hash(user.password, 12);
				const newUser = new User({
					email,
					password: hashedPassword,
					flights: [flightId],
				});

				const result = await newUser.save();

				await Flight.findByIdAndUpdate(
					flightId,
					{ $push: { users: result._id } },
					{ new: true, useFindAndModify: false }
				);
				return result.populate('flights');
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
