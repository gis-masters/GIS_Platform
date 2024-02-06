import { HOC, compose } from '@bem-react/core';

import { CustomStyleControlFormBase, CustomStyleControlFormProps } from './CustomStyleControl-Form.base';
import { withTypePoint } from './_type/CustomStyleControl-Form_type_point';
import { withTypeLine } from './_type/CustomStyleControl-Form_type_line';
import { withTypePolygon } from './_type/CustomStyleControl-Form_type_polygon';
import { withTypeAll } from './_type/CustomStyleControl-Form_type_all';

export const CustomStyleControlForm = compose(
  withTypePoint as HOC<CustomStyleControlFormProps>,
  withTypeLine as HOC<CustomStyleControlFormProps>,
  withTypePolygon as HOC<CustomStyleControlFormProps>,
  withTypeAll as HOC<CustomStyleControlFormProps>
)(CustomStyleControlFormBase);
