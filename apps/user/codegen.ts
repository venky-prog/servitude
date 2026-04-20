import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
    overwrite: true,
    schema: "src/schema/user.graphql",
    generates: {
        "src/generated/graphql.ts": {
            plugins: ["typescript", "typescript-resolvers"],
            config: {
                avoidOptionals: {
                    field: true,
                    inputValue: true,
                    object: true,
                    defaultValue: true,
                }
            }
        },
    },
}

export default config;