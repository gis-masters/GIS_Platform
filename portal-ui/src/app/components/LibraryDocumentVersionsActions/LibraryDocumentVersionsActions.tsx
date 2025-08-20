import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';

import { LibraryRecord, LibraryRecordRaw } from '../../services/data/library/library.models';
import { getLibraryRecord } from '../../services/data/library/library.service';
import { Role } from '../../services/permissions/permissions.models';
import { currentUser } from '../../stores/CurrentUser.store';
import { Actions } from '../Actions/Actions.composed';
import { ActionsItemVariant } from '../Actions/Item/Actions-Item.base';
import { LibraryDocumentVersionsActionsRestore } from './Restore/LibraryDocumentVersionsActions-Restore';

export const cnLibraryDocumentVersionsActions = cn('LibraryDocumentVersionsActions');

export interface LibraryDocumentVersionsActionsProps extends IClassNameProps {
  document: LibraryRecord;
  documentVersion: LibraryRecordRaw;
  as: ActionsItemVariant;
  forDialog?: boolean;
}

@observer
export class LibraryDocumentVersionsActions extends Component<LibraryDocumentVersionsActionsProps> {
  @observable private canEdit = false;

  constructor(props: LibraryDocumentVersionsActionsProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount(): Promise<void> {
    await this.checkUserRole();
  }

  render() {
    const { as, document, className, documentVersion, forDialog } = this.props;

    return (
      <Actions className={cnLibraryDocumentVersionsActions({ forDialog }, [className])} as={as}>
        {this.canEdit && (
          <LibraryDocumentVersionsActionsRestore document={document} documentVersion={documentVersion} as={as} />
        )}
      </Actions>
    );
  }

  async checkUserRole(): Promise<void> {
    const record = await getLibraryRecord(this.props.document.libraryTableName, this.props.document.id);
    this.setCanEdit((record.role && [Role.CONTRIBUTOR, Role.OWNER].includes(record.role)) || currentUser.isAdmin);
  }

  @action
  setCanEdit(canEdit: boolean): void {
    this.canEdit = canEdit;
  }
}
