import express from 'express';
import { readFileSync } from 'node:fs';
import { ApolloServer } from '@apollo/server';
import { me } from './resolvers/me';
import { expressMiddleware } from '@as-integrations/express5';
import { buildSubgraphSchema } from '@apollo/subgraph';
import gql from 'graphql-tag';
import path from 'node:path';
import { createUser } from './resolvers/create-user';
import { connectToMongoDB } from './utils/mongo-connect';
import { updateUser } from './resolvers/update-user';
import { login } from './resolvers/login';

const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const typeDefs = readFileSync(path.join(__dirname, 'schema', 'user.graphql'), 'utf8');

(async () => {
  const app = express();

  const apolloServer = new ApolloServer({
    schema: buildSubgraphSchema([
      {
        typeDefs: gql(typeDefs),
        resolvers: {
          Query: {
            me: me!,
          },
          Mutation: {
            createUser: createUser!,
            updateUser: updateUser!,
            login: login!
          }
        },
      },
    ]),
  });

  await apolloServer.start();

  app.use('/graphql', express.json(), expressMiddleware(apolloServer));
  app.get('/', (req, res) => {
    res.send({ message: 'Hello API' });
  });

  await connectToMongoDB(process.env.MONGO_URI || 'mongodb://localhost:27017/servitude');

  app.listen(port, () => {
    console.log(`[ ready ] http://localhost:${port}`);
  });
})();
