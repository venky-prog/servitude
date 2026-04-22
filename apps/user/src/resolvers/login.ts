import { MutationResolvers } from "../generated/graphql";
import User from "../models/user.model";

export const login: MutationResolvers['login'] = async (parent, args, context) => {
    const { input: { email, password } } = args;

    // Find the user by email
    const user = await User.findOne({ email }).select('+password'); // Include password field for comparison

    if (!user) {
        throw new Error('Invalid email or password');
    }

    // Check if the password is correct
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
        throw new Error('Invalid email or password');
    }

    // Generate a JWT token
    const token = await user.generateAuthToken();

    return {
        token,
        user: {
            ...user.toJSON(),
            _id: user._id.toHexString(), // Convert ObjectId to string
        },
    };
}