import React, { Component } from 'react';
import { cn } from '@bem-react/classname';
import { observer } from 'mobx-react';
import { action, makeObservable, observable } from 'mobx';
import { IClassNameProps } from '@bem-react/core';
import { isEqual } from 'lodash';

import { isRecordUpdateAllowed } from '../../services/data/permissions/permissions.service';
import { getLibraryRecord } from '../../services/data/library/library.service';
import { SearchItemData } from '../../services/data/search/search.model';
import { LibraryRecord } from '../../services/data/library/library.models';

import { LibrarySearchItemActionsOpen } from './Open/LibrarySearchItemActions-Open';
import { ActionsItemVariant } from '../Actions/Item/Actions-Item.base';
import { Actions } from '../Actions/Actions.composed';

export const cnLibrarySearchItemActions = cn('LibrarySearchItemActions');

export interface LibrarySearchItemActionsProps extends IClassNameProps {
  item: SearchItemData;
  as: ActionsItemVariant;
}

@observer
export class LibrarySearchItemActions extends Component<LibrarySearchItemActionsProps> {
  @observable private canEdit = true;
  @observable private document: LibraryRecord | undefined;
  private operationId?: symbol;

  constructor(props: LibrarySearchItemActionsProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount(): Promise<void> {
    await this.checkUserRole();
  }
  async componentDidUpdate(prevProps: LibrarySearchItemActionsProps) {
    if (!isEqual(this.props.item, prevProps.item)) {
      await this.checkUserRole();
    }
  }

  render() {
    const { as, className } = this.props;

    return (
      <Actions className={cnLibrarySearchItemActions({}, [className])} as={as}>
        {this.canEdit && this.document && <LibrarySearchItemActionsOpen document={this.document} as={as} />}
      </Actions>
    );
  }

  async checkUserRole(): Promise<void> {
    const operationId = Symbol();
    this.operationId = operationId;

    const { item } = this.props;
    if (item.type === 'DOCUMENT') {
      const document = item.payload;
      const record = await getLibraryRecord(item.source.library, document.id);

      if (this.operationId === operationId) {
        this.setDocument(record);
        this.setCanEdit(await isRecordUpdateAllowed(record));
      }
    }
  }

  @action
  setCanEdit(canEdit: boolean): void {
    this.canEdit = canEdit;
  }

  @action
  setDocument(document: LibraryRecord): void {
    this.document = document;
  }
}
