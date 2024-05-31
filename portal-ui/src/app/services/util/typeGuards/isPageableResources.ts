import { isObject } from 'lodash';

import { Page, PageableResources } from '../../../../server-types/common-contracts';

export function isPageableResources(obj: unknown): obj is PageableResources<unknown> {
  return (
    isObject(obj) &&
    'content' in obj &&
    Array.isArray(obj.content) &&
    'page' in obj &&
    typeof obj.page === 'object' &&
    isPageableResourcesPage(obj.page)
  );
}

function isPageableResourcesPage(obj: unknown): obj is Page {
  return (
    isObject(obj) &&
    'size' in obj &&
    typeof obj.size === 'number' &&
    'totalElements' in obj &&
    typeof obj.totalElements === 'number' &&
    'totalPages' in obj &&
    typeof obj.totalPages === 'number'
  );
}
