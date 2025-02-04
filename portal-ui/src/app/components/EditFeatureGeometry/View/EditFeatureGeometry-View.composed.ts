import { compose, HOC } from '@bem-react/core';

import { withTypeLineString } from './_type/EditFeatureGeometry-View_type_LineString';
import { withTypeMultiLineString } from './_type/EditFeatureGeometry-View_type_MultiLineString';
import { withTypeMultiPoint } from './_type/EditFeatureGeometry-View_type_MultiPoint';
import { withTypeMultiPolygon } from './_type/EditFeatureGeometry-View_type_MultiPolygon';
import { withTypePoint } from './_type/EditFeatureGeometry-View_type_Point';
import { withTypePolygon } from './_type/EditFeatureGeometry-View_type_Polygon';
import { EditFeatureGeometryViewBase, EditFeatureGeometryViewProps } from './EditFeatureGeometry-View';

export const EditFeatureGeometryView = compose(
  withTypePoint as HOC<EditFeatureGeometryViewProps>,
  withTypeMultiPoint as HOC<EditFeatureGeometryViewProps>,
  withTypeLineString as HOC<EditFeatureGeometryViewProps>,
  withTypeMultiLineString as HOC<EditFeatureGeometryViewProps>,
  withTypePolygon as HOC<EditFeatureGeometryViewProps>,
  withTypeMultiPolygon as HOC<EditFeatureGeometryViewProps>
)(EditFeatureGeometryViewBase) as typeof EditFeatureGeometryViewBase;
