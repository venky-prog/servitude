import { PromiseExecutor } from '@nx/devkit';
import { SchemaCheckExecutorSchema } from './schema';

const runExecutor: PromiseExecutor<SchemaCheckExecutorSchema> = async (
  options,
) => {
  console.log('Executor ran for SchemaCheck', options);
  return {
    success: true,
  };
};

export default runExecutor;
