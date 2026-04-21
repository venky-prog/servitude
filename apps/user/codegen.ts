import { CodegenConfig } from "@graphql-codegen/cli";
import { typeDefs } from "./src/schema/user.schema";

const config: CodegenConfig = {
    overwrite: true,
    schema: './src/schema/user.schema.ts',
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