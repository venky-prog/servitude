"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = generateToken;
exports.verifyToken = verifyToken;
const tslib_1 = require("tslib");
const logger_1 = require("@servitude/logger");
const jose_1 = require("jose");
const errors_1 = require("./errors");
function generateToken(userId) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const token = yield new jose_1.SignJWT({ userId })
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('12h')
            .sign(new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret'));
        return token;
    });
}
function verifyToken(token) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            const { payload } = yield (0, jose_1.jwtVerify)(token, new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret'));
            return payload;
        }
        catch (error) {
            if (error instanceof jose_1.errors.JWTExpired) {
                logger_1.logger.warn('Token has expired:', error);
                throw new errors_1.TokenExpiredError('Token has expired');
            }
            else if (error instanceof jose_1.errors.JWTInvalid) {
                logger_1.logger.error('Token verification failed:', error);
                throw new errors_1.TokenExpiredError('Token is invalid or has expired');
            }
        }
    });
}
//# sourceMappingURL=token.js.map