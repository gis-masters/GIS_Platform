import React, { type ChangeEvent, Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Dialog, DialogActions, DialogContent, TextField, Tooltip } from '@mui/material';
import { ListAlt } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { clone, isEqual } from 'lodash';
import { type Coordinate } from 'ol/coordinate';

import {
  GeometryType,
  type WfsLineStringGeometry,
  type WfsMultiLineStringGeometry,
  type WfsMultiPolygonGeometry,
  type WfsPointGeometry
} from '../../../services/geoserver/wfs/wfs.models';
import { getEmptyGeometry, selectLabelForGeometryType } from '../../../services/geoserver/wfs/wfs.util';
import { editFeatureHistoryStore } from '../../../services/map/a-map-mode/edit-feature/EditFeatureHistoryStore';
import { editFeatureStore } from '../../../services/map/a-map-mode/edit-feature/EditFeatureStore';
import { mapDrawService } from '../../../services/map/draw/map-draw.service';
import { Button } from '../../Button/Button';
import { IconButton } from '../../IconButton/IconButton';

import '../AsTextDialog/EditFeatureGeometry-AsTextDialog.scss';
import '../Text/EditFeatureGeometry-Text.scss';

const cnEditFeatureGeometry = cn('EditFeatureGeometry');

interface EditFeatureGeometryAsTextProps {
  coordinates: Coordinate[];
  mustBeClosed: boolean;
  geometryType: GeometryType;
  first: boolean;
  onChange?(coordinates: Coordinate[]): void;
}

@observer
export class EditFeatureGeometryAsText extends Component<EditFeatureGeometryAsTextProps> {
  @observable private isOpen = false;
  @observable private text = '';
  @observable private errorMessage: string | null = null;

  constructor(props: EditFeatureGeometryAsTextProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { geometryType, first } = this.props;
    const partLabel = selectLabelForGeometryType(
      geometryType,
      `контура${first ? '' : ' (вырезки)'}`,
      'линии',
      geometryType === GeometryType.MULTI_POINT ? 'точек' : 'точки',
      'группы'
    );

    return (
      <>
        <Tooltip title={`Координаты ${partLabel} как текст`}>
          <span>
            <IconButton className={cnEditFeatureGeometry('AsText')} onClick={this.openDialog}>
              <ListAlt />
            </IconButton>
          </span>
        </Tooltip>
        <Dialog
          open={this.isOpen}
          onClose={this.closeDialog}
          slotProps={{ paper: { className: cnEditFeatureGeometry('AsTextDialog') } }}
        >
          <DialogContent>
            <TextField
              className={cnEditFeatureGeometry('Text')}
              value={this.text}
              onChange={this.handleChange}
              multiline
              autoFocus
              variant='standard'
              error={Boolean(this.errorMessage)}
              helperText={this.errorMessage}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleSave} color='primary'>
              Изменить
            </Button>
            <Button onClick={this.closeDialog}>Отмена</Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  @boundMethod
  private async handleSave() {
    await this.save();
  }

  private initText() {
    this.setText(
      this.props.coordinates
        .map(coord => {
          const newCoord = clone(coord);
          newCoord.reverse();

          return newCoord.join('\t');
        })
        .join('\n')
    );
  }

  @action
  private setError(message: string) {
    this.errorMessage = message;
  }

  @action
  private clearError() {
    this.errorMessage = null;
  }

  @boundMethod
  private handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
    this.clearError();
    this.setText(e.target.value);
  }

  @action
  private setText(text: string) {
    this.text = text;
  }

  @action.bound
  private openDialog() {
    this.clearError();
    this.initText();
    this.isOpen = true;
  }

  @action.bound
  private closeDialog() {
    this.isOpen = false;
  }

  private async save() {
    const { coordinates, mustBeClosed, onChange, geometryType } = this.props;

    let newCoordinates: Coordinate[] = this.text
      .replaceAll(',', '.')
      .split('\n')
      .map(row => row.trim().replaceAll(/\s+/g, ' '))
      .filter(row => row.length > 0)
      .map(row => {
        const rowArr = row.split(/\s/).map(Number);
        rowArr.reverse();

        return rowArr;
      });

    // по 2 координаты в строке
    if (newCoordinates.some(coord => coord.length / 2 !== 1)) {
      this.setError('Некорректное значение');

      return;
    }

    if (!newCoordinates.length) {
      const emptyGeometry = getEmptyGeometry(geometryType);
      switch (geometryType) {
        case GeometryType.POINT: {
          newCoordinates = [(emptyGeometry as WfsPointGeometry).coordinates];
          break;
        }
        case GeometryType.LINE_STRING:
        case GeometryType.MULTI_POINT: {
          newCoordinates = (emptyGeometry as WfsLineStringGeometry).coordinates;
          break;
        }
        case GeometryType.MULTI_LINE_STRING:
        case GeometryType.POLYGON: {
          newCoordinates = (emptyGeometry as WfsMultiLineStringGeometry).coordinates[0];
          break;
        }
        default: {
          if ([GeometryType.MULTI_POLYGON].includes(geometryType)) {
            newCoordinates = (emptyGeometry as WfsMultiPolygonGeometry).coordinates[0][0];
          }
        }
      }
    }

    if (mustBeClosed && !isEqual(newCoordinates[0], newCoordinates.at(-1))) {
      newCoordinates.push(newCoordinates[0]);
    }

    coordinates.splice(0, coordinates.length, ...newCoordinates);
    if (onChange) {
      onChange(coordinates);
    }

    // Добавляем в историю как единый шаг
    if (editFeatureStore.geometry) {
      editFeatureHistoryStore.add(editFeatureStore.geometry, 'Ввод координат через текст');
    }

    await mapDrawService.syncFeatureGeometryWithMap();

    this.closeDialog();
  }
}
