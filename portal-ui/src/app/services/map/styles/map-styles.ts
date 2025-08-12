import { Feature } from 'ol';
import { FeatureLike } from 'ol/Feature';
import { MultiPoint } from 'ol/geom';
import Point from 'ol/geom/Point';
import { Circle, Fill, Icon, Stroke, Style } from 'ol/style';
import CircleStyle from 'ol/style/Circle';

import { mapStore } from '../../../stores/Map.store';
import { extractFeatureTypeName } from '../../geoserver/featureType/featureType.util';
import { convertToFlatMultiPoint } from '../../util/GeometryUtil';
import { LabelType } from '../labels/map-labels.models';
import { getTextStyle } from '../labels/map-labels.util';
import { MapMode } from '../map.models';

export enum KnownStyleKey {
  LabelTurningPointsStyles = 'labelTurningPointsStyles',
  LabelCreateLineStyles = 'labelCreateLineStyles',
  LabelCreateLabelStyles = 'labelCreateLabelStyles',
  MapMarkerStyles = 'mapMarkerStyles',
  MeasureDrawStyles = 'measureDrawStyles',
  MeasureLayerStyles = 'measureLayerStyles',
  SelectedSingleCoordStyles = 'selectedSingleCoordStyles',
  LabelsDrawStyles = 'labelsDrawStyles',
  DrawingFeature = 'drawingFeature', // Стиль, которым рисуем новые объекты
  ActiveFeature = 'activeFeature',
  SelectedFeatures = 'SelectedFeatures',
  SelectedFeaturesWithVertices = 'SelectedFeaturesWithVertices',
  Prokol = 'prokol'
}

export function getStyle(knownStyleKey: KnownStyleKey): Style[] {
  return styles.get(knownStyleKey) || [];
}

const DEFAULT_CIRCLE_RADIUS = 4;
const DEFAULT_STROKE_WIDTH = 2;
const ACTIVE_STROKE_WIDTH = 3;

const WHITE = '#FFF';
const GRAY = '#646464';
const RED = '#FF0018';
const BLUE = '#3399FF';
const ORANGE = '#FFA500';

const FILL_ACTIVE = 'rgba(255,165,0, 0.8)';
const FILL_DRAW = 'rgba(255,255,0, 0.8)';
const STROKE_ACTIVE = 'rgba(255,255,255,0.9)';

const FILL_YELLOW = 'rgba(255, 255, 0, 0.5)';
const FILL_GRAY = 'rgba(255, 255, 255, 0.5)';

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
          color: BLUE,
          width: DEFAULT_STROKE_WIDTH
        })
      })
    ]
  ],
  [
    KnownStyleKey.SelectedSingleCoordStyles,
    [
      new Style({
        zIndex: 11_000,
        image: new CircleStyle({
          radius: 5,
          stroke: new Stroke({
            color: BLUE
          }),
          fill: new Fill({
            color: BLUE
          })
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
            color: ORANGE
          }),
          stroke: new Stroke({
            width: 1,
            color: WHITE
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
          color: FILL_GRAY
        }),
        stroke: new Stroke({
          color: ORANGE,
          lineDash: [10, 10],
          width: DEFAULT_STROKE_WIDTH
        }),
        image: new CircleStyle({
          radius: 5,
          stroke: new Stroke({
            color: ORANGE
          }),
          fill: new Fill({
            color: FILL_GRAY
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
          color: FILL_GRAY
        }),
        stroke: new Stroke({
          color: ORANGE,
          width: DEFAULT_STROKE_WIDTH
        }),
        image: new CircleStyle({
          radius: 7,
          fill: new Fill({
            color: ORANGE
          })
        })
      })
    ]
  ],
  [
    KnownStyleKey.ActiveFeature,
    [
      new Style({
        zIndex: 5000,
        fill: new Fill({
          color: FILL_ACTIVE
        })
      }),
      new Style({
        zIndex: 5000,
        stroke: new Stroke({
          color: RED,
          width: ACTIVE_STROKE_WIDTH
        })
      }),
      new Style({
        zIndex: 5000,
        stroke: new Stroke({
          color: WHITE,
          lineDash: [10, 10],
          width: ACTIVE_STROKE_WIDTH
        })
      }),
      new Style({
        zIndex: 5000,
        image: new Circle({
          radius: DEFAULT_CIRCLE_RADIUS,
          fill: new Fill({
            color: RED
          }),
          stroke: new Stroke({
            color: STROKE_ACTIVE,
            width: 1
          })
        }),
        geometry: showVerticesSnapping
      })
    ]
  ],
  [
    KnownStyleKey.DrawingFeature,
    [
      new Style({
        zIndex: 10_000,
        fill: new Fill({
          color: FILL_DRAW
        })
      }),
      new Style({
        zIndex: 10_000,
        stroke: new Stroke({
          color: ORANGE,
          width: ACTIVE_STROKE_WIDTH
        })
      }),
      new Style({
        zIndex: 10_000,
        stroke: new Stroke({
          color: WHITE,
          lineDash: [10, 10],
          width: ACTIVE_STROKE_WIDTH
        })
      }),
      new Style({
        zIndex: 10_000,
        image: new Circle({
          radius: DEFAULT_CIRCLE_RADIUS + 0.5,
          fill: new Fill({
            color: WHITE
          }),
          stroke: new Stroke({
            color: GRAY,
            width: 1.5
          })
        }),
        geometry: showVerticesSnapping
      })
    ]
  ],
  [
    KnownStyleKey.SelectedFeaturesWithVertices,
    [
      new Style({
        fill: new Fill({
          color: FILL_YELLOW
        })
      }),
      new Style({
        stroke: new Stroke({
          color: RED,
          width: DEFAULT_STROKE_WIDTH
        })
      }),
      new Style({
        image: new Circle({
          radius: DEFAULT_CIRCLE_RADIUS,
          fill: new Fill({
            color: RED
          }),
          stroke: new Stroke({
            color: GRAY,
            width: 1
          })
        }),
        geometry: showVerticesSnapping
      })
    ]
  ],
  [
    KnownStyleKey.SelectedFeatures,
    [
      new Style({
        zIndex: 1000,
        fill: new Fill({
          color: FILL_YELLOW
        })
      }),
      new Style({
        zIndex: 1000,
        stroke: new Stroke({
          color: RED,
          width: DEFAULT_STROKE_WIDTH
        })
      }),
      new Style({
        image: new Circle({
          radius: DEFAULT_CIRCLE_RADIUS,
          fill: new Fill({
            color: RED
          }),
          stroke: new Stroke({
            color: GRAY,
            width: 1
          })
        })
      })
    ]
  ],
  [
    KnownStyleKey.LabelsDrawStyles,
    [
      new Style({
        fill: new Fill({
          color: FILL_GRAY
        }),
        stroke: new Stroke({
          color: BLUE,
          lineDash: [10, 10],
          width: DEFAULT_STROKE_WIDTH
        }),
        image: new CircleStyle({
          radius: 5,
          stroke: new Stroke({
            color: BLUE
          }),
          fill: new Fill({
            color: FILL_GRAY
          })
        })
      })
    ]
  ],
  [
    KnownStyleKey.Prokol,
    [
      new Style({
        zIndex: 15_000,
        stroke: new Stroke({
          color: RED,
          width: DEFAULT_STROKE_WIDTH
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

function showVerticesSnapping(feature: FeatureLike) {
  const geometry = feature.getGeometry();
  if (geometry === undefined) {
    return;
  }

  // Когда приходит фича как "не существующая" точка, то это от клика по отдельной координате, из правой панели, для
  // подсветки
  if (extractFeatureTypeName(String(feature.getId())).length === 0 && geometry.getType() === 'Point') {
    return new MultiPoint([(geometry as Point).getCoordinates()]);
  }

  return showVertices() ? convertToFlatMultiPoint(geometry) : new MultiPoint([(geometry as Point).getCoordinates()]);
}

function showVertices(): boolean {
  return (
    mapStore.mode === MapMode.VERTICES_MODIFICATION ||
    mapStore.mode === MapMode.SELECTED_FEATURES ||
    mapStore.mode === MapMode.DRAW_FEATURE ||
    mapStore.mode === MapMode.EDIT_FEATURE
  );
}
