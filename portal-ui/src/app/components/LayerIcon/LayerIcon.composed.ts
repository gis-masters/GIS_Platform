import { composeU } from '@bem-react/core';

import { LayerIcon as Presenter } from './LayerIcon';
import { withTypeError } from './_type/LayerIcon_type_error';
import { withTypeGroup } from './_type/LayerIcon_type_group';
import { withTypeRaster } from './_type/LayerIcon_type_raster';
import { withTypeVector } from './_type/LayerIcon_type_vector';

export const LayerIcon = composeU(
  withTypeVector,
  withTypeRaster,
  withTypeError,
  withTypeGroup
)(Presenter) as typeof Presenter;
