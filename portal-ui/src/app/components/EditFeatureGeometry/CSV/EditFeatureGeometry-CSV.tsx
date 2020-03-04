import React, { Component, ChangeEvent, createRef } from 'react';
import { action } from 'mobx';
import { cn } from '@bem-react/classname';
import { IconButton, Tooltip } from '@material-ui/core';
import { GetApp, Publish } from '@material-ui/icons';
import { saveAs } from 'file-saver';
import { parse, unparse } from 'papaparse';
import { isEqual } from 'lodash';

import { CoordinateEdited } from '../../../services/geoserver/wfs-models';

import { EditFeatureGeometryCSVInput } from '../CSVInput/EditFeatureGeometry-CSVInput';

const cnEditFeatureGeometry = cn('EditFeatureGeometry');

interface EditFeatureGeometryCSVProps {
  coordinates: CoordinateEdited[];
  empty: boolean;
  mustBeClosed: boolean;
}

export class EditFeatureGeometryCSV extends Component<EditFeatureGeometryCSVProps>{
  private inputRef = createRef<HTMLInputElement>();

  constructor (props: EditFeatureGeometryCSVProps) {
    super(props);

    this.importClickHandler = this.importClickHandler.bind(this);
    this.exportClickHandler = this.exportClickHandler.bind(this);
    this.fileHandler = this.fileHandler.bind(this);
  }

  render () {
    return (
      <>
        <Tooltip title='Импорт координат из CSV'>
          <IconButton
              className={cnEditFeatureGeometry('CSV', { do: 'import' })}
              color='primary'
              onClick={this.importClickHandler}>
            <GetApp />
          </IconButton>
        </Tooltip>

        <Tooltip title='Экспорт координат в CSV'>
          <span>
            <IconButton
                className={cnEditFeatureGeometry('CSV', { do: 'export' })}
                color='primary'
                disabled={this.props.empty}
                onClick={this.exportClickHandler}>
              <Publish />
            </IconButton>
          </span>
        </Tooltip>

        <EditFeatureGeometryCSVInput onChange={this.fileHandler} inputRef={this.inputRef} />
      </>
    );
  }

  private importClickHandler () {
    this.inputRef.current.click();
  }

  private exportClickHandler () {
    this.saveAs(unparse(this.props.coordinates));
  }

  private fileHandler (e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        this.doImport(reader.result as string);
      };
      reader.readAsText(e.target.files[0]);
    }
  }

  @action
  private doImport (csv: string) {
    // @ts-ignore
    const result = parse(csv, { skipEmptyLines: 'greedy' });

    if (result.errors.length) {
      throw new Error('Ошибка чтения CSV');
    }

    const { coordinates, mustBeClosed } = this.props;
    const newCoordinates: CoordinateEdited[] = result.data.filter((point: CoordinateEdited) => point[0] && point[1]);

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
