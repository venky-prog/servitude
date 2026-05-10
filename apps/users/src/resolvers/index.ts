import { Resolvers } from "../generated/graphql";
import User from "../models/user.model";
import { createUser } from "./create-user";
import { login } from "./login";
import { me } from "./me";
import { updateUser } from "./update-user";
import { resolvers as scalarResolvers } from 'graphql-scalars';

const userResolvers: Resolvers = {
    ...scalarResolvers,
    Query: {
        me,
    },
    Mutation: {
        createUser,
        login,
        updateUser,
    },
    User: {
        __resolveReference: async (ref) => {
            const user = User.findById(ref._id);
            return user;
        }
    }
}

export default userResolvers;
