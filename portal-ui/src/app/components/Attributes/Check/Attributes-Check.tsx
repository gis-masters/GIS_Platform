import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Checkbox } from '@mui/material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { MapSelectionTypes, mapStore } from '../../../stores/Map.store';
import { mapSelectionService } from '../../../services/map/map-selection.service';
import { WfsFeature } from '../../../services/geoserver/wfs/wfs.models';

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
        checked={mapStore.selectedFeatures.some(({ id }) => id === feature.id)}
        value={feature.id}
        onChange={this.changeHandler}
      />
    );
  }

  @boundMethod
  private changeHandler(e: React.ChangeEvent<HTMLInputElement>, checked: boolean) {
    const { feature } = this.props;
    if (mapStore.limitReached) {
      mapSelectionService.selectFeatures([feature], !checked && MapSelectionTypes.REMOVE);
    } else {
      const selectionType = checked ? MapSelectionTypes.ADD : MapSelectionTypes.REMOVE;
      mapSelectionService.selectFeatures([feature], selectionType);
    }
  }
}
