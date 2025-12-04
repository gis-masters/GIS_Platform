import React, { Component, type RefObject } from 'react';
import { action, makeObservable, observable, runInAction } from 'mobx';
import { observer } from 'mobx-react';
import { TextField } from '@mui/material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { Map, View } from 'ol';
import { type Extent } from 'ol/extent';
import { Tile as TileLayer } from 'ol/layer';
import { get as getProjection } from 'ol/proj';
import { OSM } from 'ol/source';
import 'ol/ol.css';

import { defaultOlProjectionCode } from '../../services/data/projections/projections.models';
import { getOlProjection } from '../../services/data/projections/projections.service';
import { services } from '../../services/services';
import { type FormControlProps } from '../Form/Control/Form-Control';
import { FormViewValue } from '../Form/ViewValue/Form-ViewValue';
import { RingSpinner } from '../RingSpinner/RingSpinner';
import { Toast } from '../Toast/Toast';

import './SelectBboxControl.scss';

const cnSelectBboxControl = cn('SelectBboxControl');

const MAP_UNAVAILABLE_MESSAGE = (
  <>
    <span className={cnSelectBboxControl('WarningText')}>Карта недоступна.</span> Введите BBOX вручную в формате
    [minX,minY,maxX,maxY]
  </>
);

@observer
export class SelectBboxControl extends Component<FormControlProps> {
  private mapContainerRef: RefObject<HTMLDivElement> = React.createRef();
  private mapInstanceRef: Map | null = null;
  private loadingTimeoutRef: number | null = null;
  private moveEndHandlerRef: (() => void) | null = null;
  private updatingFromExternal = false; // Флаг для предотвращения циклических обновлений
  @observable private mapLoading = false;
  @observable private mapFailed = false; // Флаг для отслеживания неудачной загрузки карты

  constructor(props: FormControlProps) {
    super(props);
    makeObservable(this);
  }

  componentDidMount() {
    void this.initializeMap();
  }

  componentDidUpdate(prevProps: FormControlProps) {
    if (this.shouldUpdateMapFromProps(prevProps)) {
      this.updateMapPositionFromProps();
    }
  }

  componentWillUnmount() {
    this.cleanup();
  }

  render() {
    const { fieldValue, errors, property } = this.props;
    const bboxString = fieldValue ? String(fieldValue) : '';

    return (
      <div className={cnSelectBboxControl()}>
        {this.mapFailed ? (
          <TextField
            fullWidth
            label={property.title}
            value={bboxString}
            onChange={this.handleManualInput}
            error={!!errors?.length}
            helperText={errors?.length ? undefined : MAP_UNAVAILABLE_MESSAGE}
            variant='standard'
            className={cnSelectBboxControl('ManualInput')}
          />
        ) : (
          <>
            <div className={cnSelectBboxControl('Map')}>
              <div ref={this.mapContainerRef} className={cnSelectBboxControl('MapContainer')} />
              {this.mapLoading && (
                <div className={cnSelectBboxControl('Loader')}>
                  <RingSpinner text='Загрузка карты' />
                </div>
              )}
            </div>
            {bboxString && (
              <div className={cnSelectBboxControl('Coordinates')}>
                <FormViewValue>{bboxString}</FormViewValue>
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  @boundMethod
  private handleManualInput(event: React.ChangeEvent<HTMLInputElement>) {
    const { onChange, property } = this.props;
    const value = event.target.value;

    if (onChange) {
      onChange({
        value,
        propertyName: property.name
      });
    }
  }

  private shouldUpdateMapFromProps(prevProps: FormControlProps): boolean {
    return (
      prevProps.fieldValue !== this.props.fieldValue &&
      this.mapInstanceRef !== null &&
      !this.updatingFromExternal &&
      !this.mapFailed
    );
  }

  private updateMapPositionFromProps() {
    const { fieldValue } = this.props;
    const bboxString = fieldValue ? String(fieldValue) : '';

    if (!bboxString || !this.mapInstanceRef) {
      return;
    }

    try {
      const bbox = JSON.parse(bboxString) as Extent;
      const view = this.mapInstanceRef.getView();
      // Временно отключаем обработчик, чтобы избежать циклических обновлений
      if (this.moveEndHandlerRef) {
        this.mapInstanceRef.un('moveend', this.moveEndHandlerRef);
      }
      view.fit(bbox, { padding: [10, 10, 10, 10] });
      // Включаем обработчик обратно после небольшой задержки
      setTimeout(() => {
        if (this.moveEndHandlerRef && this.mapInstanceRef) {
          this.mapInstanceRef.on('moveend', this.moveEndHandlerRef);
        }
      }, 500);
    } catch {
      // Игнорируем ошибки парсинга
    }
  }

  @boundMethod
  private handleBboxChange(bbox: Extent) {
    const { onChange, property, fieldValue } = this.props;
    // Округляем координаты до целого
    const roundedBbox: Extent = [
      Number(bbox[0].toFixed(0)),
      Number(bbox[1].toFixed(0)),
      Number(bbox[2].toFixed(0)),
      Number(bbox[3].toFixed(0))
    ];
    // Преобразуем extent в строку формата [minX,minY,maxX,maxY]
    const bboxString = JSON.stringify(roundedBbox);

    // Проверяем, изменилось ли значение, чтобы избежать лишних обновлений
    if (fieldValue === bboxString) {
      return;
    }

    this.updatingFromExternal = true;

    if (onChange) {
      onChange({
        value: bboxString,
        propertyName: property.name
      });
    }

    // Сбрасываем флаг после небольшой задержки
    setTimeout(() => {
      this.updatingFromExternal = false;
    }, 100);
  }

  private getBbox(): Extent {
    const { fieldValue } = this.props;
    const bboxString = fieldValue ? String(fieldValue) : '';

    let initialBbox: Extent | undefined;

    try {
      if (bboxString) {
        initialBbox = JSON.parse(bboxString) as Extent;
      }
    } catch {
      // Игнорируем ошибки парсинга
    }

    // BBOX для Крыма (по умолчанию)
    const BASE_BBOX: Extent = [3_510_207, 5_370_754, 4_155_031, 5_882_794];

    // Используем initialBbox если задан, иначе BASE_BBOX
    return initialBbox || BASE_BBOX;
  }

  @action.bound
  private async initializeMap() {
    if (!this.mapContainerRef.current) {
      return;
    }

    try {
      this.mapLoading = true;

      await getOlProjection();

      const projection = getProjection(defaultOlProjectionCode);
      if (!projection) {
        services.logger.error('SelectBboxControl: Проекция не найдена');
        runInAction(() => {
          this.mapFailed = true;
          this.mapLoading = false;
        });

        return;
      }

      const bbox = this.getBbox();
      const center: [number, number] = [(bbox[0] + bbox[2]) / 2, (bbox[1] + bbox[3]) / 2];

      const view = new View({
        projection,
        center,
        minZoom: 3,
        maxZoom: 25
      });

      const osmSource = new OSM();
      const tileLayer = new TileLayer({
        source: osmSource
      });

      const container = this.mapContainerRef.current;
      const map = new Map({
        target: container,
        view,
        layers: [tileLayer]
      });

      this.mapInstanceRef = map;

      // Отслеживаем загрузку тайлов для скрытия loader'а
      let loadedTilesCount = 0;
      let failedTilesCount = 0;
      let isLoaderHidden = false;
      const totalTilesToLoad = 4;
      const maxFailedTiles = 2; // Если больше 2 тайлов не загрузилось, считаем карту недоступной

      const hideLoader = () => {
        if (!isLoaderHidden) {
          isLoaderHidden = true;
          runInAction(() => {
            this.mapLoading = false;
          });
          osmSource.un('tileloadend', handleTileLoadEnd);
          osmSource.un('tileloaderror', handleTileLoadError);
          if (this.loadingTimeoutRef) {
            clearTimeout(this.loadingTimeoutRef);
            this.loadingTimeoutRef = null;
          }
        }
      };

      const checkMapFailed = () => {
        if (failedTilesCount >= maxFailedTiles) {
          runInAction(() => {
            this.mapFailed = true;
            this.mapLoading = false;
          });
          hideLoader();
          this.cleanup();
        }
      };

      const handleTileLoadEnd = () => {
        loadedTilesCount++;

        if (loadedTilesCount >= totalTilesToLoad) {
          hideLoader();
        }
      };

      const handleTileLoadError = () => {
        failedTilesCount++;
        checkMapFailed();
      };

      osmSource.on('tileloadend', handleTileLoadEnd);
      osmSource.on('tileloaderror', handleTileLoadError);

      // Таймаут на случай медленного интернета
      const maxLoadingTime = 5000;
      this.loadingTimeoutRef = window.setTimeout(() => {
        if (failedTilesCount >= maxFailedTiles) {
          runInAction(() => {
            this.mapFailed = true;
          });
        }
        hideLoader();
      }, maxLoadingTime);

      // Обработчик перемещения карты для обновления BBOX
      const handleMapMoveEnd = () => {
        const extent = view.calculateExtent();
        this.handleBboxChange(extent);
      };

      this.moveEndHandlerRef = handleMapMoveEnd;
      map.on('moveend', handleMapMoveEnd);

      // Ждем, пока контейнер получит размеры, затем обновляем размер карты и позиционируем на BBOX
      setTimeout(() => {
        map.updateSize();
        view.fit(bbox, { padding: [10, 10, 10, 10] });
      }, 100);
    } catch (error) {
      services.logger.error('SelectBboxControl: Ошибка при инициализации карты', error);
      Toast.error('Ошибка при инициализации карты');
      runInAction(() => {
        this.mapFailed = true;
        this.mapLoading = false;
      });
    }
  }

  @action.bound
  private cleanup() {
    if (this.mapInstanceRef) {
      if (this.moveEndHandlerRef) {
        this.mapInstanceRef.un('moveend', this.moveEndHandlerRef);
        this.moveEndHandlerRef = null;
      }
      this.mapInstanceRef.setTarget(undefined);
      this.mapInstanceRef = null;
    }

    if (this.loadingTimeoutRef !== null) {
      clearTimeout(this.loadingTimeoutRef);
      this.loadingTimeoutRef = null;
    }

    this.mapLoading = false;
  }
}
