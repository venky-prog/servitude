"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const _1 = require(".");
const options = {};
const context = {
    root: '',
    cwd: process.cwd(),
    isVerbose: false,
    projectGraph: {
        nodes: {},
        dependencies: {},
    },
    projectsConfigurations: {
        projects: {},
        version: 2,
    },
    nxJsonConfiguration: {},
};
describe('ApolloCodegen Executor', () => {
    it('can run', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const output = yield (0, _1.default)(options, context);
        expect(output.success).toBe(true);
    }));
});
//# sourceMappingURL=apollo-codegen.spec.js.map