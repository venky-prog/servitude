import { GraphQLError } from 'graphql';

export class TokenExpiredError extends GraphQLError {
    constructor(code: string, message?: string) {
        super(message || 'Token has expired', {
            extensions: {
                code: 'TOKEN_EXPIRED',
                message,
            },
        });
    }
}