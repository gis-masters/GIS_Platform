import React, { Component, ChangeEvent, createRef } from 'react';
import { action } from 'mobx';
import { cn } from '@bem-react/classname';
import { IconButton, Tooltip } from '@material-ui/core';
import { Archive, Unarchive } from '@material-ui/icons';
import { saveAs } from 'file-saver';
import { parse, unparse } from 'papaparse';
import { isEqual, clone } from 'lodash';
import { boundMethod } from 'autobind-decorator';

import { CoordinateEdited } from '../../../services/geoserver/wfs-models';

import { EditFeatureGeometryCSVInput } from '../CSVInput/EditFeatureGeometry-CSVInput';

const cnEditFeatureGeometryCSV = cn('EditFeatureGeometry', 'CSV');

interface EditFeatureGeometryCSVProps {
  coordinates: CoordinateEdited[];
  empty?: boolean;
  mustBeClosed?: boolean;
  readOnly?: boolean;
}

export class EditFeatureGeometryCSV extends Component<EditFeatureGeometryCSVProps> {
  private inputRef = createRef<HTMLInputElement>();

  render() {
    const { readOnly, empty } = this.props;

    return (
      <>
        {!readOnly && (
          <Tooltip title='Импорт координат линии/контура из CSV'>
            <IconButton className={cnEditFeatureGeometryCSV({ do: 'import' })} onClick={this.importClickHandler}>
              <Archive />
            </IconButton>
          </Tooltip>
        )}

        <Tooltip title='Экспорт координат линии/контура в CSV'>
          <span>
            <IconButton
              className={cnEditFeatureGeometryCSV({ do: 'export' })}
              disabled={empty}
              onClick={this.exportClickHandler}
            >
              <Unarchive />
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
  }

  @boundMethod
  private exportClickHandler() {
    this.saveAs(unparse(this.props.coordinates.map(coord => clone(coord).reverse())));
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
    // @ts-ignore
    const result = parse(csv, { skipEmptyLines: 'greedy' });

    if (result.errors.length) {
      throw new Error('Ошибка чтения CSV');
    }

    const { coordinates, mustBeClosed } = this.props;
    const newCoordinates: CoordinateEdited[] = result.data
      .map((point: CoordinateEdited) => point.reverse())
      .filter((point: CoordinateEdited) => point[0] && point[1]);

    if (mustBeClosed && !isEqual(newCoordinates[0], newCoordinates[newCoordinates.length - 1])) {
      newCoordinates.push(newCoordinates[0]);
    }

    coordinates.splice(0, coordinates.length, ...newCoordinates);
  }

  private saveAs(data: string) {
    const file = new Blob([data], { type: 'text/plain' });
    saveAs(file, 'coordinates.csv', { autoBom: false });
  }
}
