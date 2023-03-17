import React, { Component, ChangeEvent, createRef } from 'react';
import { action, makeObservable } from 'mobx';
import { cn } from '@bem-react/classname';
import { IconButton, Tooltip } from '@mui/material';
import { ArchiveOutlined, UnarchiveOutlined } from '@mui/icons-material';
import { boundMethod } from 'autobind-decorator';
import { isEqual, clone } from 'lodash';
import { parse } from 'papaparse';

import { selectLabelForGeometryType } from '../../../services/geoserver/wfs/wfs.util';
import { CoordinateEdited, GeometryType } from '../../../services/geoserver/wfs/wfs.models';
import { communicationService } from '../../../services/communication.service';

import { EditFeatureGeometryCSVInput } from '../CSVInput/EditFeatureGeometry-CSVInput';
import { exportAsCSV } from '../../../services/util/export';

const cnEditFeatureGeometryCSV = cn('EditFeatureGeometry', 'CSV');

interface EditFeatureGeometryCSVProps {
  coordinates: CoordinateEdited[];
  empty?: boolean;
  mustBeClosed?: boolean;
  readOnly?: boolean;
  geometryType: GeometryType;
  first: boolean;
}

export class EditFeatureGeometryCSV extends Component<EditFeatureGeometryCSVProps> {
  private inputRef = createRef<HTMLInputElement>();

  constructor(props: EditFeatureGeometryCSVProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { readOnly, empty, geometryType, first } = this.props;
    const partLabel = selectLabelForGeometryType(
      geometryType,
      `контура${first ? '' : ' (вырезки)'}`,
      'линии',
      'точки',
      'группы'
    );

    return (
      <>
        {!readOnly && (
          <Tooltip title={`Импорт координат ${partLabel} из CSV`}>
            <IconButton className={cnEditFeatureGeometryCSV({ do: 'import' })} onClick={this.importClickHandler}>
              <ArchiveOutlined />
            </IconButton>
          </Tooltip>
        )}

        <Tooltip title={`Экспорт координат ${partLabel} в CSV`}>
          <span>
            <IconButton
              className={cnEditFeatureGeometryCSV({ do: 'export' })}
              disabled={empty}
              onClick={this.exportClickHandler}
            >
              <UnarchiveOutlined />
            </IconButton>
          </span>
        </Tooltip>

        <EditFeatureGeometryCSVInput onChange={this.fileHandler} inputRef={this.inputRef} />
      </>
    );
  }

  @boundMethod
  private importClickHandler() {
    this.inputRef.current.click();

    communicationService.drawOff.emit();
  }

  @boundMethod
  private exportClickHandler() {
    exportAsCSV(
      this.props.coordinates.map(coord => {
        const newCoords = clone(coord);
        newCoords.reverse();

        return newCoords;
      }),
      'coordinates'
    );

    communicationService.drawOff.emit();
  }

  @boundMethod
  private fileHandler(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        this.doImport(reader.result as string);
      };
      reader.readAsText(e.target.files[0]);
    }
  }

  @action
  private doImport(csv: string) {
    const result = parse(csv, { skipEmptyLines: 'greedy' });

    if (result.errors.length) {
      throw new Error('Ошибка чтения CSV');
    }

    const { coordinates, mustBeClosed } = this.props;
    const newCoordinates: CoordinateEdited[] = result.data
      .map((point: CoordinateEdited) => {
        point.reverse();

        return point;
      })
      .filter((point: CoordinateEdited) => point[0] && point[1]);

    if (mustBeClosed && !isEqual(newCoordinates[0], newCoordinates[newCoordinates.length - 1])) {
      newCoordinates.push(newCoordinates[0]);
    }

    coordinates.splice(0, coordinates.length, ...newCoordinates);
  }
}
