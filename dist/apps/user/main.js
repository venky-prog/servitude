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
var import_server = require("@apollo/server");
var import_subgraph = require("@apollo/subgraph");

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
async function generateToken(userId) {
  const token = await new import_jose.SignJWT({ userId }).setProtectedHeader({ alg: "HS256" }).setExpirationTime("12h").sign(new TextEncoder().encode(process.env.JWT_SECRET || "default-secret"));
  return token;
}
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

// apps/user/src/main.ts
var import_node_path = __toESM(require("node:path"));

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

// apps/user/src/models/user.model.ts
var import_mongoose2 = __toESM(require("mongoose"));
var import_bcrypt = __toESM(require("bcrypt"));
var userSchema = new import_mongoose2.default.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    select: false
    // Exclude password from query results by default
  },
  dob: {
    type: String,
    required: true
  }
});
userSchema.pre("save", async function() {
  console.log("Pre-save hook triggered for user:", this);
  if (!this.isModified("password") || !this.isNew) {
    throw new Error("Password is not modified");
  }
  const salt = await import_bcrypt.default.genSalt(10);
  this.password = await import_bcrypt.default.hash(this.password, salt);
});
userSchema.method(
  "comparePassword",
  async function(candidatePassword) {
    return import_bcrypt.default.compare(candidatePassword, this.password);
  }
);
userSchema.method("generateAuthToken", async function() {
  return generateToken(this._id.toString());
});
var User = import_mongoose2.default.model("User", userSchema);
var user_model_default = User;

// apps/user/src/resolvers/create-user.ts
var createUser = async (parent, args, context) => {
  const { input } = args;
  const user = (await user_model_default.create(input)).toJSON();
  return {
    ...user,
    _id: user._id
    // Convert ObjectId to string
  };
};

// apps/user/src/resolvers/login.ts
var login = async (parent, args, context) => {
  const { input: { email, password } } = args;
  const user = await user_model_default.findOne({ email }).select("+password");
  if (!user) {
    throw new Error("Invalid email or password");
  }
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }
  const token = await user.generateAuthToken();
  console.log("----------------------- from user service", user._id.toString());
  return {
    token,
    user: {
      ...user.toJSON(),
      _id: user._id.toString()
      // Convert ObjectId to string
    }
  };
};

// apps/user/src/resolvers/me.ts
var me = async () => {
  try {
    const user = await user_model_default.findById("64b8c9e5f1a2c9b1d2e3f4a5").lean();
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    logger.error("Error fetching user:", error);
    throw new Error("Failed to fetch user");
  }
};

// apps/user/src/resolvers/update-user.ts
var updateUser = async (parent, args, context) => {
  const { input: { _id, ...updateData } } = args;
  const updateUser2 = await user_model_default.findByIdAndUpdate(_id, updateData, { new: true });
  if (!updateUser2) {
    throw new Error("User not found");
  }
  console.log("Updated user:", updateUser2);
  return {
    ...updateUser2.toJSON(),
    _id: updateUser2._id
    // Convert ObjectId to string
  };
};

// apps/user/src/resolvers/index.ts
var import_graphql_scalars = require("graphql-scalars");
var userResolvers = {
  ...import_graphql_scalars.resolvers,
  Query: {
    me
  },
  Mutation: {
    createUser,
    login,
    updateUser
  },
  User: {
    __resolveReference: async (ref) => {
      const user = user_model_default.findById(ref._id);
      return user;
    }
  }
};
var resolvers_default = userResolvers;

// apps/user/src/main.ts
var port = process.env.PORT ? Number(process.env.PORT) : 3e3;
(async () => {
  const schema = (0, import_subgraph.buildSubgraphSchema)([
    {
      typeDefs: await loadTypeDefs(
        import_node_path.default.join(__dirname, "schema", "user.graphql")
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
    console.log(`[ ready ] http://localhost:${port}`);
  });
})();
//# sourceMappingURL=main.js.map
