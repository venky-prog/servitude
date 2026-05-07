import { composeServices } from '@theguild/federation-composition';
import { readFile, writeFile } from 'node:fs/promises';
import { gql } from 'graphql-tag';
import path from 'node:path';

async function generateSuperGraph() {
  console.log(process.env);
  const accountsSdl = await readFile(
    path.join(process.cwd(), '../accounts/src/schema/accounts.graphql'),
    'utf-8',
  );
  const userSdl = await readFile(
    path.join(process.cwd(), '../user/src/schema/user.graphql'),
    'utf-8',
  );

  const result = composeServices([
    {
      name: 'accounts',
      typeDefs: gql(accountsSdl),
      url: process.env.ACCOUNTS_SERVICE_URL,
    },
    {
      name: 'users',
      typeDefs: gql(userSdl),
      url: process.env.USER_SERVICE_URL,
    },
  ]);

  if (result.errors || !result.supergraphSdl) {
    console.log('Composition errors:', result.errors);
    throw new Error('Failed to compose services');
  }
  await writeFile(
    path.join(process.cwd(), './src/supergraph.graphql'),
    result.supergraphSdl,
    'utf-8',
  );
}

generateSuperGraph();
