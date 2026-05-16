import { composeServices } from '@theguild/federation-composition';
import { readFile, writeFile } from 'node:fs/promises';
import { gql } from 'graphql-tag';
import path from 'node:path';

async function generateSuperGraph() {
  const accountsSdl = await readFile(
    path.join(process.cwd(), '../accounts/src/schema/accounts.graphql'),
    'utf-8',
  );
  const userSdl = await readFile(
    path.join(process.cwd(), '../users/src/schema/users.graphql'),
    'utf-8',
  );
  const transactionSdl = await readFile(
    path.join(process.cwd(), '../transactions/src/schema/transactions.graphql'),
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
    {
      name: 'transactions',
      typeDefs: gql(transactionSdl),
      url: process.env.TRANSACTIONS_SERVICE_URL,
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
