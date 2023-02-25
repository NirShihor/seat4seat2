import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import dotenv from 'dotenv';
import connection from './database/util/index.js';

import typeDefs from './typeDefs/index.mjs';
import resolvers from './resolvers/index.mjs';

dotenv.config({ path: './.env' });

connection();

const PORT = 4006;

const server = new ApolloServer({
	typeDefs,
	resolvers,
});

async function start() {
	const { url } = await startStandaloneServer(server, {
		listen: PORT,
	});

	console.log(`🚀 Server ready at ${url}`);
}

start();
