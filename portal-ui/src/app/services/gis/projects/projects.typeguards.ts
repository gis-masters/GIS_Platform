import { isObject } from 'lodash';

import { type CrgProject } from './projects.models';

export function isCrgProject(obj: unknown): obj is CrgProject {
  return (
    isObject(obj) &&
    'id' in obj &&
    typeof obj.id === 'number' &&
    'name' in obj &&
    typeof obj.name === 'string' &&
    'folder' in obj &&
    typeof obj.folder === 'boolean'
  );
}
