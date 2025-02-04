import { compose, HOC } from '@bem-react/core';

import { withTypeAll } from './_type/CustomStyleControl-Form_type_all';
import { withTypeLine } from './_type/CustomStyleControl-Form_type_line';
import { withTypePoint } from './_type/CustomStyleControl-Form_type_point';
import { withTypePolygon } from './_type/CustomStyleControl-Form_type_polygon';
import { CustomStyleControlFormBase, CustomStyleControlFormProps } from './CustomStyleControl-Form.base';

export const CustomStyleControlForm = compose(
  withTypePoint as HOC<CustomStyleControlFormProps>,
  withTypeLine as HOC<CustomStyleControlFormProps>,
  withTypePolygon as HOC<CustomStyleControlFormProps>,
  withTypeAll as HOC<CustomStyleControlFormProps>
)(CustomStyleControlFormBase);
