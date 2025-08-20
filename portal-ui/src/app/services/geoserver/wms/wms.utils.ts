import { WFS } from '../../ol/WFS';
import { cql2ol } from '../../util/cql/cql2ol';

export function getXmlFilterFromCql(cql: string, featureIds: string[], featureIdsNegative: boolean): Element | null {
  const filter = cql ? cql2ol(cql) : undefined;

  const getFeatureRequest = new WFS().writeGetFeature({
    featureNS: '',
    featurePrefix: '',
    featureTypes: ['dummy'],
    featureIds,
    featureIdsNegative,
    filter
  }) as Element;

  return getFeatureRequest.querySelector('Filter');
}
