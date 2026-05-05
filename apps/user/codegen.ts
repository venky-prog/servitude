import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
    overwrite: true,
    schema: ["src/**/*.graphql"],
    generates: {
        "src/generated/graphql.ts": {
            plugins: ["typescript", "typescript-resolvers"],
            config: {
                avoidOptionals: {
                    field: true,
                    inputValue: true,
                    object: true,
                    defaultValue: true,
                },
                scalars: {
                    JSON: 'string',
                    UUID: 'string',
                    Date: 'string'
                }
            }
        },
    }
}

export default config;