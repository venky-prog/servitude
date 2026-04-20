import express from 'express';
import { readFileSync } from 'node:fs';
import { ApolloServer } from '@apollo/server';
import { me } from './resolvers/me';
import { expressMiddleware } from '@as-integrations/express5';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();

const typeDefs = readFileSync('./schema/user.graphql', 'utf-8');

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers: {
    Query: {
      me,
    },
  },
});

apolloServer.start().then(() => {
  app.use('/graphql', express.json(), expressMiddleware(apolloServer));
  app.get('/', (req, res) => {
    res.send({ message: 'Hello API' });
  });

  app.listen(port, host, () => {
    console.log(`[ ready ] http://${host}:${port}`);
  });
});
