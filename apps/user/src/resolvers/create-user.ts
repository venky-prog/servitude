import { MutationResolvers } from "../generated/graphql";
import User from "../models/user.model";

export const createUser: MutationResolvers['createUser'] = async (parent, args, context) => {
  const { input } = args;

  const user = (await User.create(input)).toJSON(); // toJSON returns a plain object, but it doesn't have the correct type

  return {
    ...user,
    _id: user._id, // Convert ObjectId to string
  };
}