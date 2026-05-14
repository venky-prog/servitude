"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenExpiredError = void 0;
const graphql_1 = require("graphql");
class TokenExpiredError extends graphql_1.GraphQLError {
    constructor(code, message) {
        super(message || 'Token has expired', {
            extensions: {
                code: 'TOKEN_EXPIRED',
                message,
            },
        });
    }
}
exports.TokenExpiredError = TokenExpiredError;
//# sourceMappingURL=errors.js.map