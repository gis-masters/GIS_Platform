import { compose } from '@bem-react/core';

import { EditFeatureGeometryForm as Presenter } from './EditFeatureGeometry-Form';
import { withTypePoint } from './_type/EditFeatureGeometry-Form_type_Point';
import { withTypeMultiPoint } from './_type/EditFeatureGeometry-Form_type_MultiPoint';
import { withTypeMultiLineString } from './_type/EditFeatureGeometry-Form_type_MultiLineString';
import { withTypeLineString } from './_type/EditFeatureGeometry-Form_type_LineString';
import { withTypePolygon } from './_type/EditFeatureGeometry-Form_type_Polygon';
import { withTypeMultiPolygon } from './_type/EditFeatureGeometry-Form_type_MultiPolygon';

export const EditFeatureGeometryForm = compose(
  withTypePoint,
  withTypeMultiPoint,
  withTypeMultiLineString,
  withTypeLineString,
  withTypePolygon,
  withTypeMultiPolygon
)(Presenter);
