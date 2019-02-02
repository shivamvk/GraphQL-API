import User from './user.model';

export const userTypeDefs = `

  type User {
    _id: ID
    email: String
    password: String
    firstName: String
    lastName: String
  }

  input UserFilterInput {
    limit: Int
  }

  extend type Query {
    users(filter: UserFilterInput): [User]
    user(id: String!): User
  }

  input UserInput {
    email: String
    password: String
    firstName: String
    lastName: String
  }

  extend type Mutation {
    addUser(input: UserInput!): User
    editUser(id: String!, input: UserInput!): User
    deleteUser(id: String!): User
  }
`;

export const userResolvers = {
  Query: {
    users: async (_, { filter = {} }) => {
      const users: any[] = await User.find({}, null, filter);
      return users.map(user => user.toGraph());
    },
    user: async (_, { id }) => {
      const user: any = await User.findById(id);
      return user.toGraph();
    },
  },
  Mutation: {
    addUser: async (_, { input }) => {
      const user: any = await User.create(input);
      return user.toGraph();
    },
    editUser: async (_, { id, input }) => {
      const user: any = await User.findByIdAndUpdate(id, input);
      return user.toGraph();
    },
    deleteUser: async (_, { id }) => {
      const user: any = await User.findByIdAndRemove(id);
      return user ? user.toGraph() : null;
    },
  },
};
