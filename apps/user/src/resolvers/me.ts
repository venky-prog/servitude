import { QueryResolvers } from "../generated/graphql";

export const me: QueryResolvers['me'] = () => {
    return {
        _id: '1',
        email: 'user@example.com',
        firstName: 'John',
        lastName: 'Doe',
        dob: '1990-01-01',
        password: 'hashed_password_example'
    }
}