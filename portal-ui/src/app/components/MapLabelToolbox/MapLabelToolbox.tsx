import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Paper } from '@mui/material';
import { CloseOutlined, EditOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { Feature } from 'ol';

import { LabelType } from '../../services/map/map.models';
import { IconButton } from '../IconButton/IconButton';

import '!style-loader!css-loader!sass-loader!./MapLabelToolbox.scss';

const cnMapLabelToolbox = cn('MapLabelToolbox');

interface MapLabelToolboxProps {
  feature: Feature;
  labelType: LabelType;
  onEdit(feature: Feature): void;
  onRemove(feature: Feature): void;
  onMouseEnter(): void;
  onMouseLeave(): void;
}

@observer
export class MapLabelToolbox extends Component<MapLabelToolboxProps> {
  render() {
    const { labelType, onMouseEnter, onMouseLeave } = this.props;

    return (
      <Paper className={cnMapLabelToolbox()} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        {labelType === 'label' && (
          <IconButton size='small' onClick={this.handleEdit}>
            <EditOutlined fontSize='small' />
          </IconButton>
        )}
        <IconButton size='small' onClick={this.handleRemove}>
          <CloseOutlined fontSize='small' />
        </IconButton>
      </Paper>
    );
  }

  @boundMethod
  private handleEdit() {
    const { feature, onEdit } = this.props;
    onEdit(feature);
  }

  @boundMethod
  private handleRemove() {
    const { feature, onRemove } = this.props;
    onRemove(feature);
  }
}
