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

// libs/config/src/lib/load-typedefs.ts
var import_graphql_tag = require("graphql-tag");

// libs/logger/src/lib/logger.ts
var winston = __toESM(require("winston"));
var { combine, timestamp, errors, printf, colorize, json } = winston.format;
var isProd = process.env.NODE_ENV === "production";
var devFormat = combine(
  colorize(),
  timestamp(),
  errors({ stack: true }),
  printf(({ level, message, timestamp: timestamp2, stack }) => {
    return `${timestamp2} [${level}]: ${stack || message}`;
  })
);
var prodFormat = combine(
  timestamp(),
  errors({ stack: true }),
  json()
);
var logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: isProd ? prodFormat : devFormat,
  defaultMeta: {
    service: process.env.SERVICE_NAME || "unknown-service"
  },
  transports: [
    new winston.transports.Console()
  ]
});

// libs/config/src/lib/load-typedefs.ts
var import_promises = require("node:fs/promises");
async function loadTypeDefs(path2) {
  try {
    const contents = await (0, import_promises.readFile)(path2, "utf8");
    return (0, import_graphql_tag.gql)(contents);
  } catch (error) {
    logger.error("unable to load typeDefs", error);
    return import_graphql_tag.gql``;
  }
}

// libs/config/src/lib/create-app.ts
var import_express = __toESM(require("express"));
var import_express5 = require("@as-integrations/express5");

// libs/config/src/lib/token.ts
var import_jose = require("jose");

// libs/config/src/lib/errors.ts
var import_graphql = require("graphql");
var TokenExpiredError = class extends import_graphql.GraphQLError {
  constructor(code, message) {
    super(message || "Token has expired", {
      extensions: {
        code: "TOKEN_EXPIRED",
        message
      }
    });
  }
};

// libs/config/src/lib/token.ts
async function verifyToken(token) {
  try {
    const { payload } = await (0, import_jose.jwtVerify)(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET || "default-secret")
    );
    return payload;
  } catch (error) {
    if (error instanceof import_jose.errors.JWTExpired) {
      logger.warn("Token has expired:", error);
      throw new TokenExpiredError("Token has expired");
    } else if (error instanceof import_jose.errors.JWTInvalid) {
      logger.error("Token verification failed:", error);
      throw new TokenExpiredError("Token is invalid or has expired");
    }
  }
}

// libs/config/src/lib/create-app.ts
function createApp(apolloServer) {
  const app = (0, import_express.default)();
  app.use("/graphql", import_express.default.json(), (0, import_express5.expressMiddleware)(apolloServer, {
    context: async ({ req }) => {
      const token = req.headers.authorization?.split(" ")[1];
      const payload = await verifyToken(token || "");
      return { userId: payload?.userId, req };
    }
  }));
  app.use("/test", (req, res) => {
    res.send({ message: "Hello API" });
  });
  return app;
}

// apps/transactions/src/main.ts
var import_server = require("@apollo/server");

// libs/database/src/lib/connect-to-db.ts
var import_mongoose = __toESM(require("mongoose"));
var isConnected = false;
async function connectToDb(uri) {
  if (isConnected) return;
  try {
    await import_mongoose.default.connect(uri);
    import_mongoose.default.connection.on("error", (error) => {
      logger.error(error);
    });
    import_mongoose.default.connection.on("connected", () => {
      logger.info("Connected to MongoDB");
    });
    import_mongoose.default.connection.on("disconnected", () => {
      logger.warn("Disconnected from MongoDB");
    });
    isConnected = true;
  } catch (error) {
    logger.error("Failed to connect to MongoDB", error);
  }
}

// apps/transactions/src/main.ts
var import_subgraph = require("@apollo/subgraph");
var import_node_path = __toESM(require("node:path"));

// apps/transactions/src/models/transactions.model.ts
var import_mongoose2 = __toESM(require("mongoose"));
var transactionSchema = new import_mongoose2.default.Schema({
  accountId: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  description: { type: String, required: true },
  userId: { type: String, required: true }
});
var Transactions = import_mongoose2.default.model("Transactions", transactionSchema);

// apps/transactions/src/resolvers/create-transaction.ts
var createTransaction = async (_, { input }, ctx) => {
  if (!ctx.userId) {
    logger.error("Unauthorized access to createTransaction");
    throw new Error("Unauthorized");
  }
  const transaction = await Transactions.create({
    userId: ctx.userId,
    ...input
  });
  return transaction;
};

// apps/transactions/src/resolvers/delete-transaction.ts
var deleteTransaction = async (_, { _id }, ctx) => {
  if (!ctx.userId) {
    logger.error("Unauthorized access to deleteTransaction");
    throw new Error("Unauthorized");
  }
  const result = await Transactions.deleteOne({
    _id,
    userId: ctx.userId
  });
  if (result.deletedCount !== 1) {
    logger.error("Transaction not found");
    throw new Error("Transaction not found");
  }
  return true;
};

// apps/transactions/src/resolvers/get-transaction.ts
var getTransaction = async (_, { _id }, ctx) => {
  if (!ctx.userId) {
    logger.error("Unauthorized access to getTransaction");
    throw new Error("Unauthorized");
  }
  const transaction = await Transactions.findOne({
    _id,
    userId: ctx.userId
  });
  if (!transaction) {
    logger.error(`Transaction with id ${_id} not found for user ${ctx.userId}`);
    throw new Error("Transaction not found");
  }
  return transaction;
};

// apps/transactions/src/resolvers/update-transaction.ts
var updateTransaction = async (_, { _id, input }, ctx) => {
  if (!ctx.userId) {
    logger.error("Unauthorized access to updateTransaction");
    throw new Error("Unauthorized");
  }
  const transaction = await Transactions.findOneAndUpdate(
    { _id, userId: ctx.userId },
    { $set: input },
    { new: true }
  );
  if (!transaction) {
    logger.error("Transaction not found");
    throw new Error("Transaction not found");
  }
  return transaction;
};

// apps/transactions/src/resolvers/list-transactions.ts
var import_mongoose3 = require("mongoose");
var listTransactions = async (_, { first, after }, { userId }) => {
  if (!userId) {
    logger.error("Unauthorized access to listTransactions");
    throw new Error("Unauthorized");
  }
  const filter = {
    userId
  };
  if (after) {
    filter._id = {
      $lt: new import_mongoose3.Types.ObjectId(after)
    };
  }
  const limit = first + 1;
  const docs = await Transactions.find(filter).sort({ _id: -1 }).limit(limit).lean();
  const hasNextPage = docs.length === limit;
  if (hasNextPage) {
    docs.pop();
  }
  return {
    edges: docs.map((doc) => ({
      cursor: doc._id.toString(),
      node: doc
    })),
    pageInfo: {
      hasNextPage,
      hasPreviousPage: false,
      startCursor: docs.at(0)?._id.toString(),
      endCursor: docs.at(-1)?._id.toString()
    }
  };
};

// apps/transactions/src/resolvers/index.ts
var import_graphql_scalars = require("graphql-scalars");
var resolvers = {
  ...import_graphql_scalars.resolvers,
  Query: {
    getTransaction,
    listTransactions
  },
  Mutation: {
    createTransaction,
    updateTransaction,
    deleteTransaction
  },
  Transaction: {
    user: (parent) => {
      return { __typename: "User", _id: parent.userId };
    },
    account: (parent) => {
      return { __typename: "Account", _id: parent.accountId };
    },
    __resolveReference: async (ref) => {
      const transaction = await Transactions.findById(ref._id);
      return transaction;
    }
  }
};
var resolvers_default = resolvers;

// apps/transactions/src/main.ts
var host = process.env.HOST ?? "localhost";
var port = process.env.PORT ? Number(process.env.PORT) : 3e3;
(async () => {
  const schema = (0, import_subgraph.buildSubgraphSchema)([
    {
      typeDefs: await loadTypeDefs(
        import_node_path.default.join(__dirname, "schema", "transactions.graphql")
      ),
      resolvers: resolvers_default
    }
  ]);
  const apolloServer = new import_server.ApolloServer({
    schema
  });
  await apolloServer.start();
  const app = createApp(apolloServer);
  await connectToDb(
    process.env.MONGO_URI || "mongodb://localhost:27017/servitude"
  );
  app.listen(port, () => {
    console.log(`[ ready ] http://${host}:${port}`);
  });
})();
//# sourceMappingURL=main.js.map
