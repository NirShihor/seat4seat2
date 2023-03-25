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
					flights: [
						{
							flight: flightId,
							seatSwaps: seatSwaps,
						},
					],
				});

				console.log('SEATTOSWAP', flight.seatSwaps.seatToSwap);

				const matchingFlight = await Flight.findOne({
					flightNumber: flightNumber,
					flightDate: flightDate,
				});
				console.log('MATHCING FLIGHT SEATBUCKET: ', matchingFlight.seatsBucket);

				if (!matchingFlight.seatsBucket.includes(flight.seatSwaps.seatToSwap)) {
					const result = await newUser.save();

					const latestFlight = result.flights.reduce((acc, flight) => {
						if (!acc || flight.createdAt > acc.createdAt) {
							return flight;
						}
						return acc;
					}, null);

					const userFlight = await Flight.findById(latestFlight.flight);

					await Flight.findByIdAndUpdate(
						userFlight._id,
						{
							$push: { users: result._id },
							$push: { seatsBucket: flight.seatSwaps.seatToSwap },
						},
						{ new: true, useFindAndModify: false }
					);

					const userCreated = await User.findById(result._id).populate(
						'flights.flight'
					);

					return userCreated;
				} else {
					throw new Error('Seat already taken');
				}
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
