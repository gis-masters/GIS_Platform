import { Feature } from 'ol';
import { FeatureLike } from 'ol/Feature';
import { MultiPoint } from 'ol/geom';
import Point from 'ol/geom/Point';
import { Circle, Fill, Icon, Stroke, Style } from 'ol/style';
import CircleStyle from 'ol/style/Circle';

import { mapSnapStore } from '../../../stores/MapSnap.store';
import { extractFeatureTypeName } from '../../geoserver/featureType/featureType.util';
import { convertToFlatMultiPoint } from '../../util/GeometryUtil';
import { LabelType } from '../labels/map-labels.models';
import { getTextStyle } from '../labels/map-labels.util';

export enum KnownStyleKey {
  LabelTurningPointsStyles = 'LabelTurningPointsStyles',
  LabelCreateLineStyles = 'LabelCreateLineStyles',
  LabelCreateLabelStyles = 'LabelCreateLabelStyles',
  MapMarkerStyles = 'MapMarkerStyles',
  DrawStyles = 'DrawStyles',
  DrawLayerStyles = 'drawLayerStyles',
  MeasureDrawStyles = 'MeasureDrawStyles',
  MeasureLayerStyles = 'MeasureLayerStyles',
  SelectStyles = 'selectStyles',
  LabelsDrawStyles = 'LabelsDrawStyles'
}

export function getStyle(knownStyleKey: KnownStyleKey): Style[] {
  return styles.get(knownStyleKey) || [];
}

const DEFAULT_CIRCLE_RADIUS = 4;
const DEFAULT_STROKE_WIDTH = 2;
const DEFAULT_FILL_COLOR = 'rgba(255, 255, 255, 0.5)';

const styles = new Map<KnownStyleKey, Style[]>([
  [
    KnownStyleKey.LabelCreateLabelStyles,
    [
      new Style({
        image: new Icon({
          src:
            'data:image/svg+xml,' +
            encodeURIComponent(
              '<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 24 24"><path d="M10 9h4V6h3l-5-5-5 5h3v3zm-1 1H6V7l-5 5 5 5v-3h3v-4zm14 2-5-5v3h-3v4h3v3l5-5zm-9 3h-4v3H7l5 5 5-5h-3v-3z"/></svg>'
            )
        })
      })
    ]
  ],
  [
    KnownStyleKey.LabelCreateLineStyles,
    [
      new Style({
        stroke: new Stroke({
          color: '#3399ff',
          width: DEFAULT_STROKE_WIDTH
        })
      })
    ]
  ],
  [
    KnownStyleKey.LabelTurningPointsStyles,
    [
      new Style({
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
      })
    ]
  ],
  [
    KnownStyleKey.MapMarkerStyles,
    [
      new Style({
        image: new Icon({
          anchorXUnits: 'fraction',
          anchorYUnits: 'pixels',
          src: '/assets/images/map-marker.png'
        })
      })
    ]
  ],
  [
    KnownStyleKey.MeasureDrawStyles,
    [
      new Style({
        fill: new Fill({
          color: DEFAULT_FILL_COLOR
        }),
        stroke: new Stroke({
          color: '#ffcc33',
          lineDash: [10, 10],
          width: DEFAULT_STROKE_WIDTH
        }),
        image: new CircleStyle({
          radius: 5,
          stroke: new Stroke({
            color: '#ffcc33'
          }),
          fill: new Fill({
            color: DEFAULT_FILL_COLOR
          })
        })
      })
    ]
  ],
  [
    KnownStyleKey.MeasureLayerStyles,
    [
      new Style({
        fill: new Fill({
          color: DEFAULT_FILL_COLOR
        }),
        stroke: new Stroke({
          color: '#ffcc33',
          width: DEFAULT_STROKE_WIDTH
        }),
        image: new CircleStyle({
          radius: 7,
          fill: new Fill({
            color: '#ffcc33'
          })
        })
      })
    ]
  ],
  [
    KnownStyleKey.SelectStyles,
    [
      new Style({
        fill: new Fill({
          color: 'rgba(0, 255, 0, 0.3)'
        })
      }),
      new Style({
        stroke: new Stroke({
          color: 'green',
          width: DEFAULT_STROKE_WIDTH
        })
      }),
      new Style({
        image: new Circle({
          radius: DEFAULT_CIRCLE_RADIUS,
          fill: new Fill({
            color: 'red'
          })
        }),
        geometry: circleGeometry
      })
    ]
  ],
  [
    KnownStyleKey.LabelsDrawStyles,
    [
      new Style({
        fill: new Fill({
          color: DEFAULT_FILL_COLOR
        }),
        stroke: new Stroke({
          color: '#3399ff',
          lineDash: [10, 10],
          width: DEFAULT_STROKE_WIDTH
        }),
        image: new CircleStyle({
          radius: 5,
          stroke: new Stroke({
            color: '#3399ff'
          }),
          fill: new Fill({
            color: DEFAULT_FILL_COLOR
          })
        })
      })
    ]
  ],
  [
    KnownStyleKey.DrawLayerStyles,
    [
      new Style({
        fill: new Fill({
          color: 'rgba(255, 255, 0, 0.5)'
        })
      }),
      new Style({
        stroke: new Stroke({
          color: '#ff0018',
          width: DEFAULT_STROKE_WIDTH
        })
      }),
      new Style({
        image: new Circle({
          radius: DEFAULT_CIRCLE_RADIUS,
          fill: new Fill({
            color: 'red'
          })
        }),
        geometry: circleGeometry
      })
    ]
  ],
  [
    KnownStyleKey.DrawStyles,
    [
      new Style({
        fill: new Fill({
          color: 'rgba(255, 255, 255, 0.33)'
        }),
        stroke: new Stroke({
          color: '#0092F3FF',
          width: DEFAULT_STROKE_WIDTH
        }),
        image: new Circle({
          radius: DEFAULT_CIRCLE_RADIUS,
          fill: new Fill({
            color: 'red'
          })
        })
      })
    ]
  ]
]);

export function createStyle(feature: Feature): Style[] {
  const labelType = feature.getProperties().type as LabelType;
  if (labelType === 'line') {
    return getStyle(KnownStyleKey.LabelCreateLineStyles);
  }

  if (labelType === 'label') {
    const properties = feature.getProperties();

    const createLabelStyle: Style = getStyle(KnownStyleKey.LabelCreateLabelStyles)[0];
    createLabelStyle.setText(getTextStyle(properties));

    return [createLabelStyle];
  }

  if (labelType === 'turningPoints') {
    return getStyle(KnownStyleKey.LabelTurningPointsStyles);
  }

  throw new Error(`Unknown label type: ${String(labelType)}`);
}

function circleGeometry(feature: FeatureLike) {
  const geometry = feature.getGeometry();
  if (geometry === undefined) {
    return;
  }

  // Когда приходит фича как "не существующая" точка, то это от клика по отдельной координате, из правой панели, для
  // подсветки
  if (extractFeatureTypeName(String(feature.getId())).length === 0 && geometry.getType() === 'Point') {
    return new MultiPoint([(geometry as Point).getCoordinates()]);
  }

  if (mapSnapStore.isSnapNotActive()) {
    return;
  }

  return convertToFlatMultiPoint(geometry);
}
