import React, { Component } from 'react';
import { cn } from '@bem-react/classname';
import { observer } from 'mobx-react';
import { action, makeObservable, observable } from 'mobx';
import { IClassNameProps } from '@bem-react/core';
import { isEqual } from 'lodash';

import { isRecordUpdateAllowed } from '../../services/data/permissions/permissions.service';
import { getVectorTable } from '../../services/data/vectorData/vectorData.service';
import { VectorTable } from '../../services/data/vectorData/vectorData.models';
import { getLibraryRecord } from '../../services/data/library/library.service';
import { LibraryRecord } from '../../services/data/library/library.models';
import { SearchItemData } from '../../services/data/search/search.model';
import { extractFeatureId } from '../../services/geoserver/feature.util';

import { LibrarySearchItemActionsConnections } from './Connections/LibrarySearchItemActions-Connections';
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
  @observable private libraryRecord: LibraryRecord | undefined;
  @observable private vectorTable: VectorTable | undefined;

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
    const { as, className, item } = this.props;

    return (
      <Actions className={cnLibrarySearchItemActions({}, [className])} as={as}>
        {this.canEdit && (
          <>
            <LibrarySearchItemActionsOpen item={item} libraryRecord={this.libraryRecord} as={as} />

            {item.type === 'FEATURE' && this.vectorTable && (
              <LibrarySearchItemActionsConnections
                featureId={String(extractFeatureId(item.payload.id))}
                vectorTable={this.vectorTable}
                as={as}
              />
            )}
          </>
        )}
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
        this.setLibraryRecord(record);
        this.setCanEdit(await isRecordUpdateAllowed(record));
      }
    }

    if (item.type === 'FEATURE') {
      const table = await getVectorTable(item.source.dataset, item.source.table);

      if (this.operationId === operationId) {
        this.setVectorTable(table);
        this.setCanEdit(true);
      }
    }
  }

  @action
  setCanEdit(canEdit: boolean): void {
    this.canEdit = canEdit;
  }

  @action
  setLibraryRecord(libraryRecord: LibraryRecord | undefined): void {
    this.libraryRecord = libraryRecord;
  }

  @action
  setVectorTable(vectorTable: VectorTable | undefined): void {
    this.vectorTable = vectorTable;
  }
}
