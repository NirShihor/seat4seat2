import userTypeDefs from './user.mjs';
import flightTypeDefs from './flight.mjs';

const typeDefs = `#graphql
	
	type Query {
		_: String
	}
	type Mutation {
		_: String
	}
`;
export default [typeDefs, userTypeDefs, flightTypeDefs];
