import bcrypt from 'bcrypt';

import User from '../database/models/user.js';
import Flight from '../database/models/flight.js';

export const userResolver = {
	Query: {
		users: async () => {
			try {
				const users = await User.find({});
				return users;
			} catch (err) {
				console.error(err);
				throw new Error('An error occurred while fetching users');
			}
		},
		userById: async (_, { id }) => {
			try {
				const user = await User.findById(id);
				console.log('USER', user);
				return user;
			} catch (err) {
				console.error(err);
				throw new Error('An error occurred while fetching user');
			}
		},
		userByEmail: async (_, { email }) => {
			try {
				const user = await User.findOne({ email: email });
				return user;
			} catch (err) {
				console.error(err);
				throw new Error('An error occurred while fetching user');
			}
		},
	},

	Mutation: {
		createUser: async (_, { user: input }) => {
			try {
				const { email, password, flight } = input;
				const { flightNumber, flightDate, seatSwaps } = flight;
				if (!flightNumber || !flightDate) {
					throw new Error('Flight information is missing');
				}

				const alreadyUser = await User.findOne({ email });
				if (alreadyUser) {
					throw new Error('User already exists');
				}

				const newFlight = await Flight.findOne({
					flightNumber: flightNumber,
					flightDate: flightDate,
				});

				let flightId;
				if (!newFlight) {
					const createdFlight = await Flight.create({
						flightNumber: flightNumber,
						flightDate: flightDate,
					});
					flightId = createdFlight._id;
				} else {
					flightId = newFlight._id;
				}

				const hashedPassword = await bcrypt.hash(password, 12);
				const newUser = new User({
					email,
					password: hashedPassword,
					flight: [
						{
							flightId,
							seatSwaps: seatSwaps,
						},
					],
				});

				const result = await newUser.save();

				const userFlight = await Flight.findOne({
					_id: result.flight[0].flightId,
				});

				await Flight.findByIdAndUpdate(
					userFlight._id,
					{ $push: { users: result._id } },
					{ new: true, useFindAndModify: false }
				);

				const userCreated = await User.findById(result._id).populate(
					'flight.flightId'
				);

				console.log('USERCREATED: ', userCreated);

				return userCreated;
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
