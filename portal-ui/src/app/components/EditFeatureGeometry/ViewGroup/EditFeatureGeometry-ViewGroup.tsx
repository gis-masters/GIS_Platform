import React, { Component, FC, createRef, RefObject } from 'react';
import { cn } from '@bem-react/classname';
import { Coordinate } from 'ol/coordinate';
import { Paper, PaperProps, Table, TableContainer, TableHead, TableBody, TableRow, TableCell } from '@material-ui/core';

import { EditFeatureGeometryStore } from '../../../stores/EditFeatureGeometry.store';

import { EditFeatureGeometryViewGroupControls } from '../ViewGroupControls/EditFeatureGeometry-ViewGroupControls';

import '!style-loader!css-loader!sass-loader!./EditFeatureGeometry-ViewGroup.scss';

const cnEditFeatureGeometryViewGroup = cn('EditFeatureGeometry', 'ViewGroup');

interface EditFeatureGeometryViewGroupProps {
  coordinates: Coordinate[];
  isPoint?: boolean;
  store: EditFeatureGeometryStore;
  index: number;
}

const Container: FC<PaperProps> = props => <Paper {...props} square />;

export class EditFeatureGeometryViewGroup extends Component<EditFeatureGeometryViewGroupProps> {
  tableRef: RefObject<HTMLTableElement> = createRef();

  render() {
    const { coordinates, isPoint, store, index } = this.props;

    return (
      <TableContainer component={Container} className={cnEditFeatureGeometryViewGroup()}>
        <EditFeatureGeometryViewGroupControls
          coordinates={coordinates}
          tableRef={this.tableRef}
          store={store}
          index={index}
        />
        <Table size='small' ref={this.tableRef}>
          <TableHead>
            <TableRow>
              {!isPoint && <TableCell>&nbsp;</TableCell>}
              <TableCell align='center'>X</TableCell>
              <TableCell align='center'>Y</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {coordinates.map((coordinate, i) => (
              <TableRow key={i}>
                {!isPoint && <TableCell align='right'>{i + 1}</TableCell>}
                <TableCell>{coordinate[1]}</TableCell>
                <TableCell>{coordinate[0]}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
}
