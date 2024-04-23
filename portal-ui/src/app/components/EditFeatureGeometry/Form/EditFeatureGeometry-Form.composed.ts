import { compose } from '@bem-react/core';

import { withTypeLineString } from './_type/EditFeatureGeometry-Form_type_LineString';
import { withTypeMultiLineString } from './_type/EditFeatureGeometry-Form_type_MultiLineString';
import { withTypeMultiPoint } from './_type/EditFeatureGeometry-Form_type_MultiPoint';
import { withTypeMultiPolygon } from './_type/EditFeatureGeometry-Form_type_MultiPolygon';
import { withTypePoint } from './_type/EditFeatureGeometry-Form_type_Point';
import { withTypePolygon } from './_type/EditFeatureGeometry-Form_type_Polygon';
import { EditFeatureGeometryForm as Presenter } from './EditFeatureGeometry-Form';

export const EditFeatureGeometryForm = compose(
  withTypePoint,
  withTypeMultiPoint,
  withTypeMultiLineString,
  withTypeLineString,
  withTypePolygon,
  withTypeMultiPolygon
)(Presenter);
