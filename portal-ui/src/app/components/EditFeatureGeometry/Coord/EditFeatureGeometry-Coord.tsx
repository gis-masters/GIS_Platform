import React from 'react';
import { action } from 'mobx';
import { observer } from 'mobx-react';
import TextField from '@material-ui/core/TextField';
import { Coordinate } from 'ol/coordinate';
import { cn } from '@bem-react/classname';

import { CoordinateEdited } from '../../../services/geoserver/wfs-models';
import { isDimensionValid } from '../../../services/geoserver/wfs.service';

import { EditFeatureGeometryCoordDel } from '../CoordDel/EditFeatureGeometry-CoordDel';

import '!style-loader!css-loader!sass-loader!./EditFeatureGeometry-Coord.scss';
import '!style-loader!css-loader!sass-loader!../CoordInput/EditFeatureGeometry-CoordInput.scss';
import '!style-loader!css-loader!sass-loader!../CoordNumber/EditFeatureGeometry-CoordNumber.scss';

const cnEditFeatureGeometry = cn('EditFeatureGeometry');

interface EditFeatureGeometryCoordProps {
  val: CoordinateEdited;
  withControls?: true;
  onDelete?: (index: number) => void;
  canBeDeleted?: boolean;
  etalon?: Coordinate;
  index?: number;
}

@observer
export class EditFeatureGeometryCoord extends React.Component<EditFeatureGeometryCoordProps> {
  constructor (props: EditFeatureGeometryCoordProps) {
    super(props);

    this.changeXHandler = this.changeXHandler.bind(this);
    this.changeYHandler = this.changeYHandler.bind(this);
    this.deleteHandler = this.deleteHandler.bind(this);
  }

  render () {
    const { val, withControls, index, canBeDeleted, etalon } = this.props;
    const xNotClosed = etalon ? etalon[0] !== Number(val[0]) : false;
    const yNotClosed = etalon ? etalon[1] !== Number(val[1]) : false;


    return (
      <div className={cnEditFeatureGeometry('Coord', { withControls })}>
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

  private deleteHandler () {
    const { onDelete, index } = this.props;
    if (onDelete) {
      onDelete(index);
    }
  }
}
