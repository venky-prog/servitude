import { PromiseExecutor, ExecutorContext } from '@nx/devkit';
import {spawn} from 'node:child_process'
import { ApolloCodegenExecutorSchema } from './schema';

const runExecutor: PromiseExecutor<ApolloCodegenExecutorSchema> = async (
  options,
  context: ExecutorContext
) => {
  if (!context.projectName) {
    throw new Error('Project name is required in the context');
  }
  const projectConfig = context.projectsConfigurations.projects[context.projectName];

  console.log(`Running GraphQL Codegen for project: ${context.projectName}`);

  console.log('loading config from', projectConfig.root + '/codegen.ts');

  await new Promise<void>((resolve, reject) => {
    const process = spawn('npx', ['graphql-codegen', '--config',  './codegen.ts'], {
      cwd: projectConfig.root,
      stdio: 'inherit',
      shell: true,
    });

    process.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`graphql-codegen process exited with code ${code}`));
      }
    });
  });

  return {
    success: true,
  };
};

export default runExecutor;
