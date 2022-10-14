import { compose } from '@bem-react/core';

import { EditFeatureGeometryView as Presenter } from './EditFeatureGeometry-View';
import { withTypePoint } from './_type/EditFeatureGeometry-View_type_Point';
import { withTypeMultiPoint } from './_type/EditFeatureGeometry-View_type_MultiPoint';
import { withTypeLineString } from './_type/EditFeatureGeometry-View_type_LineString';
import { withTypeMultiLineString } from './_type/EditFeatureGeometry-View_type_MultiLineString';
import { withTypePolygon } from './_type/EditFeatureGeometry-View_type_Polygon';
import { withTypeMultiPolygon } from './_type/EditFeatureGeometry-View_type_MultiPolygon';

export const EditFeatureGeometryView = compose(
  withTypePoint,
  withTypeMultiPoint,
  withTypeLineString,
  withTypeMultiLineString,
  withTypePolygon,
  withTypeMultiPolygon
)(Presenter) as typeof Presenter;
