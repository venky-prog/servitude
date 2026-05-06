import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
    overwrite: true,
    schema: ["src/**/*.graphql"],
    generates: {
        "src/generated/graphql.ts": {
            plugins: ["typescript", "typescript-resolvers"],
            config: {
                context: '@servitude/config#Context',
                federation: true,
                scalars: {
                    JSON: 'string',
                    UUID: 'string',
                    Date: 'string'
                },

            }
        },
    }
}

export default config;