import { PromiseExecutor } from '@nx/devkit';
import { SchemaPublishExecutorSchema } from './schema';

const runExecutor: PromiseExecutor<SchemaPublishExecutorSchema> = async (
  options,
) => {
  console.log('Executor ran for SchemaPublish', options);
  return {
    success: true,
  };
};

export default runExecutor;
