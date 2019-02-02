import { ApolloServer } from 'apollo-server';
import { makeExecutableSchema } from 'graphql-tools';
import * as mongoose from 'mongoose';
import { userResolvers, userTypeDefs } from './common/user/user.schema';
import { workspaceResolvers, workspaceTypeDefs } from './common/workspace/workspace.schema';
import config from './config'

mongoose.connect(
  config.mongodb.uri,
  { useNewUrlParser: true }
);

/**
 * We must define a root type so that our server knows where to
 * look when we query the server i.e. in the "root" types.
 */
const rootTypeDefs = `
  type Query
  type Mutation
  schema {
    query: Query
    mutation: Mutation
  }
`;

/**
 * Declare the schema which the will hold our GraphQL types and
 * resolvers.
 */
const schema = makeExecutableSchema({
  typeDefs: [rootTypeDefs, userTypeDefs, workspaceTypeDefs],
  resolvers: merge(userResolvers, workspaceResolvers),
});

/**
 * Create the server which we will send our GraphQL queries to.
 */
const server = new ApolloServer({
  schema,
  formatError(error) {
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
      // logging the errors can help in development
      console.log(error);
    }
    return error;
  },
});

/**
 * Turn the server on by listening to a port.
 * Defaults to: http://localhost:4000
 */
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
