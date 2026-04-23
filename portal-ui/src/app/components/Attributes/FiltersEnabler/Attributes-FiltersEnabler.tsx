import React, { type ChangeEvent, Component } from 'react';
import { observer } from 'mobx-react';
import { Switch, Tooltip } from '@mui/material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { type CrgVectorLayer } from '../../../services/gis/layers/layers.models';
import { attributesTableStore } from '../../../stores/AttributesTable.store';

import './Attributes-FiltersEnabler.scss';

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
            checked={attributesTableStore.isLayerFilterEnabled(layer.resourceId)}
            onChange={this.handleChange}
          />
        </span>
      </Tooltip>
    );
  }

  @boundMethod
  private handleChange(_e: ChangeEvent<HTMLInputElement>, checked: boolean) {
    // eslint-disable-next-line sonarjs/no-selector-parameter -- MUI Switch: один onChange(_, checked)
    if (checked) {
      attributesTableStore.enableFilterForLayer(this.props.layer);
    } else {
      attributesTableStore.disableFilterForLayer(this.props.layer);
    }
  }
}
