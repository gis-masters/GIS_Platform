import { compose } from '@bem-react/core';

import { EditFeatureGeometryView as EditFeatureGeometryViewPresenter } from './EditFeatureGeometry-View';
import { withTypePoint } from './_type/EditFeatureGeometry-View_type_Point';
import { withTypeMultiLineString } from './_type/EditFeatureGeometry-View_type_MultiLineString';
import { withTypeMultiPolygon } from './_type/EditFeatureGeometry-View_type_MultiPolygon';

export const EditFeatureGeometryView = compose(
  withTypePoint,
  withTypeMultiLineString,
  withTypeMultiPolygon
)(EditFeatureGeometryViewPresenter);
