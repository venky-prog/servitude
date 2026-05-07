import { defineConfig } from '@graphql-hive/gateway';

export const gatewayConfig  = defineConfig({
  supergraph: './src/supergraph.graphql',

  port: 4000,

  // optional: forward auth headers to subgraphs
  propagateHeaders: {
    fromClientToSubgraphs: ({ request }) => {
      console.log(
        'Propagating headers from client to subgraphs:',
        request.headers,
      );
      return {
        authorization: request.headers.get('authorization'),
      };
    },
  },
});
