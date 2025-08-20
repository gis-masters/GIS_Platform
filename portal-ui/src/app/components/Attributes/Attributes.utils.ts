import { cloneDeep } from 'lodash';

import { extractFeatureTypeNameFromComplexName } from '../../services/geoserver/featureType/featureType.util';
import { CrgLayer } from '../../services/gis/layers/layers.models';
import { selectedFeaturesStore } from '../../services/map/a-map-mode/selected-features/SelectedFeatures.store';
import { FilterBySelectionMode } from '../../services/map/map.models';
import { getFieldFilterValue, modifyFieldFilterValue } from '../../services/util/filters/filters';
import { FilterQuery } from '../../services/util/filters/filters.models';
import { isFilterBySelection } from '../../services/util/typeGuards/isFilterBySelection';
import { isNumberArray } from '../../services/util/typeGuards/isNumberArray';
import { isRecordStringUnknown } from '../../services/util/typeGuards/isRecordStringUnknown';
import { FILTER_BY_SELECTION } from './Attributes.models';

export function extractFeatureIdsFromAttributesFilter(
  originalFilter: FilterQuery | undefined,
  layer: CrgLayer
): [string[], FilterQuery, boolean] {
  const filter: FilterQuery = cloneDeep<FilterQuery>(originalFilter || {});

  const filterBySelectionRaw = getFieldFilterValue(filter, FILTER_BY_SELECTION);
  const filterBySelection = isFilterBySelection(filterBySelectionRaw)
    ? filterBySelectionRaw
    : FilterBySelectionMode.DISABLED;
  modifyFieldFilterValue(filter, FILTER_BY_SELECTION);

  const cutId = getFieldFilterValue(filter, 'cutId');
  modifyFieldFilterValue(filter, 'cutId');

  const idsFromTableFilter =
    isRecordStringUnknown(cutId) && isNumberArray(cutId?.$in)
      ? cutId.$in.map(id => `${extractFeatureTypeNameFromComplexName(layer.complexName)}.${id}`)
      : [];

  let featureIds: string[] = [];

  if (!layer.tableName) {
    throw new Error(`Слой ${layer.title} не имеет tableName`);
  }

  featureIds =
    filterBySelection === FilterBySelectionMode.DISABLED
      ? []
      : selectedFeaturesStore.featuresByTableName[layer.tableName]?.map(({ id }) => id) || [];

  if (idsFromTableFilter.length) {
    featureIds =
      filterBySelection === FilterBySelectionMode.DISABLED
        ? idsFromTableFilter
        : featureIds.filter(id => idsFromTableFilter.includes(id));
  }

  return [featureIds, filter, filterBySelection === FilterBySelectionMode.ONLY_NOT_SELECTED];
}
