import React from 'react';
import { makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';
import { boundMethod } from 'autobind-decorator';
import { Coordinate } from 'ol/coordinate';

import { GeometryType, WfsPointGeometry } from '../../../../services/geoserver/wfs/wfs.models';
import { editFeatureStore } from '../../../../services/map/a-map-mode/edit-feature/EditFeatureStore';
import { EditFeatureGeometryAsText } from '../../AsText/EditFeatureGeometry-AsText';
import { EditFeatureGeometryCoord } from '../../Coord/EditFeatureGeometry-Coord';
import { EditFeatureGeometryToolbar } from '../../Toolbar/EditFeatureGeometry-Toolbar';
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
      <div className={cnEditFeatureGeometryForm(null, [className])}>
        <EditFeatureGeometryToolbar>
          <EditFeatureGeometryToolbarLeft>
            <EditFeatureGeometryAsText
              coordinates={[geometry.coordinates]}
              mustBeClosed={false}
              onChange={this.handleAsTextChange}
              geometryType={editFeatureStore.geometryType}
              first
            />
          </EditFeatureGeometryToolbarLeft>
        </EditFeatureGeometryToolbar>

        <EditFeatureGeometryXY />
        <EditFeatureGeometryCoord val={geometry.coordinates} onChange={this.handleChange} />
      </div>
    );
  }

  @boundMethod
  private handleChange(val: Coordinate) {
    if (!editFeatureStore.geometry) {
      throw new Error('Отсутствует геометрия');
    }

    editFeatureStore.geometry.coordinates = val;
  }

  @boundMethod
  private handleAsTextChange(val: Coordinate[]) {
    if (editFeatureStore.geometry) {
      editFeatureStore.geometry.coordinates = val[0] || [];
    }
  }
}

export const withTypePoint = withBemMod<EditFeatureGeometryFormProps>(
  cnEditFeatureGeometryForm(),
  { type: GeometryType.POINT },
  () => EditFeatureGeometryFormTypePoint
);
