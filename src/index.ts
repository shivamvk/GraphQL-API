import { ApolloServer } from 'apollo-server';
import { makeExecutableSchema } from 'graphql-tools';
import * as mongoose from 'mongoose';
import { merge } from 'lodash';
import { userResolvers, userTypeDefs } from './common/user/user.schema';
import { workspaceResolvers, workspaceTypeDefs } from './common/workspace/workspace.schema';
import config from './config'

mongoose.connect(
  config.mongodb.uri,
  { useNewUrlParser: true }
);

/**
 * Define a root type so that server knows where to
 * look when it's queried.
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
 * Declare the schema which the will hold GraphQL types and
 * resolvers.
 */
const schema = makeExecutableSchema({
  typeDefs: [rootTypeDefs, userTypeDefs, workspaceTypeDefs],
  resolvers: merge(userResolvers, workspaceResolvers),
});

const server = new ApolloServer({
  schema,
  formatError(error) {
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
      console.log(error);
    }
    return error;
  },
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
