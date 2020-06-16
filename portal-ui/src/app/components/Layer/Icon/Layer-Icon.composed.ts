import { composeU } from '@bem-react/core';

import { LayerIcon as Presenter } from './Layer-Icon';
import { withTypeUnknown } from './_type/Layer-Icon_type_unknown';
import { withTypeError } from './_type/Layer-Icon_type_error';
import { withTypeGroup } from './_type/Layer-Icon_type_group';
import { withTypePoint } from './_type/Layer-Icon_type_Point';
import { withTypeMultiLineString } from './_type/Layer-Icon_type_MultiLineString';
import { withTypeMultiPolygon } from './_type/Layer-Icon_type_MultiPolygon';

export const LayerIcon = composeU(
  withTypeUnknown,
  withTypeError,
  withTypeGroup,
  withTypePoint,
  withTypeMultiLineString,
  withTypeMultiPolygon
)(Presenter);
