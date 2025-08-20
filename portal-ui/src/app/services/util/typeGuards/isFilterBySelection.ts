import { FilterBySelectionMode } from '../../map/map.models';

export function isFilterBySelection(value: unknown): value is FilterBySelectionMode {
  return typeof value === 'string' && Object.values<string>(FilterBySelectionMode).includes(value);
}
