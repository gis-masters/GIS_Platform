import React from 'react';
import { action } from 'mobx';
import { observer } from 'mobx-react';
import GeometryType from 'ol/geom/GeometryType';
import { withBemMod } from '@bem-react/core';

import { WfsMultiPolygonGeometry, CoordinateEdited } from '../../../../services/geoserver/wfs.models';
import { env } from '../../../../stores/Env.store';

import {
  EditFeatureGeometryFormProps,
  EditFeatureGeometryForm,
  cnEditFeatureGeometryForm
} from '../EditFeatureGeometry-Form';
import { EditFeatureGeometrySuperGroup } from '../../SuperGroup/EditFeatureGeometry-SuperGroup';
import { EditFeatureGeometryAddButton } from '../../AddButton/EditFeatureGeometry-AddButton';

@observer
class EditFeatureGeometryFormTypeMultiPolygon extends EditFeatureGeometryForm {
  render() {
    const { className, store } = this.props;
    const geometry = store.geometry as WfsMultiPolygonGeometry;

    return (
      <div className={cnEditFeatureGeometryForm(null, [className, 'scroll'])}>
        {geometry.coordinates.map((geometryPart, index) => (
          <EditFeatureGeometrySuperGroup
            geometryPart={geometryPart}
            minCoordsPerGroup={4}
            groupsMustBeClosed={true}
            store={store}
            index={index}
            key={index}
            onPolygonDelete={this.deletePolygonHandler}
          />
        ))}

        {env.platform !== 'simf' ? (
          <EditFeatureGeometryAddButton onClick={this.addPolygonHandler}>Добавить полигон</EditFeatureGeometryAddButton>
        ) : null}
      </div>
    );
  }

  @action.bound
  private addPolygonHandler() {
    const geometry = this.props.store.geometry as WfsMultiPolygonGeometry<CoordinateEdited>;
    geometry.coordinates.push([
      [
        ['', ''],
        ['', ''],
        ['', ''],
        ['', '']
      ]
    ]);
  }

  @action.bound
  private deletePolygonHandler(i: number) {
    const geometry = this.props.store.geometry as WfsMultiPolygonGeometry<CoordinateEdited>;
    geometry.coordinates.splice(i, 1);
  }
}

export const withTypeMultiPolygon = withBemMod<EditFeatureGeometryFormProps>(
  cnEditFeatureGeometryForm(),
  { type: GeometryType.MULTI_POLYGON },
  () => props => <EditFeatureGeometryFormTypeMultiPolygon {...props} />
);
