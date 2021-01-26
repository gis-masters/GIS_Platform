import React, { Component } from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { IClassNameProps, withBemMod } from '@bem-react/core';
import { Adjust, Category, SvgIconComponent, Timeline } from '@material-ui/icons';
import GeometryType from 'ol/geom/GeometryType';

import { SupportedGeometryType } from '../../../services/geoserver/wfs.models';
import { schemaService } from '../../../services/crg/schema.service';
import { LayerIconProps, cnLayerIcon } from '../LayerIcon';
import { Shape } from '../../Icons/Shape';

interface LayerIconTypeVectorProps extends IClassNameProps {
  type: 'vector';
  schemaId?: string;
}

@observer
class LayerIconTypeVector extends Component<LayerIconTypeVectorProps> {
  @observable geometryType: SupportedGeometryType | 'unknown' = 'unknown';

  async componentDidMount() {
    const { schemaId } = this.props;
    if (schemaId) {
      const schema = await schemaService.getSchema(schemaId);
      this.setGeometryType(schema.geometryType);
    }
  }

  render() {
    const { className } = this.props;
    let Icon: SvgIconComponent;
    if (this.geometryType === GeometryType.MULTI_POLYGON) {
      Icon = Shape;
    } else if (this.geometryType === GeometryType.MULTI_LINE_STRING) {
      Icon = Timeline;
    } else if (this.geometryType === GeometryType.POINT) {
      Icon = Adjust;
    } else {
      Icon = Category;
    }

    return <Icon className={className} />;
  }

  @action
  private setGeometryType(geometryType: SupportedGeometryType | 'unknown') {
    this.geometryType = geometryType;
  }
}

export const withTypeVector = withBemMod<LayerIconTypeVectorProps, LayerIconProps>(
  cnLayerIcon(),
  { type: 'vector' },
  () => ({ className, ...props }) => <LayerIconTypeVector {...props} className={cnLayerIcon(null, [className])} />
);
