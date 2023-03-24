const flightTypeDefs = `#graphql

    extend type Query {
        flight: [Flight]
    }

    extend type Mutation {
        createFlight(flight: FlightInput!): Flight!
    }

    input FlightInput {
        flightNumber: String!
        flightDate: String!
        user: ID
    }

    type Flight {
        id: ID!
        flightNumber: String!
        flightDate: String!
        users: [User!]
        seatsBucket: [String]
    }
`;

export default flightTypeDefs;
