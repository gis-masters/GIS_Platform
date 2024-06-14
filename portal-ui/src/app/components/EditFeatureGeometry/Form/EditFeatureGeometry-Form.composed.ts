import { compose, HOC } from '@bem-react/core';

import { withTypeLineString } from './_type/EditFeatureGeometry-Form_type_LineString';
import { withTypeMultiLineString } from './_type/EditFeatureGeometry-Form_type_MultiLineString';
import { withTypeMultiPoint } from './_type/EditFeatureGeometry-Form_type_MultiPoint';
import { withTypeMultiPolygon } from './_type/EditFeatureGeometry-Form_type_MultiPolygon';
import { withTypePoint } from './_type/EditFeatureGeometry-Form_type_Point';
import { withTypePolygon } from './_type/EditFeatureGeometry-Form_type_Polygon';
import { EditFeatureGeometryFormBase, EditFeatureGeometryFormProps } from './EditFeatureGeometry-Form.base';

export const EditFeatureGeometryForm = compose(
  withTypePoint as HOC<EditFeatureGeometryFormProps>,
  withTypeMultiPoint as HOC<EditFeatureGeometryFormProps>,
  withTypeMultiLineString as HOC<EditFeatureGeometryFormProps>,
  withTypeLineString as HOC<EditFeatureGeometryFormProps>,
  withTypePolygon as HOC<EditFeatureGeometryFormProps>,
  withTypeMultiPolygon as HOC<EditFeatureGeometryFormProps>
)(EditFeatureGeometryFormBase);
