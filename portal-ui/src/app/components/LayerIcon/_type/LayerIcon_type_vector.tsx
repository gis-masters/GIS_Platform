import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';

import { SupportedGeometryType } from '../../../services/geoserver/wfs/wfs.models';
import { getLayerSchema } from '../../../services/gis/layers/layers.service';
import { GeometryIcon } from '../../GeometryIcon/GeometryIcon';
import { cnLayerIcon, LayerIconProps } from '../LayerIcon.base';

@observer
class LayerIconTypeVector extends Component<LayerIconProps> {
  @observable geometryType: SupportedGeometryType | undefined = undefined;

  constructor(props: LayerIconProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount() {
    const { layer } = this.props;
    const schema = await getLayerSchema(layer);
    if (schema?.geometryType) {
      this.setGeometryType(schema.geometryType);
    }
  }

  render() {
    const { className, colorized, size } = this.props;

    return <GeometryIcon className={className} colorized={colorized} size={size} geometryType={this.geometryType} />;
  }

  @action
  private setGeometryType(geometryType?: SupportedGeometryType) {
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
