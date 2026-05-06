import { ApolloServer } from '@apollo/server';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { loadTypeDefs, createApp } from '@servitude/config';
import path from 'node:path';
import { connectToDb } from '@servitude/database';
import resolvers from './resolvers';

const port = process.env.PORT ? Number(process.env.PORT) : 3000;

(async () => {
  const schema = buildSubgraphSchema([
    {
      typeDefs: await loadTypeDefs(
        path.join(__dirname, 'schema', 'user.graphql'),
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
    console.log(`[ ready ] http://localhost:${port}`);
  });
})();
