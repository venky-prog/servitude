import { loadTypeDefs, createApp } from '@servitude/config';
import { ApolloServer } from '@apollo/server';
import { connectToDb } from '@servitude/database';
import { buildSubgraphSchema } from '@apollo/subgraph';
import path from 'node:path';
import resolvers from './resolvers';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

(async () => {
  const schema = buildSubgraphSchema([
    {
      typeDefs: await loadTypeDefs(
        path.join(__dirname, 'schema', 'accounts.graphql'),
      ),
      resolvers,
    },
  ]);

  const apolloServer = new ApolloServer({
    schema,
  });

  await apolloServer.start();

  const app = createApp(apolloServer);

  await connectToDb(
    process.env.MONGO_URI || 'mongodb://localhost:27017/servitude',
  );

  app.listen(port, () => {
    console.log(`[ ready ] http://${host}:${port}`);
  });
})();
