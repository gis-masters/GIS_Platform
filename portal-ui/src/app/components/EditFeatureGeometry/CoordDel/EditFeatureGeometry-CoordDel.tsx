import React, { Component } from 'react';
import { IconButton, Tooltip } from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import '!style-loader!css-loader!sass-loader!./EditFeatureGeometry-CoordDel.scss';

const cnEditFeatureGeometryCoordDel = cn('EditFeatureGeometry', 'CoordDel');

interface EditFeatureGeometryCoordDelProps {
  onClick: () => void;
  disabled: boolean;
}

export class EditFeatureGeometryCoordDel extends Component<EditFeatureGeometryCoordDelProps> {
  render() {
    return (
      <Tooltip title='Удалить узел' enterDelay={800}>
        <span>
          <IconButton
            className={cnEditFeatureGeometryCoordDel()}
            onClick={this.clickHandler}
            size='small'
            disabled={this.props.disabled}
          >
            <Delete />
          </IconButton>
        </span>
      </Tooltip>
    );
  }

  @boundMethod
  private clickHandler(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.currentTarget.blur();
    this.props.onClick();
  }
}
