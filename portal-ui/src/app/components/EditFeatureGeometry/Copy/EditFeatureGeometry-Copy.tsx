import React, { Component, RefObject } from 'react';
import { cn } from '@bem-react/classname';
import { Coordinate } from 'ol/coordinate';
import { IconButton, Tooltip } from '@material-ui/core';
import { FileCopyOutlined } from '@material-ui/icons';
import { boundMethod } from 'autobind-decorator';

const cnEditFeatureGeometryCopy = cn('EditFeatureGeometry', 'Copy');

interface EditFeatureGeometryCopyProps {
  coordinates: Coordinate[];
  tableRef: RefObject<HTMLTableElement>;
}

export class EditFeatureGeometryCopy extends Component<EditFeatureGeometryCopyProps> {
  render() {
    return (
      <Tooltip title='Копировать координаты линии/контура в буфер обмена'>
        <IconButton className={cnEditFeatureGeometryCopy()} onClick={this.clickHandler}>
          <FileCopyOutlined />
        </IconButton>
      </Tooltip>
    );
  }

  @boundMethod
  private clickHandler() {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(this.props.tableRef.current);
    selection.removeAllRanges();
    selection.addRange(range);

    try {
      document.execCommand('copy');
    } catch (e) {
      throw new Error('Не копируется :(');
    }

    selection.removeAllRanges();
  }
}
