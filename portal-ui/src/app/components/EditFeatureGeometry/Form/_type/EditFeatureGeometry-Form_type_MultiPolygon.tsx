import React from 'react';
import { action } from 'mobx';
import { observer } from 'mobx-react';
import GeometryType from 'ol/geom/GeometryType';
import { withBemMod } from '@bem-react/core';
import { cn } from '@bem-react/classname';

import {
  WfsMultiPolygonGeometry,
  CoordinateEdited
} from '../../../../services/geoserver/wfs-models';
import { env } from '../../../../stores/Env.store';

import { EditFeatureGeometryFormProps, EditFeatureGeometryForm } from '../EditFeatureGeometry-Form';
import { EditFeatureGeometrySuperGroup } from '../../SuperGroup/EditFeatureGeometry-SuperGroup';
import { EditFeatureGeometryAddButton } from '../../AddButton/EditFeatureGeometry-AddButton';

const cnEditFeatureGeometry = cn('EditFeatureGeometry');

@observer
class EditFeatureGeometryFormTypeMultiPolygon extends EditFeatureGeometryForm {
  constructor (props: EditFeatureGeometryFormProps) {
    super(props);

    this.addPolygonHandler = this.addPolygonHandler.bind(this);
  }

  render () {
    const { className } = this.props;
    const geometry = this.props.geometry as WfsMultiPolygonGeometry;

    return (
      <div className={className}>
        {geometry.coordinates.map((geometryPart, index) => (
          <EditFeatureGeometrySuperGroup
              geometryPart={geometryPart}
              minCoordsPerGroup={4}
              groupsMustBeClosed={true}
              index={index}
              key={index}
          />
        ))}

        {env.platform !== 'simf' ? (
          <EditFeatureGeometryAddButton onClick={this.addPolygonHandler}>
            Добавить полигон
          </EditFeatureGeometryAddButton>
        ) : null}
      </div>
    );
  }

  @action
  private addPolygonHandler () {
    const geometry = this.props.geometry as WfsMultiPolygonGeometry<CoordinateEdited>;
    geometry.coordinates.push([[['', ''], ['', ''], ['', ''], ['', '']]]);
  }
}

export const withTypeMultiPolygon = withBemMod<EditFeatureGeometryFormProps>(
  cnEditFeatureGeometry('Form'),
  { type: GeometryType.MULTI_POLYGON },
  () => props => <EditFeatureGeometryFormTypeMultiPolygon {...props} />
);
