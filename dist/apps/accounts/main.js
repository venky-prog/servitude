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
  constructor(message) {
    super(message, {
      extensions: {
        code: "TOKEN_EXPIRED"
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
    logger.error("Token verification failed:", error);
    throw new TokenExpiredError("Token is invalid or has expired");
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

// apps/accounts/src/main.ts
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

// apps/accounts/src/main.ts
var import_subgraph = require("@apollo/subgraph");
var import_node_path = __toESM(require("node:path"));

// apps/accounts/src/resolvers/index.ts
var import_graphql_scalars = require("graphql-scalars");

// apps/accounts/src/models/account.model.ts
var import_mongoose2 = __toESM(require("mongoose"));
var AccountType = /* @__PURE__ */ ((AccountType3) => {
  AccountType3["CreditCard"] = "CREDIT_CARD";
  AccountType3["Loan"] = "LOAN";
  AccountType3["Savings"] = "SAVINGS";
  return AccountType3;
})(AccountType || {});
var accountsSchema = new import_mongoose2.default.Schema({
  name: { type: String, required: true },
  accountType: {
    type: String,
    enum: Object.values(AccountType),
    required: true
  },
  userId: { type: String, required: true },
  // bank account properties
  interestRate: { type: Number },
  balance: { type: Number },
  // credit card properties
  lastFourDigits: { type: String, required: true },
  limit: { type: Number },
  billDate: { type: Number },
  date: { type: Date },
  emiStartDate: { type: Date },
  totalEMIs: { type: Number }
});
var Account = import_mongoose2.default.model("Accounts", accountsSchema);
var account_model_default = Account;

// apps/accounts/src/resolvers/list-accounts.ts
var listAccounts = async (_parent, args, ctx) => {
  try {
    const accounts = await account_model_default.find({ userId: ctx.userId }).limit(args.filter?.limit ?? 10).skip(args.filter?.offset ?? 0).lean();
    return accounts;
  } catch (error) {
    logger.error("Error fetching accounts:", error);
    throw new Error("Failed to fetch accounts");
  }
};

// apps/accounts/src/resolvers/get-account.ts
var getAccount = async (_parent, args, ctx) => {
  try {
    const account = await account_model_default.findById(args.id).lean();
    if (!account) {
      throw new Error("Account not found");
    }
    return account;
  } catch (error) {
    logger.error("Error fetching account:", error);
    throw new Error("Failed to fetch account");
  }
};

// apps/accounts/src/resolvers/create-credit-card-account.ts
var createCreditCardAccount = async (_parent, args, ctx) => {
  try {
    const account = await account_model_default.create({
      userId: ctx.userId,
      accountType: "CREDIT_CARD" /* CreditCard */,
      ...args
    });
    return account;
  } catch (error) {
    logger.error("Error creating credit card account:", error);
    throw new Error("Failed to create credit card account");
  }
};

// apps/accounts/src/resolvers/create-loan-account.ts
var createLoanAccount = async (_parent, args, ctx) => {
  try {
    const account = await account_model_default.create({
      userId: ctx.userId,
      accountType: "LOAN" /* Loan */,
      ...args
    });
    return account;
  } catch (error) {
    logger.error("Error creating loan account:", error);
    throw new Error("Failed to create loan account");
  }
};

// apps/accounts/src/resolvers/create-savings-account.ts
var createSavingsAccount = async (_parent, args, ctx) => {
  try {
    const account = await account_model_default.create({
      userId: ctx.userId,
      accountType: "SAVINGS" /* Savings */,
      ...args
    });
    return account;
  } catch (error) {
    logger.error("Error creating savings account:", error);
    throw new Error("Failed to create savings account");
  }
};

// apps/accounts/src/resolvers/index.ts
var accountResolvers = {
  ...import_graphql_scalars.resolvers,
  Query: {
    listAccounts,
    getAccount
  },
  Mutation: {
    createCreditCardAccount,
    createLoanAccount,
    createSavingsAccount
  },
  Account: {
    user: (parent) => {
      return { __typename: "User", _id: parent.userId };
    },
    __resolveReference: async (ref) => {
      const account = await account_model_default.findById(ref._id);
      return account;
    }
  }
};
var resolvers_default = accountResolvers;

// apps/accounts/src/main.ts
var host = process.env.HOST ?? "localhost";
var port = process.env.PORT ? Number(process.env.PORT) : 3e3;
(async () => {
  const schema = (0, import_subgraph.buildSubgraphSchema)([
    {
      typeDefs: await loadTypeDefs(
        import_node_path.default.join(__dirname, "schema", "accounts.graphql")
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
