import { compose, type HOC } from '@bem-react/core';

import { withMultiple } from './_multiple/EditFeatureGeometry-Group_multiple';
import { EditFeatureGeometryGroupBase, type EditFeatureGeometryGroupProps } from './EditFeatureGeometry-Group.base';

export const EditFeatureGeometryGroup = compose(withMultiple as HOC<EditFeatureGeometryGroupProps>)(
  EditFeatureGeometryGroupBase
);
