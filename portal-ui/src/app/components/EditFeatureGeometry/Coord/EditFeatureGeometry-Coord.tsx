import React, { Component } from 'react';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { OutlinedInput, Tooltip } from '@mui/material';
import { WarningAmberOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { booleanPointInPolygon, point } from '@turf/turf';
import { boundMethod } from 'autobind-decorator';
import { Coordinate } from 'ol/coordinate';

import {
  DEFAULT_OL_PROJECTION,
  defaultOlProjectionCode,
  Projection
} from '../../../services/data/projections/projections.models';
import { getProjectionByCode } from '../../../services/data/projections/projections.service';
import { GeometryType } from '../../../services/geoserver/wfs/wfs.models';
import { isDimensionValid } from '../../../services/geoserver/wfs/wfs.util';
import { editFeatureStore } from '../../../services/map/a-map-mode/edit-feature/EditFeatureStore';
import { coordinateHighlightService } from '../../../services/map/coordinate-highlight/coordinate-highlight.service';
import { services } from '../../../services/services';
import { transformGeometry } from '../../../services/util/coordinates-transform.util';
import { isNumberArray } from '../../../services/util/typeGuards/isNumberArray';
import { EditFeatureGeometryCoordDel } from '../CoordDel/EditFeatureGeometry-CoordDel';

import '!style-loader!css-loader!sass-loader!./EditFeatureGeometry-Coord.scss';
import '!style-loader!css-loader!sass-loader!../CoordInput/EditFeatureGeometry-CoordInput.scss';
import '!style-loader!css-loader!sass-loader!../CoordNumber/EditFeatureGeometry-CoordNumber.scss';

const warningText = 'Внимание. Заданная координата может выходить за рамки имеющегося слоя';

const cnEditFeatureGeometry = cn('EditFeatureGeometry');

interface EditFeatureGeometryCoordProps {
  val: Coordinate;
  withControls?: boolean;
  canBeDeleted?: boolean;
  disabled?: boolean;
  displayIndex?: number;
  index?: number;
  active?: boolean;
  onChange(val: Coordinate, i: number): void;
  onDelete?(index: number): void;
}

@observer
export class EditFeatureGeometryCoord extends Component<EditFeatureGeometryCoordProps> {
  @observable private defaultProjection?: Projection;
  @observable private flashX = false;
  @observable private flashY = false;

  constructor(props: EditFeatureGeometryCoordProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount(): Promise<void> {
    const projection = await getProjectionByCode(defaultOlProjectionCode);

    if (projection) {
      this.setDefaultProjection(projection);
    }
  }

  componentDidUpdate(prevProps: EditFeatureGeometryCoordProps): void {
    const { val } = this.props;
    const { val: prevVal } = prevProps;

    // Проверяем, изменились ли координаты извне (например, с карты)
    if (prevVal[0] !== val[0] || prevVal[1] !== val[1]) {
      // Определяем, какая координата изменилась
      if (prevVal[0] !== val[0]) {
        // Изменилась X координата (второй инпут)
        this.triggerFlash(0);
      }
      if (prevVal[1] !== val[1]) {
        // Изменилась Y координата (первый инпут)
        this.triggerFlash(1);
      }
    }
  }

  render() {
    const { val, withControls, displayIndex, disabled, active, canBeDeleted } = this.props;

    // у росреестра своё понимание X и Y
    return (
      <div className={cnEditFeatureGeometry('Coord', { withControls, active })}>
        {withControls ? <div className={cnEditFeatureGeometry('CoordNumber')}>{(displayIndex || 0) + 1}</div> : null}

        <OutlinedInput
          className={cnEditFeatureGeometry('CoordInput', { d: 'x', flash: this.flashY })}
          value={val[1]}
          error={!isDimensionValid(val[1])}
          color={this.warning ? 'warning' : undefined}
          endAdornment={
            this.warning ? (
              <Tooltip title={warningText}>
                <WarningAmberOutlined color='warning' />
              </Tooltip>
            ) : undefined
          }
          onChange={this.handleChangeY}
          onFocus={this.handleInputFocus}
          onBlur={this.handleInputBlur}
          disabled={disabled}
        />

        <OutlinedInput
          className={cnEditFeatureGeometry('CoordInput', { d: 'y', flash: this.flashX })}
          value={val[0]}
          error={!isDimensionValid(val[0])}
          color={this.warning ? 'warning' : undefined}
          endAdornment={
            this.warning ? (
              <Tooltip title={warningText}>
                <WarningAmberOutlined color='warning' />
              </Tooltip>
            ) : undefined
          }
          onChange={this.handleChangeX}
          onFocus={this.handleInputFocus}
          onBlur={this.handleInputBlur}
          disabled={disabled}
        />

        {withControls && (
          <EditFeatureGeometryCoordDel
            onClick={this.handleDelete}
            onMouseEnter={this.onMouseEnter}
            onMouseLeave={this.onMouseLeave}
            disabled={!canBeDeleted || !!disabled}
          />
        )}
      </div>
    );
  }

  @computed
  private get warning(): boolean {
    const { val } = this.props;

    try {
      const { currentProjection, editFeaturesData, layerExtent } = editFeatureStore;
      if (!editFeaturesData?.layer || !currentProjection || !layerExtent || !this.defaultProjection) {
        return false;
      }

      let cloneVal = val.map(Number);

      if (!isNumberArray(cloneVal) || cloneVal.some(item => Number.isNaN(item))) {
        //ошибку подсвечивает isDimensionValid(val)

        return false;
      }

      if (currentProjection.authSrid !== DEFAULT_OL_PROJECTION.srid && currentProjection && this.defaultProjection) {
        const geometry = transformGeometry(
          { type: GeometryType.POINT, coordinates: cloneVal },
          currentProjection,
          this.defaultProjection
        );

        if (geometry) {
          cloneVal = geometry.coordinates.map(Number);
        }
      }

      const checkPoint = point(cloneVal);
      const isPointInPolygon = booleanPointInPolygon(checkPoint, layerExtent);

      editFeatureStore.setGeometryWarning(!isPointInPolygon);

      return !isPointInPolygon;
    } catch {
      services.logger.error('Не удалось провалидировать координату: ', val);

      return true;
    }
  }

  @action
  private setDefaultProjection(projection: Projection): void {
    this.defaultProjection = projection;
  }

  @action
  private triggerFlash(coordIndex: 0 | 1): void {
    // У росреестра своё понимание X и Y: coordIndex 0 = X (второй инпут), coordIndex 1 = Y (первый инпут)
    if (coordIndex === 0) {
      // X координата (второй инпут)
      this.flashX = true;
      setTimeout(() => {
        this.stopFlashX();
      }, 800);
    } else {
      // Y координата (первый инпут)
      this.flashY = true;
      setTimeout(() => {
        this.stopFlashY();
      }, 800);
    }
  }

  @action
  private stopFlashX(): void {
    this.flashX = false;
  }

  @action
  private stopFlashY(): void {
    this.flashY = false;
  }

  @action.bound
  private handleChangeX(e: React.ChangeEvent<HTMLInputElement>) {
    this.handleCoordinateChange(e, 0);
  }

  @action.bound
  private handleChangeY(e: React.ChangeEvent<HTMLInputElement>) {
    this.handleCoordinateChange(e, 1);
  }

  @action.bound
  private handleCoordinateChange(
    e: React.ChangeEvent<HTMLInputElement>,
    coordIndex: 0 | 1 // 0 для X, 1 для Y
  ) {
    const { val, onChange, index } = this.props;

    let value = e.target.value;

    // 1. Нормализация ввода
    value = value
      .replaceAll(',', '.') // Заменяем запятые на точки
      .replaceAll(/[^\d.]/g, '') // Удаляем все нецифровые символы
      .replaceAll(/(\..*)\./g, '$1'); // Удаляем лишние точки

    // 2. Обработка целой и дробной частей
    const [integerPart = '', fractionalPart = ''] = value.split('.');
    const processedInteger = integerPart.slice(0, 10); // Макс 10 цифр
    const processedFraction = fractionalPart.slice(0, 4); // Макс 4 цифры

    // 3. Формирование конечного значения
    let finalValue = processedInteger;
    if (value.includes('.') || value.endsWith('.')) {
      finalValue += fractionalPart ? `.${processedFraction}` : '.';
    }

    // 4. Обновление поля ввода
    e.target.value = finalValue;

    // 5. Преобразование в число (если ввод завершен)
    const numericValue = value.endsWith('.') ? Number(finalValue.replace(/\.$/, '')) || 0 : Number(finalValue);

    // 6. Обновление состояния
    if (numericValue !== val[coordIndex]) {
      val[coordIndex] = numericValue;
      if (index !== undefined) {
        onChange(val, index);
      }

      // Запускаем анимацию вспышки
      this.triggerFlash(coordIndex);
    }
  }

  @boundMethod
  private handleDelete() {
    const { onDelete, index } = this.props;

    if (onDelete && index) {
      onDelete(index);
    }
  }

  @boundMethod
  private handleInputFocus() {
    coordinateHighlightService.setActiveVertex(this.props.val);
  }

  @boundMethod
  private handleInputBlur() {
    coordinateHighlightService.setActiveVertex(null);
  }

  @boundMethod
  private onMouseEnter(): void {
    coordinateHighlightService.setActiveGroup([this.props.val]);
  }

  @boundMethod
  private onMouseLeave(): void {
    coordinateHighlightService.setActiveGroup(null);
  }
}
