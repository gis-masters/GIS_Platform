import { type CustomFilters, type ExplorerItemData, ExplorerItemType } from './Explorer.models';

export function isExplorerItemData(value: unknown): value is ExplorerItemData {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const explorerItemTypeKeys = Object.values(ExplorerItemType).map(String);

  return (
    'payload' in value && 'type' in value && typeof value.type === 'string' && explorerItemTypeKeys.includes(value.type)
  );
}

export function isCustomFilters(value: unknown): value is CustomFilters {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const valueEntries = Object.entries(value);
  const explorerItemTypeKeys = new Set(Object.values(ExplorerItemType).map(String));

  return valueEntries.every(([key, value]) => explorerItemTypeKeys.has(key) && typeof value === 'object');
}
