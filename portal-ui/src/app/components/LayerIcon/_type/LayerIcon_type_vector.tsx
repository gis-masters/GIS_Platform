import React, { Component } from 'react';
import { action, observable, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';
import { Adjust, SvgIconComponent, PolylineOutlined, ReportProblemOutlined } from '@mui/icons-material';

import { GeometryType, SupportedGeometryType } from '../../../services/geoserver/wfs/wfs.models';
import { schemaService } from '../../../services/data/schema/schema.service';
import { LayerIconProps, cnLayerIcon } from '../LayerIcon.base';
import { Shape } from '../../Icons/Shape';

@observer
class LayerIconTypeVector extends Component<LayerIconProps> {
  @observable geometryType: SupportedGeometryType | 'unknown' = 'unknown';

  constructor(props: LayerIconProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount() {
    const { schemaId } = this.props;
    if (schemaId) {
      const schema = await schemaService.getSchema(schemaId);
      if (schema.geometryType) {
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
        Icon = Shape;
        break;
      }
      case GeometryType.LINE_STRING:
      case GeometryType.MULTI_LINE_STRING: {
        Icon = PolylineOutlined;
        break;
      }
      case GeometryType.POINT:
      case GeometryType.MULTI_POINT: {
        Icon = Adjust;
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

export const withTypeVector = withBemMod<LayerIconProps, LayerIconProps>(
  cnLayerIcon(),
  { type: 'vector' },
  () =>
    ({ className, ...props }: LayerIconProps) => (
      <LayerIconTypeVector {...props} className={cnLayerIcon(null, [className])} />
    )
);
