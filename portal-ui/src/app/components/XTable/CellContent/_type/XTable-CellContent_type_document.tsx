import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Popover } from '@mui/material';
import { withBemMod } from '@bem-react/core';
import { pluralize } from 'numeralize-ru';

import { PropertyType } from '../../../../services/data/schema/schema.models';
import { DocumentInfo, Documents } from '../../../Documents/Documents';
import { PseudoLink } from '../../../PseudoLink/PseudoLink';
import { cnXTableCellContent, XTableCellContentBase, XTableCellContentProps } from '../XTable-CellContent.base';

@observer
class XTableCellContentTypeDocument extends Component<XTableCellContentProps<unknown>> {
  @observable private popupAnchor?: HTMLSpanElement;

  constructor(props: XTableCellContentProps<unknown>) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { col, cellData, ...props } = this.props;
    let value: DocumentInfo[] = [];

    try {
      if (typeof cellData === 'string') {
        value = JSON.parse(String(cellData)) as DocumentInfo[];
      }
    } catch {
      // do nothing
    }

    if (!col.field) {
      console.error('xTable: не указан field у колонки с типом document');

      return null;
    }

    const documents = (
      <Documents
        property={{ name: col.field, propertyType: PropertyType.DOCUMENT, title: String(col.title) }}
        value={value}
      />
    );

    return (
      <XTableCellContentBase col={col} {...props}>
        {!!cellData &&
          !!value.length &&
          (value.length === 1 ? (
            documents
          ) : (
            <>
              <PseudoLink onClick={this.handleClick}>
                {value.length} {pluralize(value.length, 'документ', 'документа', 'документов')}
              </PseudoLink>
              <Popover open={!!this.popupAnchor} onClose={this.handleClose} anchorEl={this.popupAnchor}>
                {documents}
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

export const withTypeDocument = withBemMod<XTableCellContentProps<unknown>, XTableCellContentProps<unknown>>(
  cnXTableCellContent(),
  { type: PropertyType.DOCUMENT },
  () => XTableCellContentTypeDocument
);
