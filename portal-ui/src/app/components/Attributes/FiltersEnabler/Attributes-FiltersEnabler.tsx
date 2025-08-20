import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Switch, Tooltip } from '@mui/material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { CrgVectorLayer } from '../../../services/gis/layers/layers.models';
import { attributesTableStore } from '../../../stores/AttributesTable.store';

import '!style-loader!css-loader!sass-loader!./Attributes-FiltersEnabler.scss';

const cnAttributesFiltersEnabler = cn('Attributes', 'FiltersEnabler');

interface AttributesFiltersEnablerProps {
  layer: CrgVectorLayer;
}

@observer
export class AttributesFiltersEnabler extends Component<AttributesFiltersEnablerProps> {
  render() {
    const { layer } = this.props;

    return (
      <Tooltip title='Фильтровать объекты на карте, используя фильтры атрибутивной таблицы'>
        <span>
          <Switch
            className={cnAttributesFiltersEnabler()}
            size='small'
            checked={attributesTableStore.isLayerFilterEnabled(layer.tableName)}
            onChange={this.handleChange}
          />
        </span>
      </Tooltip>
    );
  }

  @boundMethod
  private handleChange(e: React.ChangeEvent<HTMLInputElement>, checked: boolean) {
    attributesTableStore.setFilterEnablednessForLayer(this.props.layer, checked);
  }
}
