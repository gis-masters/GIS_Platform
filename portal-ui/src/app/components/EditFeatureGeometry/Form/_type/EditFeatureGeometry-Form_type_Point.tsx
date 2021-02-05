import React from 'react';
import { action, computed, observable } from 'mobx';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';
import GeometryType from 'ol/geom/GeometryType';
import { boundMethod } from 'autobind-decorator';

import { WfsPointGeometry, CoordinateEdited } from '../../../../services/geoserver/wfs.models';

import { EditFeatureGeometryToolbarLeft } from '../../ToolbarLeft/EditFeatureGeometry-ToolbarLeft';
import { EditFeatureGeometryToolbar } from '../../Toolbar/EditFeatureGeometry-Toolbar';
import { EditFeatureGeometryAsText } from '../../AsText/EditFeatureGeometry-AsText';
import { EditFeatureGeometryCoord } from '../../Coord/EditFeatureGeometry-Coord';
import { EditFeatureGeometryDraw } from '../../Draw/EditFeatureGeometry-Draw';
import { EditFeatureGeometryXY } from '../../XY/EditFeatureGeometry-XY';
import {
  EditFeatureGeometryFormProps,
  EditFeatureGeometryForm,
  cnEditFeatureGeometryForm
} from '../EditFeatureGeometry-Form';

import '!style-loader!css-loader!sass-loader!./EditFeatureGeometry-Form_type_Point.scss';

@observer
class EditFeatureGeometryFormTypePoint extends EditFeatureGeometryForm {
  @observable active = false;

  render() {
    const { className, store } = this.props;
    const geometry = store.geometry as WfsPointGeometry;

    return (
      <div className={cnEditFeatureGeometryForm(null, [className])}>
        <EditFeatureGeometryToolbar>
          <EditFeatureGeometryToolbarLeft>
            <EditFeatureGeometryDraw store={store} point={geometry.coordinates} onDraw={this.changeHandler} />
            <EditFeatureGeometryAsText
              coordinates={[geometry.coordinates]}
              mustBeClosed={false}
              onChange={this.asTextHandler}
              geometryType={store.geometryType}
              first
            />
          </EditFeatureGeometryToolbarLeft>
        </EditFeatureGeometryToolbar>

        <EditFeatureGeometryXY />
        <EditFeatureGeometryCoord val={geometry.coordinates} store={store} onChange={this.changeHandler} />
      </div>
    );
  }

  @computed
  private get isEmpty(): boolean {
    const { store } = this.props;
    const geometry = store.geometry as WfsPointGeometry;

    return !geometry.coordinates.some(dismention => dismention);
  }

  @boundMethod
  private changeHandler(val?: CoordinateEdited) {
    this.props.store.geometry.coordinates = val;
  }

  @boundMethod
  private asTextHandler(val: CoordinateEdited[]) {
    this.props.store.geometry.coordinates = val[0];
  }

  @action.bound
  private enableActive() {
    this.active = true;
  }

  @action.bound
  private disableActive() {
    this.active = false;
  }
}

export const withTypePoint = withBemMod<EditFeatureGeometryFormProps>(
  cnEditFeatureGeometryForm(),
  { type: GeometryType.POINT },
  () => props => <EditFeatureGeometryFormTypePoint {...props} />
);
