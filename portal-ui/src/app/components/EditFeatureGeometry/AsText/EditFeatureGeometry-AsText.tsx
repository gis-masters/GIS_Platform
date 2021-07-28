import React, { Component } from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { Dialog, DialogContent, DialogActions, TextField, IconButton, Tooltip } from '@material-ui/core';
import { ListAlt } from '@material-ui/icons';
import { isEqual, clone } from 'lodash';
import { boundMethod } from 'autobind-decorator';

import { getEmptyGeometry, selectLabelForGeometryType } from '../../../services/geoserver/wfs.util';
import {
  CoordinateEdited,
  GeometryType,
  WfsMultiLineStringGeometry,
  WfsMultiPolygonGeometry,
  WfsPointGeometry
} from '../../../services/geoserver/wfs.models';
import { Button } from '../../Button/Button';

import '!style-loader!css-loader!sass-loader!../AsTextDialog/EditFeatureGeometry-AsTextDialog.scss';
import '!style-loader!css-loader!sass-loader!../Text/EditFeatureGeometry-Text.scss';

const cnEditFeatureGeometry = cn('EditFeatureGeometry');

interface EditFeatureGeometryAsTextProps {
  coordinates: CoordinateEdited[];
  mustBeClosed: boolean;
  onChange?: (coordinates: CoordinateEdited[]) => void;
  geometryType: GeometryType;
  first: boolean;
}

@observer
export class EditFeatureGeometryAsText extends Component<EditFeatureGeometryAsTextProps> {
  @observable private isOpen = false;
  @observable private text: string;

  render() {
    const { geometryType, first } = this.props;
    const partLabel = selectLabelForGeometryType(
      geometryType,
      `контура${first ? '' : ' (вырезки)'}`,
      'линии',
      'точки',
      'группы'
    );

    return (
      <>
        <Tooltip title={`Координаты ${partLabel} как текст`}>
          <IconButton
            className={cnEditFeatureGeometry('AsText')}
            color={this.isOpen ? 'secondary' : 'default'}
            onClick={this.openDialog}
          >
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
              onChange={this.changeHandler}
              multiline
              autoFocus
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
  private changeHandler(e: React.ChangeEvent<HTMLTextAreaElement>) {
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
    let newCoordinates: CoordinateEdited[] = this.text
      .replace(/,/g, '.')
      .split('\n')
      .map(row => row.trim().replace(/\s+/g, ' '))
      .filter(row => row)
      .map(row => {
        const rowArr = row.split(/\s/);
        rowArr.reverse();

        return rowArr;
      });

    if (!newCoordinates.length) {
      const emptyGeometry = getEmptyGeometry(geometryType);
      switch (geometryType) {
        case GeometryType.POINT: {
          newCoordinates = [(emptyGeometry as WfsPointGeometry<CoordinateEdited>).coordinates];
          break;
        }
        case GeometryType.MULTI_LINE_STRING: {
          newCoordinates = (emptyGeometry as WfsMultiLineStringGeometry).coordinates[0];
          break;
        }
        case GeometryType.MULTI_POLYGON: {
          newCoordinates = (emptyGeometry as WfsMultiPolygonGeometry).coordinates[0][0];
          break;
        }
      }
    }

    if (mustBeClosed && !isEqual(newCoordinates[0], newCoordinates[newCoordinates.length - 1])) {
      newCoordinates.push(newCoordinates[0]);
    }

    coordinates.splice(0, coordinates.length, ...newCoordinates);
    if (onChange) {
      onChange(coordinates);
    }
    this.closeDialog();
  }
}
