import { composeU, HOC } from '@bem-react/core';

import { withTypeDxf } from './_type/LayerIcon_type_dxf';
import { withTypeError } from './_type/LayerIcon_type_error';
import { withTypeGroup } from './_type/LayerIcon_type_group';
import { withTypeMid } from './_type/LayerIcon_type_mid';
import { withTypeRaster } from './_type/LayerIcon_type_raster';
import { withTypeShp } from './_type/LayerIcon_type_shp';
import { withTypeTab } from './_type/LayerIcon_type_tab';
import { withTypeVector } from './_type/LayerIcon_type_vector';
import { LayerIconBase as Presenter, LayerIconProps } from './LayerIcon.base';

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
