import React, { Component } from 'react';
import { IconButton, Tooltip } from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./EditFeatureGeometry-CoordDel.scss';

const cnEditFeatureGeometryCoordDel = cn('EditFeatureGeometry', 'CoordDel');

interface EditFeatureGeometryCoordDelProps {
  onClick: () => void;
  disabled: boolean;
}

export class EditFeatureGeometryCoordDel extends Component<EditFeatureGeometryCoordDelProps> {
  constructor (props: EditFeatureGeometryCoordDelProps) {
    super(props);

    this.clickHandler = this.clickHandler.bind(this);
  }

  render () {
    return (
      <Tooltip title='Удалить узел' enterDelay={800}>
        <span>
          <IconButton className={cnEditFeatureGeometryCoordDel()}
                  onClick={this.clickHandler}
                  size="small"
                  disabled={this.props.disabled}>

            <Delete />
          </IconButton>
        </span>
      </Tooltip>
    );
  }

  private clickHandler (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.currentTarget.blur();
    this.props.onClick();
  }
}
