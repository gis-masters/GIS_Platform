import { HOC, composeU } from '@bem-react/core';

import { LayerIconProps, LayerIconBase as Presenter } from './LayerIcon.base';
import { withTypeError } from './_type/LayerIcon_type_error';
import { withTypeGroup } from './_type/LayerIcon_type_group';
import { withTypeRaster } from './_type/LayerIcon_type_raster';
import { withTypeVector } from './_type/LayerIcon_type_vector';
import { withTypeDxf } from './_type/LayerIcon_type_dxf';
import { withTypeShp } from './_type/LayerIcon_type_shp';
import { withTypeTab } from './_type/LayerIcon_type_tab';
import { withTypeMid } from './_type/LayerIcon_type_mid';

export const LayerIcon = composeU(
  withTypeVector as HOC<LayerIconProps>,
  withTypeDxf as HOC<LayerIconProps>,
  withTypeShp as HOC<LayerIconProps>,
  withTypeTab as HOC<LayerIconProps>,
  withTypeMid as HOC<LayerIconProps>,
  withTypeRaster as HOC<LayerIconProps>,
  withTypeError as HOC<LayerIconProps>,
  withTypeGroup as HOC<LayerIconProps>
)(Presenter) as typeof Presenter;
