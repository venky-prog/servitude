"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDb = connectToDb;
const tslib_1 = require("tslib");
const mongoose_1 = require("mongoose");
const logger_1 = require("@servitude/logger");
let isConnected = false;
function connectToDb(uri) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (isConnected)
            return;
        try {
            yield mongoose_1.default.connect(uri);
            mongoose_1.default.connection.on('error', (error) => {
                logger_1.logger.error(error);
            });
            mongoose_1.default.connection.on('connected', () => {
                logger_1.logger.info('Connected to MongoDB');
            });
            mongoose_1.default.connection.on('disconnected', () => {
                logger_1.logger.warn('Disconnected from MongoDB');
            });
            isConnected = true;
        }
        catch (error) {
            logger_1.logger.error('Failed to connect to MongoDB', error);
        }
    });
}
//# sourceMappingURL=connect-to-db.js.map