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
				// if flight doesn't exist, create it
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

				const matchingFlight = await Flight.findOne({
					flightNumber: flightNumber,
					flightDate: flightDate,
				});

				if (!matchingFlight.seatsBucket.includes(flight.seatSwaps.seatToSwap)) {
					const result = await newUser.save();

					const latestFlight = result.flights.reduce((acc, flight) => {
						if (!acc || flight.createdAt > acc.createdAt) {
							return flight;
						}
						return acc;
					}, null);

					const userFlight = await Flight.findById(latestFlight.flight);

					// add user and seatToSwap to flight
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

					// check if any of the seatsWanted are available
					flight.seatSwaps.seatsWanted.forEach((seat) => {
						if (userFlight.seatsBucket.includes(seat)) {
							console.log(`SEAT ${seat} FOUND TO BE AVAILABLE TO SWAP!`);
							// execute swap
						} else {
							console.log(
								`SEAT ${seat} NOT FOUND TO BE AVAILABLE YET TO SWAP. WE WILL NOTIFY YOU WHEN IT BECOMES AVAILABLE.`
							);
						}
					});

					return userCreated;
				} else {
					throw new Error('The seat you are looking to get is already taken');
				}
			} catch (err) {
				console.error(err);
				if (err.message === 'User already exists') {
					throw err;
				}
				if (
					err.message === 'The seat you are looking to get is already taken'
				) {
					throw err;
				}
				throw new Error('An error occurred while creating a new user');
			}
		},
	},
};
