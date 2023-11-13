import { HOC, compose } from '@bem-react/core';

import { CustomStyleControlFormBase, CustomStyleControlFormProps } from './CustomStyleControl-Form.base';
import { withTypePolygon } from './_type/CustomStyleControl-Form_type_polygon';
import { withTypePoint } from './_type/CustomStyleControl-Form_type_point';
import { withTypeLine } from './_type/CustomStyleControl-Form_type_line';

export const CustomStyleControlForm = compose(
  withTypePolygon as HOC<CustomStyleControlFormProps>,
  withTypeLine as HOC<CustomStyleControlFormProps>,
  withTypePoint as HOC<CustomStyleControlFormProps>
)(CustomStyleControlFormBase);
