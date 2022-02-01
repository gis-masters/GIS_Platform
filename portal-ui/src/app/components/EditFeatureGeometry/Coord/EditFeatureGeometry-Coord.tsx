import React, { Component } from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import TextField from '@mui/material/TextField';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { EditFeatureGeometryStore } from '../../../stores/EditFeatureGeometry.store';
import { CoordinateEdited } from '../../../services/geoserver/wfs.models';
import { isDimensionValid } from '../../../services/geoserver/wfs.service';

import { EditFeatureGeometryCoordDel } from '../CoordDel/EditFeatureGeometry-CoordDel';

import '!style-loader!css-loader!sass-loader!./EditFeatureGeometry-Coord.scss';
import '!style-loader!css-loader!sass-loader!../CoordInput/EditFeatureGeometry-CoordInput.scss';
import '!style-loader!css-loader!sass-loader!../CoordNumber/EditFeatureGeometry-CoordNumber.scss';

const cnEditFeatureGeometry = cn('EditFeatureGeometry');

interface EditFeatureGeometryCoordProps {
  store: EditFeatureGeometryStore;
  val: CoordinateEdited;
  withControls?: true;
  onChange: (val: CoordinateEdited, i: number) => void;
  onDelete?: (index: number) => void;
  canBeDeleted?: boolean;
  disabled?: boolean;
  index?: number;
  active?: boolean;
}

@observer
export class EditFeatureGeometryCoord extends Component<EditFeatureGeometryCoordProps> {
  @observable active = false;

  render() {
    const { val, withControls, index, canBeDeleted, disabled, active } = this.props;

    // у росреестра своё понимание X и Y
    return (
      <div className={cnEditFeatureGeometry('Coord', { withControls, active: active || this.active })}>
        {withControls ? <div className={cnEditFeatureGeometry('CoordNumber')}>{index + 1}</div> : null}

        <TextField
          className={cnEditFeatureGeometry('CoordInput', { d: 'x' })}
          value={val[1]}
          error={!isDimensionValid(val[1])}
          onChange={this.changeYHandler}
          variant='outlined'
          disabled={disabled}
        />

        <TextField
          className={cnEditFeatureGeometry('CoordInput', { d: 'y' })}
          value={val[0]}
          error={!isDimensionValid(val[0])}
          onChange={this.changeXHandler}
          variant='outlined'
          disabled={disabled}
        />

        {withControls ? (
          <EditFeatureGeometryCoordDel onClick={this.deleteHandler} disabled={!canBeDeleted || disabled} />
        ) : null}
      </div>
    );
  }

  @action.bound
  private changeXHandler(e: React.ChangeEvent<HTMLInputElement>) {
    const { val, onChange, index } = this.props;
    val[0] = e.target.value;
    onChange(val, index);
  }

  @action.bound
  private changeYHandler(e: React.ChangeEvent<HTMLInputElement>) {
    const { val, onChange, index } = this.props;
    val[1] = e.target.value;
    onChange(val, index);
  }

  @boundMethod
  private deleteHandler() {
    const { onDelete, index } = this.props;
    if (onDelete) {
      onDelete(index);
    }
  }
}
