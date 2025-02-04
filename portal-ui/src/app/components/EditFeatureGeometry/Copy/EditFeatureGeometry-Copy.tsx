import React, { Component, RefObject } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { FileCopyOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { Coordinate } from 'ol/coordinate';

import { GeometryType } from '../../../services/geoserver/wfs/wfs.models';
import { selectLabelForGeometryType } from '../../../services/geoserver/wfs/wfs.util';
import { copyNodeToClipboard } from '../../../services/util/clipboard.util';

const cnEditFeatureGeometryCopy = cn('EditFeatureGeometry', 'Copy');

interface EditFeatureGeometryCopyProps {
  coordinates: Coordinate[];
  tableRef: RefObject<HTMLTableElement>;
  geometryType: GeometryType;
  first: boolean;
}

export class EditFeatureGeometryCopy extends Component<EditFeatureGeometryCopyProps> {
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
      <Tooltip title={`Копировать координаты ${partLabel} в буфер обмена`}>
        <IconButton className={cnEditFeatureGeometryCopy()} onClick={this.handleClick}>
          <FileCopyOutlined />
        </IconButton>
      </Tooltip>
    );
  }

  @boundMethod
  private handleClick() {
    const { tableRef } = this.props;
    if (tableRef.current) {
      copyNodeToClipboard(tableRef.current);
    }
  }
}
