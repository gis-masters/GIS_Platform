import React from 'react';
import { makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Paper } from '@mui/material';
import { withBemMod } from '@bem-react/core';
import { boundMethod } from 'autobind-decorator';
import { Coordinate } from 'ol/coordinate';

import { GeometryType, WfsPointGeometry } from '../../../../services/geoserver/wfs/wfs.models';
import { editFeatureStore } from '../../../../services/map/a-map-mode/edit-feature/EditFeatureStore';
import { mapDrawService } from '../../../../services/map/draw/map-draw.service';
import { EditFeatureGeometryCoord } from '../../Coord/EditFeatureGeometry-Coord';
import { EditFeatureGeometryCopyCoords } from '../../CopyCoords/EditFeatureGeometry-CopyCoords';
import { EditFeatureGeometryGroupFooter } from '../../GroupFooter/EditFeatureGeometry-GroupFooter';
import { EditFeatureGeometryToolbarLeft } from '../../ToolbarLeft/EditFeatureGeometry-ToolbarLeft';
import { EditFeatureGeometryXY } from '../../XY/EditFeatureGeometry-XY';
import {
  cnEditFeatureGeometryForm,
  EditFeatureGeometryFormBase,
  EditFeatureGeometryFormProps
} from '../EditFeatureGeometry-Form.base';

import '!style-loader!css-loader!sass-loader!./EditFeatureGeometry-Form_type_Point.scss';

@observer
class EditFeatureGeometryFormTypePoint extends EditFeatureGeometryFormBase {
  @observable active = false;

  constructor(props: EditFeatureGeometryFormProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { className } = this.props;
    const geometry = editFeatureStore.geometry as WfsPointGeometry;

    if (!editFeatureStore.geometryType) {
      return <></>;
    }

    return (
      <Paper elevation={2} className={cnEditFeatureGeometryForm(null, [className])}>
        <EditFeatureGeometryXY />
        <EditFeatureGeometryCoord
          key={0}
          displayIndex={0}
          index={0}
          withControls
          val={geometry.coordinates}
          onChange={this.handleChange}
        />

        <EditFeatureGeometryGroupFooter>
          <EditFeatureGeometryToolbarLeft />

          <EditFeatureGeometryCopyCoords coordinates={[geometry.coordinates]} />
        </EditFeatureGeometryGroupFooter>
      </Paper>
    );
  }

  @boundMethod
  private async handleChange(val: Coordinate) {
    if (!editFeatureStore.geometry) {
      throw new Error('Отсутствует геометрия');
    }

    editFeatureStore.geometry.coordinates = val;

    await mapDrawService.syncFeatureGeometryWithMap();
  }
}

export const withTypePoint = withBemMod<EditFeatureGeometryFormProps>(
  cnEditFeatureGeometryForm(),
  { type: GeometryType.POINT },
  () => EditFeatureGeometryFormTypePoint
);
