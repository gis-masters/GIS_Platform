import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Divider, IconButton, Tooltip } from '@mui/material';
import { cn } from '@bem-react/classname';
import { polygon } from '@turf/turf';
import { boundMethod } from 'autobind-decorator';
import { Coordinate } from 'ol/coordinate';

import { Emitter } from '../../services/common/Emitter';
import { communicationService } from '../../services/communication.service';
import { defaultOlProjectionCode } from '../../services/data/projections/projections.models';
import { getProjectionByCode } from '../../services/data/projections/projections.service';
import { recalculateBboxAndGetCoverage } from '../../services/geoserver/coverages/coverages.service';
import { recalculateBboxAndGetFeatureType } from '../../services/geoserver/featureType/featureType.service';
import {
  GeometryType,
  supportedGeometryTypes,
  WfsGeometry,
  WfsLineStringGeometry,
  WfsMultiLineStringGeometry,
  WfsMultiPolygonGeometry,
  WfsPolygonGeometry
} from '../../services/geoserver/wfs/wfs.models';
import { CrgLayerType, CrgVectorLayer } from '../../services/gis/layers/layers.models';
import { isVectorFromFile } from '../../services/gis/layers/layers.utils';
import { editFeatureStore } from '../../services/map/a-map-mode/edit-feature/EditFeatureStore';
import { mapDrawService } from '../../services/map/draw/map-draw.service';
import { mergeGeometry } from '../../services/map/draw/mergeGeometry';
import { services } from '../../services/services';
import { transformGeometry } from '../../services/util/coordinates-transform.util';
import { notFalsyFilter } from '../../services/util/NotFalsyFilter';
import { FeatureIcon } from '../FeatureIcon/FeatureIcon';
import { ContourAdd } from '../Icons/ContourAdd';
import { EditFeatureGeometryDraw } from './Draw/EditFeatureGeometry-Draw';
import { EditFeatureGeometryError } from './Error/EditFeatureGeometry-Error';
import { EditFeatureGeometryField } from './Field/EditFeatureGeometry-Field';
import { EditFeatureGeometryForm } from './Form/EditFeatureGeometry-Form.composed';
import { EditFeatureGeometryHeader } from './Header/EditFeatureGeometry-Header';
import { EditFeatureGeometryHistoryControls } from './HistoryControls/EditFeatureGeometry-HistoryControls';
import { EditFeatureGeometryMainToolbar } from './MainToolbar/EditFeatureGeometry-MainToolbar';
import { EditFeatureGeometrySelectProjection } from './SelectProjection/EditFeatureGeometry-SelectProjection';
import { EditFeatureGeometryToolbarLeft } from './ToolbarLeft/EditFeatureGeometry-ToolbarLeft';
import { EditFeatureGeometryToolbarRight } from './ToolbarRight/EditFeatureGeometry-ToolbarRight';
import { EditFeatureGeometryValidationError } from './ValidationError/EditFeatureGeometry-ValidationError';
import { EditFeatureGeometryView } from './View/EditFeatureGeometry-View.composed';

import '!style-loader!css-loader!sass-loader!./EditFeatureGeometry.scss';
import '!style-loader!css-loader!sass-loader!./Divider/EditFeatureGeometry-Divider.scss';
import '!style-loader!css-loader!sass-loader!./FieldText/EditFeatureGeometry-FieldText.scss';
import '!style-loader!css-loader!sass-loader!./AddGeometry/EditFeatureGeometry-AsGeometry.scss';
import '!style-loader!css-loader!sass-loader!./GeometryType/EditFeatureGeometry-GeometryType.scss';

const cnEditFeatureGeometry = cn('EditFeatureGeometry');

export interface EditFeatureGeometryProps {
  readOnly: boolean;
}

@observer
export default class EditFeatureGeometry extends Component<EditFeatureGeometryProps> {
  async componentDidMount() {
    await this.updateExtent();

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

              <Divider orientation='vertical' />

              {geometryType !== GeometryType.POINT && geometryType !== GeometryType.MULTI_POINT && (
                <Tooltip title='Добавить геометрию'>
                  <span>
                    <IconButton className={cnEditFeatureGeometry('AddGeometry')} onClick={this.handleAdd}>
                      <ContourAdd />
                    </IconButton>
                  </span>
                </Tooltip>
              )}
            </EditFeatureGeometryToolbarLeft>

            <EditFeatureGeometryToolbarRight>
              <EditFeatureGeometryHistoryControls />
            </EditFeatureGeometryToolbarRight>
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
  private handleAdd() {
    const currentGeometry = editFeatureStore.geometry;
    const geometryType = editFeatureStore.geometryType;

    if (!currentGeometry || !geometryType) {
      return;
    }

    // Создаем новую пустую геометрию в зависимости от типа
    let newGeometry: WfsGeometry;

    switch (geometryType) {
      case GeometryType.LINE_STRING: {
        // Для линии создаем геометрию с двумя точками
        newGeometry = {
          type: GeometryType.LINE_STRING,
          coordinates: [[0, 0] as Coordinate, [0, 0] as Coordinate]
        } as WfsLineStringGeometry;
        break;
      }
      case GeometryType.MULTI_LINE_STRING: {
        // Для мульти-линии создаем геометрию с двумя точками
        newGeometry = {
          type: GeometryType.MULTI_LINE_STRING,
          coordinates: [[[0, 0] as Coordinate, [0, 0] as Coordinate]]
        } as WfsMultiLineStringGeometry;
        break;
      }
      case GeometryType.POLYGON: {
        // Для полигона создаем геометрию с тремя точками (треугольник)
        newGeometry = {
          type: GeometryType.POLYGON,
          coordinates: [[[0, 0] as Coordinate, [0, 0] as Coordinate, [0, 0] as Coordinate, [0, 0] as Coordinate]]
        } as WfsPolygonGeometry;
        break;
      }
      case GeometryType.MULTI_POLYGON: {
        // Для мульти-полигона создаем геометрию с тремя точками (треугольник)
        newGeometry = {
          type: GeometryType.MULTI_POLYGON,
          coordinates: [[[[0, 0] as Coordinate, [0, 0] as Coordinate, [0, 0] as Coordinate, [0, 0] as Coordinate]]]
        } as WfsMultiPolygonGeometry;
        break;
      }
      default: {
        return; // Для других типов не добавляем
      }
    }

    const mergedGeometry = mergeGeometry(newGeometry, currentGeometry, geometryType);

    // Обновляем геометрию
    editFeatureStore.setGeometry(mergedGeometry, true, 'Добавление геометрии');

    // Синхронизируем с картой
    void mapDrawService.syncFeatureGeometryWithMap();
  }

  private async updateExtent() {
    if (!editFeatureStore.editFeaturesData?.layer) {
      services.logger.warn('Не могу посчитать extend слоя => не задан слой');

      return;
    }

    const { layer } = editFeatureStore.editFeaturesData;

    const featureType =
      layer.type === CrgLayerType.VECTOR || isVectorFromFile(layer.type)
        ? await recalculateBboxAndGetFeatureType(layer as CrgVectorLayer, true)
        : await recalculateBboxAndGetCoverage(layer);

    if (!featureType?.nativeBoundingBox) {
      services.logger.warn('Не могу посчитать extend слоя => не найден bbox слоя');

      return;
    }

    const { minx, miny, maxx, maxy, crs } = featureType.nativeBoundingBox;
    let polygonCoordinates = [
      [minx - 200_000, miny - 200_000],
      [minx - 200_000, maxy + 200_000],
      [maxx + 200_000, maxy + 200_000],
      [maxx + 200_000, miny - 200_000],
      [minx - 200_000, miny - 200_000]
    ];

    const crsStringValue = typeof crs === 'string' ? crs : crs.$;
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
