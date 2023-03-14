const userTypeDefs = `#graphql

extend type Query {
        users: [User]
        userById(id: ID!): User
        userByEmail(email: String!): User
    }
    extend type Mutation {
        createUser(user: UserInput!): User!
    }

    input FlightInput {
        flightNumber: String!
        flightDate: String!
    }

    input UserInput {
        email: String!
        password: String!
        flight: FlightInput
    }
    
    type User {
        id: ID!
        email: String!
        password: String!
        flight: Flight
        flights: [Flight]
    }
`;

export default userTypeDefs;
