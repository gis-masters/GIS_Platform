import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./EditFeatureGeometry-CoordDel.scss';

const cnEditFeatureGeometry = cn('EditFeatureGeometry');

interface EditFeatureGeometryCoordDelProps {
  onClick: () => void;
  disabled: boolean;
}

export class EditFeatureGeometryCoordDel extends React.Component<EditFeatureGeometryCoordDelProps> {
  constructor (props: EditFeatureGeometryCoordDelProps) {
    super(props);

    this.clickHandler = this.clickHandler.bind(this);
  }

  render () {
    return (
      <IconButton className={cnEditFeatureGeometry('CoordDel')}
                  onClick={this.clickHandler}
                  aria-label="delete"
                  size="small"
                  disabled={this.props.disabled}>
        <DeleteIcon />
      </IconButton>
    );
  }

  private clickHandler (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.currentTarget.blur();
    this.props.onClick();
  }
}
