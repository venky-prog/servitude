import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: ['src/**/*.graphql'],
  generates: {
    'src/generated/graphql.ts': {
      plugins: ['typescript', 'typescript-resolvers'],
      config: {
        federation: true,
        contextType: '@servitude/config#Context',
        mappers: {
          Transaction: '../models/transaction.model#ITransaction', // 👈 map to your mongoose document type
        },
        scalars: {
          JSON: 'string',
          UUID: 'string',
          Date: 'string',
        },
      },
    },
  },
};

export default config;
