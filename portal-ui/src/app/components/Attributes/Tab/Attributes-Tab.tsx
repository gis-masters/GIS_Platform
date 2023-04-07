import React, { Component } from 'react';
import { computed, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { Tab, TabProps } from '@mui/material';
import { Close } from '@mui/icons-material';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';

import { mapStore } from '../../../stores/Map.store';
import { attributesTableStore } from '../../../stores/AttributesTable.store';
import { communicationService } from '../../../services/communication.service';
import { CrgVectorLayer } from '../../../services/gis/layers/layers.models';
import { IconButton } from '../../IconButton/IconButton';

import { AttributesTabInner } from '../TabInner/Attributes-TabInner';
import { AttributesTabTitle } from '../TabTitle/Attributes-TabTitle';
import { AttributesTabFilterMark } from '../TabFilterMark/Attributes-TabFilterMark';

import '!style-loader!css-loader!sass-loader!./Attributes-Tab.scss';

const cnAttributesTab = cn('Attributes', 'Tab');
const cnAttributesTabClose = cn('Attributes', 'TabClose');

interface AttributesTabProps extends TabProps {
  layer: CrgVectorLayer;
  grade: 'hard' | 'soft';
  selected?: boolean;
  onClose: (layer: CrgVectorLayer) => void;
  onMinimize: (layer: CrgVectorLayer) => void;
}

@observer
export class AttributesTab extends Component<AttributesTabProps> {
  constructor(props: AttributesTabProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { layer, grade, className, selected, onMinimize, ...props } = this.props;

    return (
      <Tab
        className={cnAttributesTab({ grade, selected }, [className])}
        onClick={this.clickHandler}
        label={
          <AttributesTabInner>
            <AttributesTabTitle selected={selected}>{layer.title}</AttributesTabTitle>

            {!!this.selectedFeaturesCount && <>&nbsp;({this.selectedFeaturesCount})</>}

            {attributesTableStore.isLayerFiltered(layer) && <AttributesTabFilterMark />}

            <IconButton
              className={cnAttributesTabClose()}
              href='#'
              edge='end'
              size='small'
              color='inherit'
              onPointerDown={this.closePointerDownHandler}
              onMouseDown={this.closePointerDownHandler}
              onClick={this.closeClickHandler}
            >
              <Close fontSize='small' />
            </IconButton>
          </AttributesTabInner>
        }
        {...props}
      />
    );
  }

  @computed
  private get selectedFeaturesCount(): number {
    return mapStore.selectedFeaturesByTableName[this.props.layer.tableName]?.length || 0;
  }

  @boundMethod
  private clickHandler() {
    const { layer, selected, onMinimize } = this.props;
    if (selected) {
      onMinimize(layer);
    } else {
      communicationService.openAttributesBar.emit(layer);
    }
  }

  private closePointerDownHandler(e: React.PointerEvent<HTMLButtonElement>) {
    e.stopPropagation();
  }

  @boundMethod
  private closeClickHandler(e: React.PointerEvent<HTMLButtonElement>) {
    e.stopPropagation();
    e.preventDefault();
    const { layer, onClose } = this.props;
    onClose(layer);
  }
}
