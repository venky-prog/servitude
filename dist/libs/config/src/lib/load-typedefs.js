"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadTypeDefs = loadTypeDefs;
const tslib_1 = require("tslib");
const graphql_tag_1 = require("graphql-tag");
const logger_1 = require("@servitude/logger");
const promises_1 = require("node:fs/promises");
function loadTypeDefs(path) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            const contents = yield (0, promises_1.readFile)(path, 'utf8');
            return (0, graphql_tag_1.gql)(contents);
        }
        catch (error) {
            logger_1.logger.error('unable to load typeDefs', error);
            return (0, graphql_tag_1.gql) ``;
        }
    });
}
//# sourceMappingURL=load-typedefs.js.map