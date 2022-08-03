import React, { Component } from 'react';
import { action, observable, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { Popover } from '@mui/material';
import { pluralize } from 'numeralize-ru';
import { withBemMod } from '@bem-react/core';

import { PropertyType } from '../../../../services/data/schema.models';
import { FileInfo } from '../../../../services/data/files.service';
import { PseudoLink } from '../../../PseudoLink/PseudoLink';
import { Files } from '../../../Files/Files';

import { cnXTableCellContent, XTableCellContentBase, XTableCellContentProps } from '../XTable-CellContent.base';

@observer
class XTableCellContentTypeFile extends Component<XTableCellContentProps> {
  @observable private popupAnchor?: HTMLSpanElement;

  constructor(props: XTableCellContentProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { col, cellData, ...props } = this.props;
    let value: FileInfo[] = (cellData as FileInfo[]) || [];

    try {
      if (typeof cellData === 'string') {
        value = JSON.parse(String(cellData)) as FileInfo[];
      }
    } catch {}

    const files = (
      <Files property={{ name: col.field, propertyType: PropertyType.FILE, title: String(col.title) }} value={value} />
    );

    return (
      <XTableCellContentBase col={col} {...props}>
        {cellData &&
          Boolean(value.length) &&
          (value.length === 1 ? (
            files
          ) : (
            <>
              <PseudoLink onClick={this.handleClick}>
                {value.length} {pluralize(value.length, 'файл', 'файла', 'файлов')}
              </PseudoLink>
              <Popover open={Boolean(this.popupAnchor)} onClose={this.handleClose} anchorEl={this.popupAnchor}>
                {files}
              </Popover>
            </>
          ))}
      </XTableCellContentBase>
    );
  }

  @action.bound
  private handleClick(e: React.MouseEvent<HTMLSpanElement, MouseEvent>) {
    this.popupAnchor = e.target as HTMLSpanElement;
  }

  @action.bound
  private handleClose() {
    this.popupAnchor = undefined;
  }
}

export const withTypeFile = withBemMod<XTableCellContentProps, XTableCellContentProps>(
  cnXTableCellContent(),
  { type: PropertyType.FILE },
  () => XTableCellContentTypeFile
);
