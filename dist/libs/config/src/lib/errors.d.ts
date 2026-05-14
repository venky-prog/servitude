import { GraphQLError } from 'graphql';
export declare class TokenExpiredError extends GraphQLError {
    constructor(code: string, message?: string);
}
