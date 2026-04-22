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
var import_node_fs = require("node:fs");
var import_server = require("@apollo/server");

// apps/user/src/resolvers/me.ts
var me = () => {
  return {
    _id: "1",
    email: "user@example.com",
    firstName: "John",
    lastName: "Doe",
    dob: "1990-01-01",
    password: "hashed_password_example"
  };
};

// apps/user/src/main.ts
var import_express5 = require("@as-integrations/express5");
var import_subgraph = require("@apollo/subgraph");
var import_graphql_tag = __toESM(require("graphql-tag"));
var import_node_path = __toESM(require("node:path"));

// apps/user/src/models/user.model.ts
var import_mongoose = __toESM(require("mongoose"));
var import_bcrypt = __toESM(require("bcrypt"));
var import_jose = require("jose");
var userSchema = new import_mongoose.default.Schema({
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
userSchema.method("comparePassword", async function(candidatePassword) {
  return import_bcrypt.default.compare(candidatePassword, this.password);
});
userSchema.method("generateAuthToken", async function() {
  const token = await new import_jose.SignJWT({ userId: this._id.toHexString() }).setProtectedHeader({ alg: "HS256" }).setExpirationTime("12h").sign(new TextEncoder().encode(process.env.JWT_SECRET || "default-secret"));
  return token;
});
var User = import_mongoose.default.model("User", userSchema);
var user_model_default = User;

// apps/user/src/resolvers/create-user.ts
var createUser = async (parent, args, context) => {
  const { input } = args;
  const user = (await user_model_default.create(input)).toJSON();
  return {
    ...user,
    _id: user._id.toHexString()
    // Convert ObjectId to string
  };
};

// apps/user/src/utils/mongo-connect.ts
var import_mongoose2 = __toESM(require("mongoose"));
var connectToMongoDB = async (mongoUri) => {
  try {
    const connection = await import_mongoose2.default.connect(mongoUri);
    console.log("Connected to MongoDB");
    connection.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });
    return connection;
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    throw err;
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
    _id: updateUser2._id.toHexString()
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
  return {
    token,
    user: {
      ...user.toJSON(),
      _id: user._id.toHexString()
      // Convert ObjectId to string
    }
  };
};

// apps/user/src/main.ts
var port = process.env.PORT ? Number(process.env.PORT) : 3e3;
var typeDefs = (0, import_node_fs.readFileSync)(import_node_path.default.join(__dirname, "schema", "user.graphql"), "utf8");
(async () => {
  const app = (0, import_express.default)();
  const apolloServer = new import_server.ApolloServer({
    schema: (0, import_subgraph.buildSubgraphSchema)([
      {
        typeDefs: (0, import_graphql_tag.default)(typeDefs),
        resolvers: {
          Query: {
            me
          },
          Mutation: {
            createUser,
            updateUser,
            login
          }
        }
      }
    ])
  });
  await apolloServer.start();
  app.use("/graphql", import_express.default.json(), (0, import_express5.expressMiddleware)(apolloServer));
  app.get("/", (req, res) => {
    res.send({ message: "Hello API" });
  });
  await connectToMongoDB(process.env.MONGO_URI || "mongodb://localhost:27017/servitude");
  app.listen(port, () => {
    console.log(`[ ready ] http://localhost:${port}`);
  });
})();
//# sourceMappingURL=main.js.map
