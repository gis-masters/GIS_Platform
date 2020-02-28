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
  onDelete?: (index: number) => void;
  canBeDeleted?: boolean;
  etalon?: Coordinate;
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
    const { val, withControls, index, canBeDeleted, etalon } = this.props;
    const xNotClosed = etalon ? etalon[0] !== Number(val[0]) : false;
    const yNotClosed = etalon ? etalon[1] !== Number(val[1]) : false;

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
            error={!isDimensionValid(val[0]) || xNotClosed}
            onChange={this.changeXHandler}
            variant="outlined"
        />

        <TextField
            className={cnEditFeatureGeometry('CoordInput', { d: 'y' })}
            value={val[1]}
            error={!isDimensionValid(val[1]) || yNotClosed}
            onChange={this.changeYHandler}
            variant="outlined"
        />

        <EditFeatureGeometryCoordPick
            onClick={this.pickerClickHandler}
            onBlur={this.pickerBlurHandler}
            active={this.picking}
            btnRef={this.pickRef}
        />

        {withControls ? (
          <EditFeatureGeometryCoordDel onClick={this.deleteHandler} disabled={!canBeDeleted} />
        ) : null}
      </div>
    );
  }

  @action
  private changeXHandler (e: React.ChangeEvent<HTMLInputElement>) {
    this.props.val[0] = e.target.value;
  }

  @action
  private changeYHandler (e: React.ChangeEvent<HTMLInputElement>) {
    this.props.val[1] = e.target.value;
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
    this.props.val.splice(0, 2, ...this.props.store.currentProjection.to(e.coordinate));
    this.offPicking();
  }

  private keyHandler (e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'Escape') {
      this.offPicking();
    }
  }
}
