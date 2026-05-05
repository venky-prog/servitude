import { gql } from 'graphql-tag';
import { logger } from '@servitude/logger';
import { readFile } from 'node:fs/promises';

export async function loadTypeDefs(path: string) {
  try {
    const contents = await readFile(path, 'utf8');
    return gql(contents);
  } catch (error) {
    logger.error('unable to load typeDefs', error);
    return gql``
  }
}
