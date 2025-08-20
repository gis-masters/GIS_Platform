import React, { Component } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { DeleteOutline } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import '!style-loader!css-loader!sass-loader!./EditFeatureGeometry-CoordDel.scss';

const cnEditFeatureGeometryCoordDel = cn('EditFeatureGeometry', 'CoordDel');

interface EditFeatureGeometryCoordDelProps {
  onClick(): void;
  disabled: boolean;
}

export class EditFeatureGeometryCoordDel extends Component<EditFeatureGeometryCoordDelProps> {
  render() {
    return (
      <Tooltip title='Удалить вершину' enterDelay={800}>
        <span>
          <IconButton
            className={cnEditFeatureGeometryCoordDel()}
            onClick={this.handleClick}
            size='small'
            disabled={this.props.disabled}
          >
            <DeleteOutline color={this.props.disabled ? 'disabled' : 'error'} fontSize='small' />
          </IconButton>
        </span>
      </Tooltip>
    );
  }

  @boundMethod
  private handleClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.currentTarget.blur();
    this.props.onClick();
  }
}
