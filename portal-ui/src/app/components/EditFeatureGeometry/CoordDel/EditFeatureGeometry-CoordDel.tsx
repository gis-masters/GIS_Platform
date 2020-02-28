import React, { Component } from 'react';
import { IconButton, Tooltip } from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./EditFeatureGeometry-CoordDel.scss';

const cnEditFeatureGeometry = cn('EditFeatureGeometry');

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
      <IconButton className={cnEditFeatureGeometry('CoordDel')}
                  onClick={this.clickHandler}
                  size="small"
                  disabled={this.props.disabled}>
        <Tooltip title='Удалить узел' enterDelay={800}>
          <Delete />
        </Tooltip>
      </IconButton>
    );
  }

  private clickHandler (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.currentTarget.blur();
    this.props.onClick();
  }
}
