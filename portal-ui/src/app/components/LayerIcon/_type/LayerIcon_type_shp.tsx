import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { ReportProblemOutlined, SvgIconComponent } from '@mui/icons-material';
import { withBemMod } from '@bem-react/core';

import { GeometryType, SupportedGeometryType } from '../../../services/geoserver/wfs/wfs.models';
import { getLayerSchema } from '../../../services/gis/layers/layers.service';
import { TypeShpLine } from '../../Icons/TypeShpLine';
import { TypeShpPoint } from '../../Icons/TypeShpPoint';
import { TypeShpPolygon } from '../../Icons/TypeShpPolygon';
import { cnLayerIcon, LayerIconProps } from '../LayerIcon.base';

@observer
class LayerIconTypeShp extends Component<LayerIconProps> {
  @observable geometryType: SupportedGeometryType | 'unknown' = 'unknown';

  constructor(props: LayerIconProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount() {
    const { layer } = this.props;

    if (layer) {
      const schema = await getLayerSchema(layer);
      if (schema?.geometryType) {
        this.setGeometryType(schema.geometryType);
      }
    }
  }

  render() {
    const { className, colorized, size } = this.props;
    let Icon: SvgIconComponent;
    let htmlColor: string = '';

    switch (this.geometryType) {
      case GeometryType.POLYGON:
      case GeometryType.MULTI_POLYGON: {
        Icon = TypeShpPolygon;
        break;
      }
      case GeometryType.LINE_STRING:
      case GeometryType.MULTI_LINE_STRING: {
        Icon = TypeShpLine;
        break;
      }
      case GeometryType.POINT:
      case GeometryType.MULTI_POINT: {
        Icon = TypeShpPoint;
        break;
      }
      default: {
        Icon = ReportProblemOutlined;
        htmlColor = '#ffc107';
      }
    }

    return (
      <Icon
        className={className}
        color={colorized && !htmlColor ? 'primary' : 'inherit'}
        htmlColor={colorized && htmlColor ? htmlColor : ''}
        fontSize={size}
      />
    );
  }

  @action
  private setGeometryType(geometryType: SupportedGeometryType | 'unknown') {
    this.geometryType = geometryType;
  }
}

export const withTypeShp = withBemMod<LayerIconProps, LayerIconProps>(
  cnLayerIcon(),
  { type: 'shp' },
  () =>
    ({ className, ...props }) => <LayerIconTypeShp {...props} className={cnLayerIcon(null, [className])} />
);
