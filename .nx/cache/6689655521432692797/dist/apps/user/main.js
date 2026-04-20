var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// apps/user/src/main.ts
var import_express = __toESM(require("express"));

// apps/user/src/schema/user.schema.ts
var import_graphql_tag = __toESM(require("graphql-tag"));
var typeDefs = import_graphql_tag.default`
  type Query {
    me: User
  }

  type User @key(fields: "id") {
    id: ID!
    email: String! @shareable
    firstName: String! @shareable
    lastName: String! @shareable
    dob: String! @shareable
    hashedPassword: String! @shareable
  }

  # (Subgraph schemas include
  # this to opt in to
  # Federation 2 features.)
  extend schema
    @link(
      url: "https://specs.apollo.dev/federation/v2.3"
      import: ["@key", "@shareable"]
    )
`;

// apps/user/src/main.ts
var import_server = require("@apollo/server");

// apps/user/src/resolvers/me.ts
var me = () => {
  return {
    id: "1",
    email: "user@example.com",
    firstName: "John",
    lastName: "Doe",
    dob: "1990-01-01",
    hashedPassword: "hashed_password_example"
  };
};

// apps/user/src/main.ts
var import_subgraph = require("@apollo/subgraph");
var port = process.env.PORT ? Number(process.env.PORT) : 3e3;
(async () => {
  const app = (0, import_express.default)();
  const apolloServer = new import_server.ApolloServer({
    schema: (0, import_subgraph.buildSubgraphSchema)([
      {
        typeDefs,
        resolvers: {
          Query: {
            me
          }
        }
      }
    ])
  });
  app.get("/", (req, res) => {
    res.send({ message: "Hello API" });
  });
  app.listen(port, () => {
    console.log(`[ ready ] http://localhost:${port}`);
  });
})();
