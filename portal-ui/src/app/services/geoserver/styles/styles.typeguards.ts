import { isObject } from 'lodash';

import { type StyleRuleExtended } from './styles.models';

export function isStyleRuleExtended(obj: unknown): obj is StyleRuleExtended {
  return (
    isObject(obj) &&
    'name' in obj &&
    typeof obj.name === 'string' &&
    'title' in obj &&
    typeof obj.title === 'string' &&
    'legend' in obj &&
    typeof obj.legend === 'string' &&
    'layerId' in obj &&
    typeof obj.layerId === 'number' &&
    'layerTitle' in obj &&
    typeof obj.layerTitle === 'string'
  );
}
