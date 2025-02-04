import { compose, HOC } from '@bem-react/core';

import { withTypeLookup } from './_type/EditFeatureField-Control_type_lookup';
import { withTypeUrl } from './_type/EditFeatureField-Control_type_url';
import { EditFeatureFieldControlBase, EditFeatureFieldControlProps } from './EditFeatureField-Control.base';

export const EditFeatureFieldControl = compose(
  withTypeUrl as HOC<EditFeatureFieldControlProps>,
  withTypeLookup as HOC<EditFeatureFieldControlProps>
)(EditFeatureFieldControlBase);
