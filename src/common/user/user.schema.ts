
import User from './user.model';

/**
 * Export a string which contains our GraphQL type definitions.
 */
export const userTypeDefs = `
 
  type User {
    id: ID!
    email: String!
    password: String!
    firstName: String!
    lastName: String
    # Last name is not a required field so it 
    # does not need a "!" at the end.
  }
  input UserFilterInput {
    limit: Int
  }
  # Extending the root Query type.
  extend type Query {
    users(filter: UserFilterInput): [User]
    user(id: String!): User
  }
  # We do not need to check if any of the input parameters
  # exist with a "!" character. This is because mongoose will
  # do this for us, and it also means we can use the same
  # input on both the "addUser" and "editUser" methods.
  input UserInput {
    email: String
    password: String
    firstName: String
    lastName: String
  }
  # Extending the root Mutation type.
  extend type Mutation {
    addUser(input: UserInput!): User
    editUser(id: String!, input: UserInput!): User
    deleteUser(id: String!): User
  }
`;

/**
 * Exporting our resolver functions. Note that:
 * 1. They can use async/await or return a Promise which
 *    Apollo will resolve for us.
 * 2. The resolver property names match exactly with the
 *    schema types.
 */
export const userResolvers = {
  Query: {
    users: async (_, { filter = {} }) => {
      const users: any[] = await User.find({}, null, filter);
      // notice that I have ": any[]" after the "users" variable?
      // That is because I am using TypeScript but you can remove
      // this and it will work normally with pure JavaScript
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