import React, { Component } from 'react';
import { computed, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { Tab, TabProps } from '@mui/material';
import { Close } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { communicationService } from '../../../services/communication.service';
import { CrgVectorLayer } from '../../../services/gis/layers/layers.models';
import { selectedFeaturesStore } from '../../../services/map/a-map-mode/selected-features/SelectedFeatures.store';
import { MapAction } from '../../../services/map/map.models';
import { attributesTableStore } from '../../../stores/AttributesTable.store';
import { mapStore } from '../../../stores/Map.store';
import { IconButton } from '../../IconButton/IconButton';
import { TabInner } from '../../TabInner/TabInner';
import { TabTitle } from '../../TabTitle/TabTitle';
import { AttributesTabFilterMark } from '../TabFilterMark/Attributes-TabFilterMark';

import '!style-loader!css-loader!sass-loader!./Attributes-Tab.scss';

const cnAttributesTab = cn('Attributes', 'Tab');
const cnAttributesTabClose = cn('Attributes', 'TabClose');

interface AttributesTabProps extends TabProps {
  layer: CrgVectorLayer;
  grade: 'hard' | 'soft';
  selected?: boolean;
  onClose(layer: CrgVectorLayer): void;
  onMinimize(layer: CrgVectorLayer): void;
}

@observer
export class AttributesTab extends Component<AttributesTabProps> {
  constructor(props: AttributesTabProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { layer, grade, className, selected = false, onMinimize, ...props } = this.props;

    return (
      <Tab
        className={cnAttributesTab({ grade, selected }, [className])}
        onClick={this.handleClick}
        disabled={!mapStore.allowedActions.includes(MapAction.ATTRIBUTES_TAB)}
        label={
          <TabInner>
            <TabTitle selected={selected}>{layer.title}</TabTitle>

            {!!this.selectedFeaturesCount && <>&nbsp;({this.selectedFeaturesCount})</>}

            {attributesTableStore.isLayerFiltered(layer) && <AttributesTabFilterMark />}

            <IconButton
              className={cnAttributesTabClose()}
              href='#'
              edge='end'
              size='small'
              color='inherit'
              onPointerDown={this.handleClosePointerDown}
              onMouseDown={this.handleClosePointerDown}
              onClick={this.handleCloseClick}
            >
              <Close fontSize='small' />
            </IconButton>
          </TabInner>
        }
        {...props}
      />
    );
  }

  @computed
  private get selectedFeaturesCount(): number {
    return selectedFeaturesStore.featuresByTableName[this.props.layer.tableName]?.length || 0;
  }

  @boundMethod
  private handleClick() {
    const { layer, selected, onMinimize } = this.props;

    if (selected) {
      onMinimize(layer);
    } else {
      communicationService.openAttributesBar.emit(layer);
    }
  }

  private handleClosePointerDown(e: React.PointerEvent<HTMLButtonElement>) {
    e.stopPropagation();
  }

  @boundMethod
  private handleCloseClick(e: React.PointerEvent<HTMLButtonElement>) {
    e.stopPropagation();
    e.preventDefault();
    const { layer, onClose } = this.props;
    onClose(layer);
  }
}
