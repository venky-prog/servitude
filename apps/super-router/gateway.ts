import { defineConfig } from '@graphql-hive/gateway';

export const gatewayConfig  = defineConfig({
  supergraph: {
    type: 'hive',
    endpoint: 'https://cdn.graphql-hive.com/artifacts/v1/36abf473-8cf1-47fc-bc65-e25d5f389e21',
    key: 'super-graph-hive',
  },

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
