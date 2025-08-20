import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Checkbox } from '@mui/material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { WfsFeature } from '../../../services/geoserver/wfs/wfs.models';
import { mapModeManager } from '../../../services/map/a-map-mode/MapModeManager';
import { selectedFeaturesStore } from '../../../services/map/a-map-mode/selected-features/SelectedFeatures.store';
import { MapMode, MapSelectionTypes } from '../../../services/map/map.models';

import '!style-loader!css-loader!sass-loader!./Attributes-Check.scss';

const cnAttributesCheck = cn('Attributes', 'Check');

interface AttributesCheckProps {
  feature: WfsFeature;
}

@observer
export class AttributesCheck extends Component<AttributesCheckProps> {
  render() {
    const { feature } = this.props;

    return (
      <Checkbox
        className={cnAttributesCheck()}
        checked={selectedFeaturesStore.features.some(({ id }) => id === feature.id)}
        value={feature.id}
        onChange={this.handleChange}
      />
    );
  }

  @boundMethod
  private async handleChange(e: React.ChangeEvent<HTMLInputElement>, checked: boolean) {
    const { feature } = this.props;
    if (selectedFeaturesStore.limitReached) {
      await mapModeManager.changeMode(
        MapMode.SELECTED_FEATURES,
        {
          payload: {
            features: [feature],
            type: (!checked && MapSelectionTypes.REMOVE) || undefined
          }
        },
        'check handleChange 1'
      );
    } else {
      const selectionType = checked ? MapSelectionTypes.ADD : MapSelectionTypes.REMOVE;
      await mapModeManager.changeMode(
        MapMode.SELECTED_FEATURES,
        {
          payload: {
            features: [feature],
            type: selectionType
          }
        },
        'check handleChange 2'
      );
    }
  }
}
