"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = generateToken;
exports.verifyToken = verifyToken;
const tslib_1 = require("tslib");
const logger_1 = require("@servitude/logger");
const jose_1 = require("jose");
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
            logger_1.logger.error('Token verification failed:', error);
            return null;
        }
    });
}
//# sourceMappingURL=token.js.map