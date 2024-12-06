import React, { Component } from 'react';
import { action } from 'mobx';
import { observer } from 'mobx-react';
import { Tooltip } from '@mui/material';
import { cn } from '@bem-react/classname';
import { polygon } from '@turf/turf';
import { boundMethod } from 'autobind-decorator';
import Feature from 'ol/Feature';
import { SimpleGeometry } from 'ol/geom';
import { ModifyEvent } from 'ol/interaction/Modify';

import { Emitter } from '../../services/common/Emitter';
import { communicationService } from '../../services/communication.service';
import { defaultOlProjectionCode } from '../../services/data/projections/projections.models';
import { getProjectionByCode } from '../../services/data/projections/projections.service';
import { transformGeometry } from '../../services/data/projections/projections.util';
import { recalculateBboxAndGetCoverage } from '../../services/geoserver/coverages/coverages.service';
import { recalculateBboxAndGetFeatureType } from '../../services/geoserver/featureType/featureType.service';
import { GeometryType, supportedGeometryTypes, WfsGeometry } from '../../services/geoserver/wfs/wfs.models';
import { CrgLayerType, CrgVectorLayer } from '../../services/gis/layers/layers.models';
import { isVectorFromFile } from '../../services/gis/layers/layers.utils';
import { notFalsyFilter } from '../../services/util/NotFalsyFilter';
import { EditFeatureGeometryStore } from '../../stores/EditFeatureGeometry.store';
import { projectionsStore } from '../../stores/Projections.store';
import { FeatureIcon } from '../FeatureIcon/FeatureIcon';
import { EditFeatureGeometryError } from './Error/EditFeatureGeometry-Error';
import { EditFeatureGeometryField } from './Field/EditFeatureGeometry-Field';
import { EditFeatureGeometryForm } from './Form/EditFeatureGeometry-Form.composed';
import { EditFeatureGeometryHeader } from './Header/EditFeatureGeometry-Header';
import { EditFeatureGeometrySelectProjection } from './SelectProjection/EditFeatureGeometry-SelectProjection';
import { EditFeatureGeometryView } from './View/EditFeatureGeometry-View.composed';

import '!style-loader!css-loader!sass-loader!./EditFeatureGeometry.scss';

const cnEditFeatureGeometry = cn('EditFeatureGeometry');

export interface EditFeatureGeometryProps {
  store: EditFeatureGeometryStore;
  readOnly: boolean;
}

@observer
export default class EditFeatureGeometry extends Component<EditFeatureGeometryProps> {
  async componentDidMount() {
    await this.updateExtent();

    communicationService.modifyEnd.on(this.handleModify, this);
    communicationService.featuresUpdated.on(this.updateExtent, this);
  }

  componentWillUnmount() {
    communicationService.off(this);
    Emitter.scopeOff(this);
  }

  render() {
    const { store, readOnly } = this.props;

    if (!(store && store.geometry && store.currentProjection)) {
      return (
        <div className={cnEditFeatureGeometry()}>
          <EditFeatureGeometryError>Отсутствует геометрия.</EditFeatureGeometryError>
        </div>
      );
    }

    const { geometry } = store;
    const geometryType = supportedGeometryTypes.includes(geometry?.type) ? geometry.type : undefined;

    return (
      <div className={cnEditFeatureGeometry()}>
        <EditFeatureGeometryHeader>
          <EditFeatureGeometryField>
            Система координат:
            <EditFeatureGeometrySelectProjection value={store.currentProjection} onChange={store.setProjection} />
          </EditFeatureGeometryField>
        </EditFeatureGeometryHeader>
        {geometryType && (
          <EditFeatureGeometryField>
            Тип геометрии:
            <Tooltip title={this.getFeatureIconGeometryType(geometryType)}>
              <span>
                <FeatureIcon geometryType={geometryType} className={cnEditFeatureGeometry('Svg')} />
              </span>
            </Tooltip>
          </EditFeatureGeometryField>
        )}
        {geometryType && !readOnly && <EditFeatureGeometryForm type={geometryType} store={store} />}
        {geometryType && readOnly && <EditFeatureGeometryView type={geometryType} store={store} />}
      </div>
    );
  }

  @boundMethod
  private handleModify(event: CustomEvent<ModifyEvent>) {
    const modifyEvent = event.detail;
    if (modifyEvent === null) {
      return;
    }

    const modifiedGeometry = (modifyEvent.features.item(0) as Feature<SimpleGeometry>).getGeometry();

    const { nativeProjection, geometry, geometryType, setGeometry } = this.props.store;

    if (!geometryType || !projectionsStore.olProjection || !nativeProjection) {
      throw new Error('Не удалось изменить геометрию');
    }

    const coordinates =
      modifiedGeometry instanceof SimpleGeometry
        ? transformGeometry(
            {
              type: geometryType,
              coordinates: modifiedGeometry.getCoordinates() || []
            },
            projectionsStore.olProjection,
            nativeProjection
          )?.coordinates
        : geometry?.coordinates;

    setGeometry({ ...geometry, coordinates } as WfsGeometry);
  }

  @action
  private async updateExtent() {
    if (!this.props?.store?.layer) {
      return;
    }

    const { layer } = this.props.store;

    const { nativeBoundingBox } =
      layer.type === CrgLayerType.VECTOR || isVectorFromFile(layer.type)
        ? await recalculateBboxAndGetFeatureType(layer as CrgVectorLayer)
        : await recalculateBboxAndGetCoverage(layer);

    const { minx, miny, maxx, maxy, crs } = nativeBoundingBox;
    const crsStringValue = typeof crs === 'string' ? crs : crs.$;

    let polygonCoordinates = [
      [minx - 200_000, miny - 200_000],
      [minx - 200_000, maxy + 200_000],
      [maxx + 200_000, maxy + 200_000],
      [maxx + 200_000, miny - 200_000],
      [minx - 200_000, miny - 200_000]
    ];

    if (crsStringValue !== defaultOlProjectionCode) {
      const currentProjection = await getProjectionByCode(crsStringValue);
      const defaultProjection = await getProjectionByCode(defaultOlProjectionCode);

      const features: WfsGeometry[] = polygonCoordinates.map(item => ({
        type: GeometryType.POINT,
        coordinates: item
      }));

      if (currentProjection && defaultProjection) {
        polygonCoordinates = features
          .map(item => transformGeometry(item, currentProjection, defaultProjection))
          .map(item => item?.coordinates.map(Number))
          .filter(notFalsyFilter);
      }
    }

    this.props.store.setLayerExtent(polygon([polygonCoordinates]));
  }

  private getFeatureIconGeometryType(geometryType: GeometryType): string | undefined {
    if (!geometryType) {
      return;
    }

    switch (geometryType) {
      case GeometryType.POLYGON: {
        return 'полигон';
      }
      case GeometryType.MULTI_POLYGON: {
        return 'мультиполигон';
      }
      case GeometryType.LINE_STRING:
      case GeometryType.MULTI_LINE_STRING: {
        return 'линия';
      }
      case GeometryType.POINT:
      case GeometryType.MULTI_POINT: {
        return 'точка';
      }
    }
  }
}
