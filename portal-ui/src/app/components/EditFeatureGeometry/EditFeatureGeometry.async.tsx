import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Divider } from '@mui/material';
import { cn } from '@bem-react/classname';
import { polygon } from '@turf/turf';
import { boundMethod } from 'autobind-decorator';
import { DrawEvent } from 'ol/interaction/Draw';

import { Emitter } from '../../services/common/Emitter';
import { communicationService } from '../../services/communication.service';
import { defaultOlProjectionCode } from '../../services/data/projections/projections.models';
import { getProjectionByCode } from '../../services/data/projections/projections.service';
import { recalculateBboxAndGetCoverage } from '../../services/geoserver/coverages/coverages.service';
import { recalculateBboxAndGetFeatureType } from '../../services/geoserver/featureType/featureType.service';
import { GeometryType, supportedGeometryTypes, WfsGeometry } from '../../services/geoserver/wfs/wfs.models';
import { CrgLayerType, CrgVectorLayer } from '../../services/gis/layers/layers.models';
import { isVectorFromFile } from '../../services/gis/layers/layers.utils';
import { editFeatureStore } from '../../services/map/a-map-mode/edit-feature/EditFeatureStore';
import { mapDrawService } from '../../services/map/draw/map-draw.service';
import { FeatureState } from '../../services/map/map.models';
import { getStyle, KnownStyleKey } from '../../services/map/styles/map-styles';
import { mergeToMultiLineString, mergeToMultiPoint, mergeToMultiPolygon } from '../../services/ol/marge-geometries';
import { transformGeometry } from '../../services/util/coordinates-transform.util';
import { notFalsyFilter } from '../../services/util/NotFalsyFilter';
import { featureToWfsFeature } from '../../services/util/open-layers.util';
import { sleep } from '../../services/util/sleep';
import { isBoolean } from '../../services/util/typeGuards/isBoolean';
import { FeatureIcon } from '../FeatureIcon/FeatureIcon';
import { EditFeatureGeometryDraw } from './Draw/EditFeatureGeometry-Draw';
import { EditFeatureGeometryError } from './Error/EditFeatureGeometry-Error';
import { EditFeatureGeometryField } from './Field/EditFeatureGeometry-Field';
import { EditFeatureGeometryForm } from './Form/EditFeatureGeometry-Form.composed';
import { EditFeatureGeometryHeader } from './Header/EditFeatureGeometry-Header';
import { EditFeatureGeometryMainToolbar } from './MainToolbar/EditFeatureGeometry-MainToolbar';
import { EditFeatureGeometrySelectProjection } from './SelectProjection/EditFeatureGeometry-SelectProjection';
import { EditFeatureGeometryToolbarLeft } from './ToolbarLeft/EditFeatureGeometry-ToolbarLeft';
import { EditFeatureGeometryValidationError } from './ValidationError/EditFeatureGeometry-ValidationError';
import { EditFeatureGeometryView } from './View/EditFeatureGeometry-View.composed';

import '!style-loader!css-loader!sass-loader!./EditFeatureGeometry.scss';
import '!style-loader!css-loader!sass-loader!./Divider/EditFeatureGeometry-Divider.scss';
import '!style-loader!css-loader!sass-loader!./FieldText/EditFeatureGeometry-FieldText.scss';
import '!style-loader!css-loader!sass-loader!./GeometryType/EditFeatureGeometry-GeometryType.scss';

const cnEditFeatureGeometry = cn('EditFeatureGeometry');

export interface EditFeatureGeometryProps {
  readOnly: boolean;
}

@observer
export default class EditFeatureGeometry extends Component<EditFeatureGeometryProps> {
  async componentDidMount() {
    await this.updateExtent();

    communicationService.drawEnd.on(e => this.handleDraw(e), this);
    communicationService.modifyEnd.on(this.handleModify, this);
    communicationService.featuresUpdated.on(this.updateExtent, this);
  }

  componentWillUnmount() {
    communicationService.off(this);
    Emitter.scopeOff(this);
  }

  render() {
    const { readOnly } = this.props;

    if (!(editFeatureStore && editFeatureStore.geometry && editFeatureStore.currentProjection)) {
      return (
        <div className={cnEditFeatureGeometry()}>
          <EditFeatureGeometryError>Отсутствует геометрия.</EditFeatureGeometryError>
        </div>
      );
    }

    const { geometry, geometryErrorMessage } = editFeatureStore;
    const geometryType = supportedGeometryTypes.includes(geometry?.type) ? geometry.type : undefined;

    return (
      <div className={cnEditFeatureGeometry(null, ['scroll'])}>
        <EditFeatureGeometryHeader>
          <EditFeatureGeometryField>
            <FeatureIcon geometryType={geometryType} className={cnEditFeatureGeometry('Svg')} />

            <Divider orientation='vertical' flexItem />

            <span className={cnEditFeatureGeometry('FieldText')}>Система координат:</span>
            <EditFeatureGeometrySelectProjection
              value={editFeatureStore.currentProjection}
              onChange={editFeatureStore.setCurrentProjectionAndTransformGeometry}
            />
          </EditFeatureGeometryField>
        </EditFeatureGeometryHeader>

        {!!geometryErrorMessage && <EditFeatureGeometryValidationError />}

        {!readOnly && (
          <EditFeatureGeometryMainToolbar>
            <EditFeatureGeometryToolbarLeft>
              <EditFeatureGeometryDraw />
            </EditFeatureGeometryToolbarLeft>
          </EditFeatureGeometryMainToolbar>
        )}

        <div className={cnEditFeatureGeometry('Divider')}>
          <Divider orientation='horizontal' flexItem />
        </div>

        {geometryType && !readOnly && <EditFeatureGeometryForm type={geometryType} />}
        {geometryType && readOnly && <EditFeatureGeometryView type={geometryType} />}
      </div>
    );
  }

  @boundMethod
  private handleDraw(event: CustomEvent<DrawEvent>) {
    event.detail.feature.setStyle(getStyle(KnownStyleKey.DrawingFeature));

    void this.handleGeometry();
  }

  @boundMethod
  private handleModify() {
    void this.handleGeometry();
  }

  // Используем события модификации и рисования просто как маркеры.
  // При возникновении этих событий мы посмотрим на источник данных и считаем оттуда все фичи, которые сейчас там есть.
  private async handleGeometry() {
    await sleep(0);

    // В источнике может быть много фичей - все которые выделены(selectedFeature).
    // Но при редактировании мы работаем только с одной активной фичей(isActiveFeature).
    // Поэтому мы отфильтровываем из источника только фичи, которые относятся к активной фиче и те фичи что были
    // нарисованы: они не имеют никаких маркеров.
    const activeAndNewFeatures = mapDrawService
      .getDrawSource()
      .getFeatures()
      .filter(feature => {
        const selectedFeature: unknown = feature.get(FeatureState.SELECTED);
        const isActiveFeature: unknown = feature.get(FeatureState.ACTIVE);
        const isEmptyFeature: unknown = feature.get(FeatureState.EMPTY);

        const isEmpty = isBoolean(isEmptyFeature) ? isEmptyFeature : false;
        const isActive = isBoolean(isActiveFeature) ? isActiveFeature : false;
        const isSelectedFeature = isBoolean(selectedFeature) ? selectedFeature : false;

        return isEmpty ? false : !isSelectedFeature || isActive;
      });

    let feature;

    switch (editFeatureStore.geometryType) {
      case GeometryType.POLYGON:
      case GeometryType.MULTI_POLYGON: {
        feature = mergeToMultiPolygon(activeAndNewFeatures, editFeatureStore.currentProjection);

        break;
      }
      case GeometryType.LINE_STRING:
      case GeometryType.MULTI_LINE_STRING: {
        feature = mergeToMultiLineString(activeAndNewFeatures, editFeatureStore.currentProjection);

        break;
      }
      case GeometryType.POINT:
      case GeometryType.MULTI_POINT: {
        feature = mergeToMultiPoint(activeAndNewFeatures, editFeatureStore.currentProjection);

        break;
      }
      default: {
        throw new Error('Не поддерживаемый тип геометрии: ' + editFeatureStore.geometryType);
      }
    }

    if (feature) {
      const wfsFeature = featureToWfsFeature(feature);

      if (wfsFeature.geometry) {
        editFeatureStore.setGeometry(wfsFeature.geometry);
      }
    }
  }

  private async updateExtent() {
    if (!editFeatureStore?.editFeaturesData?.layer) {
      return;
    }

    const { layer } = editFeatureStore.editFeaturesData;

    const featureType =
      layer.type === CrgLayerType.VECTOR || isVectorFromFile(layer.type)
        ? await recalculateBboxAndGetFeatureType(layer as CrgVectorLayer, true)
        : await recalculateBboxAndGetCoverage(layer);

    if (!featureType?.nativeBoundingBox) {
      return;
    }

    const { minx, miny, maxx, maxy, crs } = featureType.nativeBoundingBox;
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

    editFeatureStore.setLayerExtent(polygon([polygonCoordinates]));
  }
}
