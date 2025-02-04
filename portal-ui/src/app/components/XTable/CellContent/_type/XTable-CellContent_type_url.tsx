import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Popover } from '@mui/material';
import { withBemMod } from '@bem-react/core';
import { pluralize } from 'numeralize-ru';

import { PropertyType } from '../../../../services/data/schema/schema.models';
import { UrlInfo } from '../../../Form/Control/_type/Form-Control_type_url';
import { PseudoLink } from '../../../PseudoLink/PseudoLink';
import { UrlsList } from '../../../UrlsList/UrlsList';
import { cnXTableCellContent, XTableCellContentBase, XTableCellContentProps } from '../XTable-CellContent.base';

@observer
class XTableCellContentTypeUrl extends Component<XTableCellContentProps<unknown>> {
  @observable private popupAnchor?: HTMLSpanElement;

  constructor(props: XTableCellContentProps<unknown>) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { col, cellData, ...props } = this.props;
    let value: UrlInfo[] = [];

    try {
      if (typeof cellData === 'string') {
        const parsed = JSON.parse(String(cellData)) as UrlInfo | UrlInfo[];
        value = Array.isArray(parsed) ? parsed : [parsed];
      }
    } catch {
      // do nothing
    }

    if (!col.field) {
      console.error('xTable: не указан field у колонки с типом url');

      return null;
    }

    const links = (
      <UrlsList
        property={{
          name: col.field,
          propertyType: PropertyType.URL,
          title: String(col.title),
          multiple: true,
          openIn: col.settings?.openIn
        }}
        value={String(cellData)}
      />
    );

    return (
      <XTableCellContentBase col={col} {...props}>
        {!!cellData &&
          !!value.length &&
          (value.length === 1 ? (
            links
          ) : (
            <>
              <PseudoLink onClick={this.handleClick}>
                {value.length} {pluralize(value.length, 'ссылка', 'ссылки', 'ссылок')}
              </PseudoLink>
              <Popover open={Boolean(this.popupAnchor)} onClose={this.handleClose} anchorEl={this.popupAnchor}>
                {links}
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

export const withTypeUrl = withBemMod<XTableCellContentProps<unknown>, XTableCellContentProps<unknown>>(
  cnXTableCellContent(),
  { type: PropertyType.URL },
  () => XTableCellContentTypeUrl
);
