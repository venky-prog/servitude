import { MutationResolvers } from "../generated/graphql";
import User from "../models/user.model";

export const updateUser: MutationResolvers['updateUser'] = async (parent, args, context) => {
    const {input: { _id, ...updateData }} = args;

    const updateUser = await User.findByIdAndUpdate(_id, updateData, {new: true});

    if (!updateUser) {
        throw new Error('User not found');
    }

    console.log("Updated user:", updateUser);

    return {
        ...updateUser.toJSON(),
        _id: updateUser._id, // Convert ObjectId to string
    };
}