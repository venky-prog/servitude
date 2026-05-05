import { ApolloServer } from '@apollo/server';
import { me } from './resolvers/me';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { loadTypeDefs, createApp } from '@servitude/config';
import path from 'node:path';
import { createUser } from './resolvers/create-user';
import { connectToDb } from '@servitude/database';
import { updateUser } from './resolvers/update-user';
import { login } from './resolvers/login';

const port = process.env.PORT ? Number(process.env.PORT) : 3000;

(async () => {
  const apolloServer = new ApolloServer({
    schema: buildSubgraphSchema([
      {
        typeDefs: await loadTypeDefs(
          path.join(__dirname, 'schema', 'user.graphql'),
        ),
        resolvers: {
          Query: {
            me: me!,
          },
          Mutation: {
            createUser: createUser!,
            updateUser: updateUser!,
            login: login!,
          },
        },
      },
    ]),
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
