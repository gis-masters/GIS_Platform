import { type Schema } from '../../services/data/schema/schema.models';
import { getReadablePropertyValue } from '../../services/data/schema/schema.utils';
import { type WfsFeature } from '../../services/geoserver/wfs/wfs.models';

export interface FeaturesListItemTitle {
  title: string;
  isEmpty: boolean;
}

export function getFeaturesListItemTitle(feature: WfsFeature, schema: Schema | undefined): FeaturesListItemTitle {
  let title: string;
  let isEmpty: boolean;
  const property = schema?.properties.find(prop => prop.asTitle);
  if (property) {
    const value = getReadablePropertyValue(feature.properties[property.name], property);
    title = value || 'не заполнено';
    isEmpty = !value;
  } else {
    const nameStr = typeof feature.properties.name === 'string' ? feature.properties.name : '';
    const titleStr = typeof feature.properties.title === 'string' ? feature.properties.title : '';
    const featureTitle = nameStr === '' ? titleStr : nameStr;
    title = featureTitle || 'объект';
    isEmpty = !featureTitle;
  }

  return { title, isEmpty };
}
