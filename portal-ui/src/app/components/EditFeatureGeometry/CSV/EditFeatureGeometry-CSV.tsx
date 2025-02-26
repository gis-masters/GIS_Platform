import React, { ChangeEvent, Component, createRef } from 'react';
import { action, makeObservable } from 'mobx';
import { IconButton, Tooltip } from '@mui/material';
import { ArchiveOutlined, UnarchiveOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { clone, isEqual } from 'lodash';
import { Coordinate } from 'ol/coordinate';

import { GeometryType } from '../../../services/geoserver/wfs/wfs.models';
import { selectLabelForGeometryType } from '../../../services/geoserver/wfs/wfs.util';
import { exportAsCSV } from '../../../services/util/export';
import { extractCoordinates } from '../../../services/util/extractCoordinates.util';
import { EditFeatureGeometryCSVInput } from '../CSVInput/EditFeatureGeometry-CSVInput';

const cnEditFeatureGeometryCSV = cn('EditFeatureGeometry', 'CSV');

interface EditFeatureGeometryCSVProps {
  coordinates: Coordinate[];
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
            <IconButton className={cnEditFeatureGeometryCSV({ do: 'import' })} onClick={this.handleImportClick}>
              <ArchiveOutlined />
            </IconButton>
          </Tooltip>
        )}

        <Tooltip title={`Экспорт координат ${partLabel} в CSV`}>
          <span>
            <IconButton
              className={cnEditFeatureGeometryCSV({ do: 'export' })}
              disabled={empty}
              onClick={this.handleExportClick}
            >
              <UnarchiveOutlined />
            </IconButton>
          </span>
        </Tooltip>

        <EditFeatureGeometryCSVInput onChange={this.handleFileInput} inputRef={this.inputRef} />
      </>
    );
  }

  @boundMethod
  private handleImportClick() {
    this.inputRef.current?.click();
  }

  @boundMethod
  private handleExportClick() {
    exportAsCSV(
      this.props.coordinates.map(coord => {
        const newCoords = clone(coord);
        newCoords.reverse();

        return newCoords;
      }),
      'coordinates'
    );
  }

  @boundMethod
  private handleFileInput(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        this.doImport(reader.result as string);
      };
      // eslint-disable-next-line unicorn/prefer-blob-reading-methods -- FIXME разобраться с blob.text()
      reader.readAsText(e.target.files[0]);
    }
  }

  @action
  private doImport(csv: string) {
    const { coordinates, mustBeClosed } = this.props;
    const newCoordinates: Coordinate[] = extractCoordinates(csv);

    if (mustBeClosed && !isEqual(newCoordinates[0], newCoordinates.at(-1))) {
      newCoordinates.push(newCoordinates[0]);
    }

    coordinates.splice(0, coordinates.length, ...newCoordinates);
  }
}
