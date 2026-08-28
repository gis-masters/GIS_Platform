import { isObject } from 'lodash';

import { type TemplateInfo } from './reportTemplate.models';

export function isTemplateInfo(obj: unknown): obj is TemplateInfo {
  return (
    isObject(obj) &&
    'name' in obj &&
    typeof obj.name === 'string' &&
    'title' in obj &&
    typeof obj.title === 'string' &&
    'system' in obj &&
    typeof obj.system === 'boolean'
  );
}
