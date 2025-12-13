import React, { type ChangeEvent, Component } from 'react';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { OutlinedInput, Tooltip } from '@mui/material';
import { WarningAmberOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { booleanPointInPolygon, point } from '@turf/turf';
import { boundMethod } from 'autobind-decorator';
import { type Coordinate } from 'ol/coordinate';

import {
  DEFAULT_OL_PROJECTION,
  defaultOlProjectionCode,
  type Projection
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

import './EditFeatureGeometry-Coord.scss';
import '../CoordInput/EditFeatureGeometry-CoordInput.scss';
import '../CoordNumber/EditFeatureGeometry-CoordNumber.scss';

const warningText = 'Внимание. Заданная координата может выходить за рамки имеющегося слоя';

const cnEditFeatureGeometry = cn('EditFeatureGeometry');

interface EditFeatureGeometryCoordProps {
  val: Coordinate;
  withControls?: boolean;
  canBeDeleted?: boolean;
  disabled?: boolean;
  displayIndex: number;
  index: number;
  active?: boolean;
  onChange(val: Coordinate, i: number): void;
  onDelete?(index: number): void;
}

@observer
export class EditFeatureGeometryCoord extends Component<EditFeatureGeometryCoordProps> {
  @observable private defaultProjection?: Projection;
  @observable private flashX = false;
  @observable private flashY = false;
  @observable private stringX = ''; // Строковое представление для X
  @observable private stringY = ''; // Строковое представление для Y

  constructor(props: EditFeatureGeometryCoordProps) {
    super(props);
    makeObservable(this);

    // Инициализируем строковые значения из props
    this.stringX = props.val[0].toString();
    this.stringY = props.val[1].toString();
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

    // Обновляем строковые значения только если координаты изменились извне
    if (prevVal[0] !== val[0]) {
      this.stringX = val[0].toString();
      this.triggerFlash(0);
    }

    if (prevVal[1] !== val[1]) {
      this.stringY = val[1].toString();
      this.triggerFlash(1);
    }
  }

  render() {
    const { withControls, displayIndex, disabled, active, canBeDeleted } = this.props;

    return (
      <div className={cnEditFeatureGeometry('Coord', { withControls, active })}>
        {withControls ? <div className={cnEditFeatureGeometry('CoordNumber')}>{(displayIndex || 0) + 1}</div> : null}

        <OutlinedInput
          className={cnEditFeatureGeometry('CoordInput', { d: 'x', flash: this.flashY })}
          value={this.stringY}
          error={!isDimensionValid(this.stringY)}
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
          value={this.stringX}
          error={!isDimensionValid(this.stringX)}
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
            disabled={!canBeDeleted || disabled}
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

  @action.bound
  private handleCoordinateChange(e: ChangeEvent<HTMLInputElement>, coordIndex: 0 | 1) {
    let value = e.target.value;

    // Валидация ввода
    value = value
      .replaceAll(',', '.')
      .replaceAll(/[^\d.]/g, '') // Убираем все символы кроме цифр и точки
      .replaceAll(/(\..*)\./g, '$1');

    if (coordIndex === 0) {
      this.stringX = value;
    } else {
      this.stringY = value;
    }

    // Пытаемся преобразовать в число только если ввод завершен
    // иначе точка просто исчезнет
    const numericValue = this.parseCoordinateValue(value);

    if (!Number.isNaN(numericValue)) {
      const { val, onChange, index } = this.props;
      const coord = [...val] as Coordinate;
      coord[coordIndex] = numericValue;

      onChange(coord, index);
    }

    this.triggerFlash(coordIndex);
  }

  private parseCoordinateValue(value: string): number {
    if (value === '' || value === '.') {
      return Number.NaN;
    }

    const numericValue = Number(value);

    return Number.isNaN(numericValue) ? Number.NaN : numericValue;
  }

  // При потере фокуса нормализуем значения
  @boundMethod
  private handleInputBlur() {
    const numericX = this.parseCoordinateValue(this.stringX);
    const numericY = this.parseCoordinateValue(this.stringY);

    this.stringX = Number.isNaN(numericX) ? '0' : numericX.toString();

    this.stringY = Number.isNaN(numericY) ? '0' : numericY.toString();

    coordinateHighlightService.setActiveVertex(null);
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
  private handleChangeX(e: ChangeEvent<HTMLInputElement>) {
    this.handleCoordinateChange(e, 0);
  }

  @action.bound
  private handleChangeY(e: ChangeEvent<HTMLInputElement>) {
    this.handleCoordinateChange(e, 1);
  }

  @boundMethod
  private handleDelete() {
    const { onDelete, index } = this.props;

    if (onDelete) {
      onDelete(index);
    }
  }

  @boundMethod
  private handleInputFocus() {
    coordinateHighlightService.setActiveVertex(this.props.val);
  }

  @boundMethod
  private onMouseEnter(): void {
    coordinateHighlightService.setActiveGroup([this.props.val]);
  }

  @boundMethod
  private onMouseLeave(): void {
    coordinateHighlightService.setActiveGroup(null);
  }

  @action
  private setDefaultProjection(projection: Projection): void {
    this.defaultProjection = projection;
  }
}
