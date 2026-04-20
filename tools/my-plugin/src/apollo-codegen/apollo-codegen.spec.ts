import { ExecutorContext } from '@nx/devkit';

import { ApolloCodegenExecutorSchema } from './schema';
import executor from './apollo-codegen';

const options: ApolloCodegenExecutorSchema = {};
const context: ExecutorContext = {
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
  it('can run', async () => {
    const output = await executor(options, context);
    expect(output.success).toBe(true);
  });
});
