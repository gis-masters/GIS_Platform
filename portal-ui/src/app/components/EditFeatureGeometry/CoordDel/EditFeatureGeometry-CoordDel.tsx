import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Tooltip } from '@mui/material';
import { DeleteOutline } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { IconButton } from '../../IconButton/IconButton';

import './EditFeatureGeometry-CoordDel.scss';

const cnEditFeatureGeometryCoordDel = cn('EditFeatureGeometry', 'CoordDel');

interface EditFeatureGeometryCoordDelProps {
  disabled: boolean | undefined;
  onClick(): void;
  onMouseEnter(): void;
  onMouseLeave(): void;
}

@observer
export class EditFeatureGeometryCoordDel extends Component<EditFeatureGeometryCoordDelProps> {
  render() {
    const disabled = this.props.disabled;

    return (
      <Tooltip title='Удалить вершину' enterDelay={800}>
        <span>
          <IconButton
            className={cnEditFeatureGeometryCoordDel()}
            onClick={this.handleClick}
            onMouseEnter={this.handleMouseEnter}
            onMouseLeave={this.handleMouseLeave}
            size='small'
            disabled={disabled}
          >
            <DeleteOutline color={disabled ? 'disabled' : 'error'} fontSize='small' />
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

  @boundMethod
  private handleMouseEnter(): void {
    this.props.onMouseEnter();
  }

  @boundMethod
  private handleMouseLeave(): void {
    this.props.onMouseLeave();
  }
}
