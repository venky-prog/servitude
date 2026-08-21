import { PromiseExecutor } from '@nx/devkit';
import { SchemaPublishExecutorSchema } from './schema';
import { spawn } from 'node:child_process';

const runExecutor: PromiseExecutor<SchemaPublishExecutorSchema> = async (
  options,
  ctx,
) => {
  if (!ctx.projectName) {
    throw new Error(
      'Getting error while getting project name. Please make sure attach the executor to the project configuration.',
    );
  }

  const projectConfig = ctx.projectsConfigurations.projects[ctx.projectName];

  console.log('Project config:', projectConfig.name);

  console.log('Executor ran for SchemaPublish', options);

  console.log('schema path:', `./src/schema/${projectConfig.name}.graphql`)

  await new Promise<void>((resolve, reject) => {
    const spawnProcess = spawn(
      'npx',
      [
        'hive',
        'schema:publish',
        '--registry.accessToken',
        process.env.HIVE_REGISTRY_TOKEN || '',
        '--service',
        projectConfig.name!,
        '--target',
        `${options.org}/${options.project}/${options.target}`,
        `./src/schema/${projectConfig.name}.graphql`,
        '--url',
        options.url!
      ],
      {
        cwd: projectConfig.root,
        stdio: 'inherit',
        shell: true,
      },
    );

    spawnProcess.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(
          new Error(`Hive registry publish process exited with code ${code}`),
        );
      }
    });
  });
  return {
    success: true,
  };
};

export default runExecutor;
