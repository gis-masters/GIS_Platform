import { Feature } from 'ol';
import { Circle, Fill, Icon, Stroke, Style } from 'ol/style';

import { LabelType } from '../map/map-labels.models';
import { getTextStyle } from '../map/map-labels.util';

export function createStyle(feature: Feature, selected?: boolean): Style[] {
  const labelType = getLabelType(feature);
  if (labelType === 'line') {
    return [createLineStyle(selected)];
  }

  if (labelType === 'label') {
    return [createLabelStyle(feature, selected)];
  }

  if (labelType === 'turningPoints') {
    return [createCircleStyle()];
  }

  throw new Error(`Unknown label type: ${String(labelType)}`);
}

export function getLabelType(feature: Feature): LabelType {
  const properties = feature.getProperties();

  return properties.type as LabelType;
}

function createLineStyle(selected?: boolean): Style {
  return new Style({
    stroke: new Stroke({
      color: selected ? '#1177dd' : '#3399ff',
      width: 2
    })
  });
}

function createCircleStyle(): Style {
  return new Style({
    image: new Circle({
      fill: new Fill({
        color: '#FFA343'
      }),
      stroke: new Stroke({
        width: 1,
        color: '#fff'
      }),
      radius: 6
    })
  });
}

function createLabelStyle(feature: Feature, selected?: boolean): Style {
  const properties = feature.getProperties();

  if (typeof properties.text !== 'string') {
    throw new TypeError('Текст не текст');
  }

  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 24 24"><path d="M10 9h4V6h3l-5-5-5 5h3v3zm-1 1H6V7l-5 5 5 5v-3h3v-4zm14 2-5-5v3h-3v4h3v3l5-5zm-9 3h-4v3H7l5 5 5-5h-3v-3z"/></svg>';

  return new Style({
    image: new Icon({
      src: 'data:image/svg+xml,' + encodeURIComponent(svg),
      opacity: selected ? 0.5 : 0
    }),
    text: getTextStyle(properties)
  });
}
