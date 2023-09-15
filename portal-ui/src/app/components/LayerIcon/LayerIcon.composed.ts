import { composeU } from '@bem-react/core';

import { LayerIcon as Presenter } from './LayerIcon';
import { withTypeError } from './_type/LayerIcon_type_error';
import { withTypeGroup } from './_type/LayerIcon_type_group';
import { withTypeRaster } from './_type/LayerIcon_type_raster';
import { withTypeVector } from './_type/LayerIcon_type_vector';
import { withTypeDxf } from './_type/LayerIcon_type_dxf';
import { withTypeShp } from './_type/LayerIcon_type_shp';

export const LayerIcon = composeU(
  withTypeVector,
  withTypeDxf,
  withTypeShp,
  withTypeRaster,
  withTypeError,
  withTypeGroup
)(Presenter) as typeof Presenter;
