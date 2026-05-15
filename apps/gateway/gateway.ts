import { defineConfig } from '@graphql-hive/gateway';

export const gatewayConfig  = defineConfig({
  supergraph: './src/supergraph.graphql',

  port: 4000,

  // optional: forward auth headers to subgraphs
  propagateHeaders: {
    fromClientToSubgraphs: ({ request }) => {
      return {
        authorization: request.headers.get('authorization'),
      };
    },
  },
});
