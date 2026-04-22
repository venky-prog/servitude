"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const node_child_process_1 = require("node:child_process");
const runExecutor = (options, context) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    if (!context.projectName) {
        throw new Error('Project name is required in the context');
    }
    const projectConfig = context.projectsConfigurations.projects[context.projectName];
    console.log(`Running GraphQL Codegen for project: ${context.projectName}`);
    console.log('loading config from', projectConfig.root + '/codegen.ts');
    yield new Promise((resolve, reject) => {
        const process = (0, node_child_process_1.spawn)('npx', ['graphql-codegen', '--config', projectConfig.root + '/codegen.ts'], {
            cwd: context.root,
            stdio: 'inherit',
            shell: true,
        });
        process.on('close', (code) => {
            if (code === 0) {
                resolve();
            }
            else {
                reject(new Error(`graphql-codegen process exited with code ${code}`));
            }
        });
    });
    return {
        success: true,
    };
});
exports.default = runExecutor;
//# sourceMappingURL=index.js.map