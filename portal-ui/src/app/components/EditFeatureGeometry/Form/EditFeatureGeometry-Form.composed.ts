import { compose } from '@bem-react/core';

import { EditFeatureGeometryForm as EditFeatureGeometryFormPresenter } from './EditFeatureGeometry-Form';
import { withTypePoint } from './_type/EditFeatureGeometry-Form_type_Point';
import { withTypeMultiLineString } from './_type/EditFeatureGeometry-Form_type_MultiLineString';
import { withTypeMultiPolygon } from './_type/EditFeatureGeometry-Form_type_MultiPolygon';

export const EditFeatureGeometryForm = compose(
  withTypePoint,
  withTypeMultiLineString,
  withTypeMultiPolygon
)(EditFeatureGeometryFormPresenter);
