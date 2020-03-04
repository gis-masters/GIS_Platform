import React, { Component, createRef } from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import TextField from '@material-ui/core/TextField';
import { Coordinate } from 'ol/coordinate';
import MapBrowserEvent from 'ol/MapBrowserEvent';
import { cn } from '@bem-react/classname';

import { CoordinateEdited } from '../../../services/geoserver/wfs-models';
import { isDimensionValid } from '../../../services/geoserver/wfs.service';
import { openLayersService } from '../../../services/open-layer/open-layers.service';
import { EditFeatureGeometryStore } from '../../../stores/EditFeatureGeometry.store';

import { EditFeatureGeometryCoordDel } from '../CoordDel/EditFeatureGeometry-CoordDel';
import { EditFeatureGeometryCoordPick } from '../CoordPick/EditFeatureGeometry-CoordPick';

import '!style-loader!css-loader!sass-loader!./EditFeatureGeometry-Coord.scss';
import '!style-loader!css-loader!sass-loader!../CoordInput/EditFeatureGeometry-CoordInput.scss';
import '!style-loader!css-loader!sass-loader!../CoordNumber/EditFeatureGeometry-CoordNumber.scss';

const cnEditFeatureGeometry = cn('EditFeatureGeometry');

interface EditFeatureGeometryCoordProps {
  store: EditFeatureGeometryStore;
  val: CoordinateEdited;
  withControls?: true;
  onChange?: (val: CoordinateEdited, i: number) => void;
  onDelete?: (index: number) => void;
  canBeDeleted?: boolean;
  disabled?: boolean;
  index?: number;
}

@observer
export class EditFeatureGeometryCoord extends Component<EditFeatureGeometryCoordProps> {
  @observable private picking = false;
  private pickRef = createRef<HTMLButtonElement>();

  constructor (props: EditFeatureGeometryCoordProps) {
    super(props);

    this.changeXHandler = this.changeXHandler.bind(this);
    this.changeYHandler = this.changeYHandler.bind(this);
    this.deleteHandler = this.deleteHandler.bind(this);
    this.pickerClickHandler = this.pickerClickHandler.bind(this);
    this.pickerBlurHandler = this.pickerBlurHandler.bind(this);
    this.pickHandler = this.pickHandler.bind(this);
    this.keyHandler = this.keyHandler.bind(this);
  }

  componentWillUnmount () {
    this.offPicking();
  }

  render () {
    const { val, withControls, index, canBeDeleted, disabled } = this.props;

    return (
      <div className={cnEditFeatureGeometry('Coord', { withControls, active: this.picking })}
           onKeyDown={this.keyHandler}>
        {withControls ? (
          <div className={cnEditFeatureGeometry('CoordNumber')}>
            { index + 1 }
          </div>
        ) : null}

        <TextField
            className={cnEditFeatureGeometry('CoordInput', { d: 'x' })}
            value={val[0]}
            error={!isDimensionValid(val[0])}
            onChange={this.changeXHandler}
            variant="outlined"
            disabled={disabled}
        />

        <TextField
            className={cnEditFeatureGeometry('CoordInput', { d: 'y' })}
            value={val[1]}
            error={!isDimensionValid(val[1])}
            onChange={this.changeYHandler}
            variant="outlined"
            disabled={disabled}
        />

        <EditFeatureGeometryCoordPick
            onClick={this.pickerClickHandler}
            onBlur={this.pickerBlurHandler}
            active={this.picking}
            btnRef={this.pickRef}
            disabled={disabled}
        />

        {withControls ? (
          <EditFeatureGeometryCoordDel onClick={this.deleteHandler} disabled={!canBeDeleted || disabled} />
        ) : null}
      </div>
    );
  }

  @action
  private changeXHandler (e: React.ChangeEvent<HTMLInputElement>) {
    const { val, onChange, index } = this.props;
    val[0] = e.target.value;
    onChange(val, index);
  }

  @action
  private changeYHandler (e: React.ChangeEvent<HTMLInputElement>) {
    const { val, onChange, index } = this.props;
    val[1] = e.target.value;
    onChange(val, index);
  }

  @action
  private pick () {
    this.picking = true;
    openLayersService.pickPoint(this.pickHandler);
    document.body.classList.add('global-picking');
  }

  @action
  private offPicking () {
    this.picking = false;
    document.body.classList.remove('global-picking');
    if (this.pickRef.current) this.pickRef.current.blur();
    openLayersService.pickingOff();
  }

  private deleteHandler () {
    const { onDelete, index } = this.props;
    if (onDelete) {
      onDelete(index);
    }
  }

  private pickerClickHandler () {
    if (this.picking) {
      this.offPicking();
    } else {
      this.pick();
    }
  }

  private pickerBlurHandler () {
    this.offPicking();
  }

  @action
  private pickHandler (e: MapBrowserEvent) {
    const { val, onChange, index } = this.props;
    val.splice(0, 2, ...this.props.store.currentProjection.to(e.coordinate));
    onChange(val, index);
    this.offPicking();
  }

  private keyHandler (e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'Escape') {
      this.offPicking();
    }
  }
}
