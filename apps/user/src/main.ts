import express from 'express';
import { readFileSync, readSync } from 'node:fs';
import { ApolloServer } from '@apollo/server';
import { me } from './resolvers/me';
import { expressMiddleware } from '@as-integrations/express5';
import { buildSubgraphSchema } from '@apollo/subgraph';
import gql from 'graphql-tag';
import path from 'node:path';

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
        },
      },
    ]),
  });

  await apolloServer.start();

  app.use('/graphql', express.json(), expressMiddleware(apolloServer));
  app.get('/', (req, res) => {
    res.send({ message: 'Hello API' });
  });

  app.listen(port, () => {
    console.log(`[ ready ] http://localhost:${port}`);
  });
})();
