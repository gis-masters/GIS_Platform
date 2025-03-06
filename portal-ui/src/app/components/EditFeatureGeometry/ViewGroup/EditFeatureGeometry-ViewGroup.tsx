import React, { Component, createRef, FC, RefObject } from 'react';
import { Paper, PaperProps, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { cn } from '@bem-react/classname';
import { Coordinate } from 'ol/coordinate';

import { GeometryType } from '../../../services/geoserver/wfs/wfs.models';
import { editFeatureStore } from '../../../services/map/a-map-mode/edit-feature/EditFeatureStore';
import { EditFeatureGeometryViewGroupControls } from '../ViewGroupControls/EditFeatureGeometry-ViewGroupControls';

import '!style-loader!css-loader!sass-loader!./EditFeatureGeometry-ViewGroup.scss';

const cnEditFeatureGeometryViewGroup = cn('EditFeatureGeometry', 'ViewGroup');
const cnEditFeatureGeometryViewGroupIndexCell = cn('EditFeatureGeometry', 'ViewGroupIndexCell');

interface EditFeatureGeometryViewGroupProps {
  coordinates: Coordinate[];
  index: number;
  isPoint?: boolean;
  startIndex?: number;
}

const Container: FC<PaperProps> = props => <Paper {...props} square />;

export class EditFeatureGeometryViewGroup extends Component<EditFeatureGeometryViewGroupProps> {
  tableRef: RefObject<HTMLTableElement> = createRef();

  render() {
    const { coordinates, isPoint, index, startIndex = 0 } = this.props;

    return (
      <TableContainer component={Container} className={cnEditFeatureGeometryViewGroup()}>
        <EditFeatureGeometryViewGroupControls coordinates={coordinates} tableRef={this.tableRef} index={index} />
        <Table size='small' ref={this.tableRef}>
          <TableHead>
            <TableRow>
              {!isPoint && <TableCell>&nbsp;</TableCell>}
              <TableCell align='center'>X</TableCell>
              <TableCell align='center'>Y</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {coordinates.map((coordinate, i) => {
              const isLast = i === coordinates.length - 1;
              let displayIndex = i;

              if (
                editFeatureStore.geometryType === GeometryType.MULTI_POLYGON ||
                editFeatureStore.geometryType === GeometryType.POLYGON
              ) {
                displayIndex = isLast ? startIndex || index : startIndex + i;
              }

              if (editFeatureStore.geometryType === GeometryType.MULTI_LINE_STRING) {
                displayIndex = startIndex + i;
              }

              return (
                <TableRow key={i}>
                  {!isPoint && (
                    <TableCell className={cnEditFeatureGeometryViewGroupIndexCell()} align='right'>
                      {displayIndex + 1}
                    </TableCell>
                  )}
                  <TableCell>{coordinate[1]}</TableCell>
                  <TableCell>{coordinate[0]}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
}
