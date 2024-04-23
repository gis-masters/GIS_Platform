import React from 'react';
import { makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';
import { boundMethod } from 'autobind-decorator';

import { CoordinateEdited, GeometryType, WfsPointGeometry } from '../../../../services/geoserver/wfs/wfs.models';
import { EditFeatureGeometryAsText } from '../../AsText/EditFeatureGeometry-AsText';
import { EditFeatureGeometryCoord } from '../../Coord/EditFeatureGeometry-Coord';
import { EditFeatureGeometryDraw } from '../../Draw/EditFeatureGeometry-Draw';
import { EditFeatureGeometryToolbar } from '../../Toolbar/EditFeatureGeometry-Toolbar';
import { EditFeatureGeometryToolbarLeft } from '../../ToolbarLeft/EditFeatureGeometry-ToolbarLeft';
import { EditFeatureGeometryXY } from '../../XY/EditFeatureGeometry-XY';
import {
  cnEditFeatureGeometryForm,
  EditFeatureGeometryForm,
  EditFeatureGeometryFormProps
} from '../EditFeatureGeometry-Form';

import '!style-loader!css-loader!sass-loader!./EditFeatureGeometry-Form_type_Point.scss';

@observer
class EditFeatureGeometryFormTypePoint extends EditFeatureGeometryForm {
  @observable active = false;

  constructor(props: EditFeatureGeometryFormProps) {
    super(props);
    makeObservable(this);
  }

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

  @boundMethod
  private changeHandler(val?: CoordinateEdited) {
    this.props.store.geometry.coordinates = val;
  }

  @boundMethod
  private asTextHandler(val: CoordinateEdited[]) {
    this.props.store.geometry.coordinates = val[0];
  }
}

export const withTypePoint = withBemMod<EditFeatureGeometryFormProps>(
  cnEditFeatureGeometryForm(),
  { type: GeometryType.POINT },
  () => EditFeatureGeometryFormTypePoint
);
