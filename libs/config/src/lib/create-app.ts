import { ApolloServer } from '@apollo/server';
import express, { Express } from 'express';
import { expressMiddleware } from '@as-integrations/express5';
import { verifyToken } from './token';

export function createApp(apolloServer: ApolloServer): Express {
  const app = express();
  app.use('/graphql', express.json(), expressMiddleware(apolloServer, {
    context: async ({ req }) => {
      const token = req.headers.authorization?.split(' ')[1];
      const payload = await verifyToken(token || '');
      return { userId: payload?.userId, req };
    },
  }));
  app.use('/test', (req, res) => {
    res.send({ message: 'Hello API' });
  });
  return app;
}
