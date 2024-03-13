import React, { Component } from 'react';
import { cn } from '@bem-react/classname';
import { observer } from 'mobx-react';
import { action, makeObservable, observable } from 'mobx';
import { IClassNameProps } from '@bem-react/core';

import { getLibraryRecord } from '../../services/data/library/library.service';
import { LibraryRecord } from '../../services/data/library/library.models';
import { Role } from '../../services/data/permissions/permissions.models';
import { currentUser } from '../../stores/CurrentUser.store';

import { LibraryDocumentActionsOpen } from '../LibraryDocumentActions/Open/LibraryDocumentActions-Open';
import { LibraryDeletedDocumentActionsRestore } from './Restore/LibraryDeletedDocumentActions-Restore';
import { ActionsItemVariant } from '../Actions/Item/Actions-Item.base';
import { Actions } from '../Actions/Actions.composed';
import { LibraryDocumentActionsClose } from '../LibraryDocumentActions/Close/LibraryDocumentActions-Close';

export const cnLibraryDocumentVersionsActions = cn('LibraryDocumentVersionsActions');

export interface LibraryDeletedDocumentActionsProps extends IClassNameProps {
  document: LibraryRecord;
  hideOpen?: boolean;
  forDialog?: boolean;
  onDialogClose?(): void;
  as: ActionsItemVariant;
}

@observer
export class LibraryDeletedDocumentActions extends Component<LibraryDeletedDocumentActionsProps> {
  @observable private canEdit = false;

  constructor(props: LibraryDeletedDocumentActionsProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount(): Promise<void> {
    await this.checkUserRole();
  }

  render() {
    const { as, document, hideOpen, forDialog, onDialogClose, className } = this.props;

    return (
      <Actions className={cnLibraryDocumentVersionsActions(null, [className])} as={as}>
        {!hideOpen && <LibraryDocumentActionsOpen deletedDocument document={document} as={as} />}
        {this.canEdit && <LibraryDeletedDocumentActionsRestore document={document} as={as} />}
        {forDialog && <LibraryDocumentActionsClose onClick={onDialogClose} as={as} />}
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
