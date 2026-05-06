"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const express5_1 = require("@as-integrations/express5");
const token_1 = require("./token");
function createApp(apolloServer) {
    const app = (0, express_1.default)();
    app.use('/graphql', express_1.default.json(), (0, express5_1.expressMiddleware)(apolloServer, {
        context: (_a) => tslib_1.__awaiter(this, [_a], void 0, function* ({ req }) {
            var _b;
            const token = (_b = req.headers.authorization) === null || _b === void 0 ? void 0 : _b.split(' ')[1];
            const payload = yield (0, token_1.verifyToken)(token || '');
            return { userId: payload === null || payload === void 0 ? void 0 : payload.userId, req };
        }),
    }));
    app.use('/test', (req, res) => {
        res.send({ message: 'Hello API' });
    });
    return app;
}
//# sourceMappingURL=create-app.js.map