import { compose } from '@bem-react/core';

import { withTypeLineString } from './_type/EditFeatureGeometry-View_type_LineString';
import { withTypeMultiLineString } from './_type/EditFeatureGeometry-View_type_MultiLineString';
import { withTypeMultiPoint } from './_type/EditFeatureGeometry-View_type_MultiPoint';
import { withTypeMultiPolygon } from './_type/EditFeatureGeometry-View_type_MultiPolygon';
import { withTypePoint } from './_type/EditFeatureGeometry-View_type_Point';
import { withTypePolygon } from './_type/EditFeatureGeometry-View_type_Polygon';
import { EditFeatureGeometryView as Presenter } from './EditFeatureGeometry-View';

export const EditFeatureGeometryView = compose(
  withTypePoint,
  withTypeMultiPoint,
  withTypeLineString,
  withTypeMultiLineString,
  withTypePolygon,
  withTypeMultiPolygon
)(Presenter) as typeof Presenter;
