import React, { Component, RefObject } from 'react';
import { cn } from '@bem-react/classname';
import { Coordinate } from 'ol/coordinate';
import { IconButton, Tooltip } from '@material-ui/core';
import { FileCopyOutlined } from '@material-ui/icons';
import { boundMethod } from 'autobind-decorator';
import GeometryType from 'ol/geom/GeometryType';

import { selectLabelForGeometryType } from '../../../services/geoserver/wfs.util';
import { copyNodeToClipboard } from '../../../services/util/copyNodeToClipboard';

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
        <IconButton className={cnEditFeatureGeometryCopy()} onClick={this.clickHandler}>
          <FileCopyOutlined />
        </IconButton>
      </Tooltip>
    );
  }

  @boundMethod
  private clickHandler() {
    copyNodeToClipboard(this.props.tableRef.current);
  }
}
