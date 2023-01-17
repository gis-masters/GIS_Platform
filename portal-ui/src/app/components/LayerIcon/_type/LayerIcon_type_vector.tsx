import React, { Component } from 'react';
import { action, observable, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { IClassNameProps, withBemMod } from '@bem-react/core';
import { Adjust, SvgIconComponent, PolylineOutlined, ReportProblemOutlined } from '@mui/icons-material';

import { GeometryType, SupportedGeometryType } from '../../../services/geoserver/wfs.models';
import { schemaService } from '../../../services/data/schema.service';
import { LayerIconProps, cnLayerIcon } from '../LayerIcon';
import { Shape } from '../../Icons/Shape';

interface LayerIconTypeVectorProps extends IClassNameProps {
  type: 'vector';
  schemaId?: string;
  colorized?: boolean;
}

@observer
class LayerIconTypeVector extends Component<LayerIconTypeVectorProps> {
  @observable geometryType: SupportedGeometryType | 'unknown' = 'unknown';

  constructor(props: LayerIconTypeVectorProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount() {
    const { schemaId } = this.props;
    if (schemaId) {
      const schema = await schemaService.getSchema(schemaId);
      this.setGeometryType(schema.geometryType);
    }
  }

  render() {
    const { className, colorized } = this.props;
    let Icon: SvgIconComponent;
    let htmlColor: string;

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
      />
    );
  }

  @action
  private setGeometryType(geometryType: SupportedGeometryType | 'unknown') {
    this.geometryType = geometryType;
  }
}

export const withTypeVector = withBemMod<LayerIconTypeVectorProps, LayerIconProps>(
  cnLayerIcon(),
  { type: 'vector' },
  () =>
    ({ className, ...props }) =>
      <LayerIconTypeVector {...props} className={cnLayerIcon(null, [className])} />
);
