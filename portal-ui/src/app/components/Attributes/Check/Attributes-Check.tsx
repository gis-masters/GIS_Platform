import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Checkbox } from '@mui/material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { MapSelectionTypes, mapStore } from '../../../stores/Map.store';
import { mapSelectionService } from '../../../services/map/map-selection.service';
import { FilterQuery } from '../../../services/util/filterObjects';

import { AttributesTableRecord } from '../Table/Attributes-Table';

const cnAttributesCheck = cn('Attributes', 'Check');

interface AttributesCheckProps {
  rowData: AttributesTableRecord;
  field: keyof AttributesTableRecord;
  filterActive: boolean;
  filterParams: FilterQuery;
}

@observer
export class AttributesCheck extends Component<AttributesCheckProps> {
  render() {
    const { rowData } = this.props;

    return (
      <Checkbox
        className={cnAttributesCheck()}
        checked={mapStore.selectedFeatures.some(feature => feature.id === rowData.feature.id)}
        value={rowData.feature.id}
        onChange={this.changeHandler}
      />
    );
  }

  @boundMethod
  private changeHandler(e: React.ChangeEvent<HTMLInputElement>, checked: boolean) {
    const { rowData } = this.props;
    const selectionType = checked ? MapSelectionTypes.ADD : MapSelectionTypes.REMOVE;
    mapSelectionService.selectFeatures([rowData.feature], selectionType);
  }
}
