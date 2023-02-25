const userTypeDefs = `#graphql

    extend type Query {
        users: [User]
    }

    extend type Mutation {
        createUser(user: UserInput!): User!
    }

    input UserInput {
        email: String!
        password: String!
        flight: ID
    }

    type User {
        id: ID!
        email: String!
        password: String!
        flight: Flight
    }
`;

export default userTypeDefs;
