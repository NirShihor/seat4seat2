const userTypeDefs = `#graphql

extend type Query {
    users: [User]
    userById(id: ID!): User
    userByEmail(email: String!): User
  }

  extend type Mutation {
    createUser(user: UserInput!): User!
  }

  input SwapSeatsInput {
    seatUsing: String!
    seatToSwap: String!
    seatsWanted: [String]!
  }

  input FlightInput {
    flightNumber: String!
    flightDate: String!
    seatSwaps: SwapSeatsInput
  }

  input UserInput {
    email: String!
    password: String!
    flight: FlightInput!
  }

  type FlightInfo {
  id: ID!
  flightNumber: String!
  flightDate: String!
  seatSwaps: SeatSwaps
}

  type Flight {
  id: ID!
  flightId: FlightInfo!
  users: [User!]
  seatSwaps: SeatSwaps
}

  type User {
    id: ID!
    email: String!
    password: String!
    flights: [Flight]
  }

  type SeatSwaps {
    seatUsing: String!
    seatToSwap: String!
    seatsWanted: [String]!
  }

`;

export default userTypeDefs;
