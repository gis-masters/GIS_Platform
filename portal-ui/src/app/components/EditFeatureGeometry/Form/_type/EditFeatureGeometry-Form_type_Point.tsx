import React from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';
import { Brush, BrushOutlined } from '@material-ui/icons';
import GeometryType from 'ol/geom/GeometryType';
import { boundMethod } from 'autobind-decorator';

import { WfsPointGeometry, CoordinateEdited } from '../../../../services/geoserver/wfs.models';

import { EditFeatureGeometryCoordPick } from '../../CoordPick/EditFeatureGeometry-CoordPick';
import { EditFeatureGeometryAsText } from '../../AsText/EditFeatureGeometry-AsText';
import { EditFeatureGeometryCoord } from '../../Coord/EditFeatureGeometry-Coord';
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
        <EditFeatureGeometryXY />
        <EditFeatureGeometryCoord val={geometry.coordinates} store={store} onChange={this.changeHandler} />

        <EditFeatureGeometryCoordPick
          store={store}
          Icon={this.active ? Brush : BrushOutlined}
          onPickStart={this.enableActive}
          onPickEnd={this.disableActive}
          onPick={this.changeHandler}
          size='medium'
        />

        <EditFeatureGeometryAsText
          coordinates={[geometry.coordinates]}
          mustBeClosed={false}
          onChange={this.asTextHandler}
        />
      </div>
    );
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
