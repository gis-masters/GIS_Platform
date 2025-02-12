import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Dialog, DialogActions, DialogContent, TextField, Tooltip } from '@mui/material';
import { ListAlt } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { clone, isEqual } from 'lodash';
import { Coordinate } from 'ol/coordinate';

import {
  GeometryType,
  WfsLineStringGeometry,
  WfsMultiLineStringGeometry,
  WfsMultiPolygonGeometry,
  WfsPointGeometry
} from '../../../services/geoserver/wfs/wfs.models';
import { getEmptyGeometry, selectLabelForGeometryType } from '../../../services/geoserver/wfs/wfs.util';
import { Button } from '../../Button/Button';
import { IconButton } from '../../IconButton/IconButton';

import '!style-loader!css-loader!sass-loader!../AsTextDialog/EditFeatureGeometry-AsTextDialog.scss';
import '!style-loader!css-loader!sass-loader!../Text/EditFeatureGeometry-Text.scss';

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
          <IconButton className={cnEditFeatureGeometry('AsText')} onClick={this.openDialog}>
            <ListAlt />
          </IconButton>
        </Tooltip>
        <Dialog
          open={this.isOpen}
          onClose={this.closeDialog}
          PaperProps={{ className: cnEditFeatureGeometry('AsTextDialog') }}
        >
          <DialogContent>
            <TextField
              className={cnEditFeatureGeometry('Text')}
              value={this.text}
              onChange={this.handleChange}
              multiline
              autoFocus
              variant='standard'
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.save} color='primary'>
              Изменить
            </Button>
            <Button onClick={this.closeDialog}>Отмена</Button>
          </DialogActions>
        </Dialog>
      </>
    );
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

  @boundMethod
  private handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    this.setText(e.target.value);
  }

  @action
  private setText(text: string) {
    this.text = text;
  }

  @action.bound
  private openDialog() {
    this.initText();
    this.isOpen = true;
  }

  @action.bound
  private closeDialog() {
    this.isOpen = false;
  }

  @action.bound
  private save() {
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
    this.closeDialog();
  }
}
