import React, { Component } from 'react';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';
import { boundMethod } from 'autobind-decorator';
import { isEqual } from 'lodash';

import { FileInfo } from '../../services/data/files/files.models';
import { isTifFile } from '../../services/data/files/files.util';
import { LibraryRecord } from '../../services/data/library/library.models';
import { getLibraryRecord, getLibrarySchemaByRecord } from '../../services/data/library/library.service';
import { Role } from '../../services/data/permissions/permissions.models';
import { PropertyType, Schema } from '../../services/data/schema/schema.models';
import { applyContentType } from '../../services/data/schema/schema.utils';
import { currentUser } from '../../stores/CurrentUser.store';
import { organizationSettings } from '../../stores/OrganizationSettings.store';
import { Actions } from '../Actions/Actions.composed';
import { ActionsItemVariant } from '../Actions/Item/Actions-Item.base';
import { LibraryDocumentActionsClose } from './Close/LibraryDocumentActions-Close';
import { LibraryDocumentActionsCreateChild } from './CreateChild/LibraryDocumentActions-CreateChild';
import { LibraryDocumentActionsDelete } from './Delete/LibraryDocumentActions-Delete';
import { LibraryDocumentActionsDownload } from './Download/LibraryDocumentActions-Download';
import { LibraryDocumentActionsEdit } from './Edit/LibraryDocumentActions-Edit';
import { LibraryDocumentActionsFilesPlacement } from './FilesPlacement/LibraryDocumentActions-FilesPlacement';
import { LibraryDocumentActionsImportKpt } from './ImportKpt/LibraryDocumentActions-ImportKpt';
import { LibraryDocumentActionsMove } from './Move/LibraryDocumentActions-Move';
import { LibraryDocumentActionsOpen } from './Open/LibraryDocumentActions-Open';
import { LibraryDocumentActionsPrint } from './Print/LibraryDocumentActions-Print';
import { LibraryDocumentActionsRegister } from './Register/LibraryDocumentActions-Register';
import { LibraryDocumentActionsRelations } from './Relations/LibraryDocumentActions-Relations';
import { LibraryDocumentActionsSave } from './Save/LibraryDocumentActions-Save';
import { LibraryDocumentActionsSed } from './Sed/LibraryDocumentActions-Sed';
import { LibraryDocumentActionsShare } from './Share/LibraryDocumentActions-Share';

export const cnLibraryDocumentActions = cn('LibraryDocumentActions');

export interface LibraryDocumentActionsProps extends IClassNameProps {
  document: LibraryRecord;
  as: ActionsItemVariant;
  hideOpen?: boolean;
  forDialog?: boolean;
  onDialogClose?(): void;
  onSave?(created: LibraryRecord): void;
}

@observer
export default class LibraryDocumentActions extends Component<LibraryDocumentActionsProps> {
  @observable private document?: LibraryRecord;
  @observable private schema?: Schema;
  private operationId?: symbol;

  constructor(props: LibraryDocumentActionsProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount() {
    await this.init();
  }

  async componentDidUpdate(prevProps: LibraryDocumentActionsProps) {
    if (!isEqual(this.props.document, prevProps.document)) {
      await this.init();
    }
  }

  render() {
    const { as, document, className, hideOpen, forDialog, onDialogClose, onSave } = this.props;
    const canEdit =
      (this.document?.role && [Role.CONTRIBUTOR, Role.OWNER].includes(this.document.role)) || currentUser.isAdmin;
    const isFolder = this.schema?.contentTypes?.some(
      ({ id, type }) => this.document?.content_type_id === id && type === 'FOLDER'
    );
    const canCreateChildren = Boolean(this.schema?.children?.length) && !isFolder;
    const canDownload = this.schema?.properties.some(({ propertyType }) => propertyType === PropertyType.BINARY);
    const canDelete = organizationSettings.downloadFiles && (this.document?.role === Role.OWNER || currentUser.isAdmin);
    const isNew = !document.id;
    const canPrint = Boolean(this.schema?.printTemplates?.length);

    return (
      <Actions className={cnLibraryDocumentActions({ forDialog }, [className])} as={as}>
        {canEdit && <LibraryDocumentActionsImportKpt document={this.document || document} as={as} />}
        {isNew && <LibraryDocumentActionsSave onSave={onSave} document={this.document || document} as={as} />}
        {!hideOpen && <LibraryDocumentActionsOpen document={this.document || document} as={as} />}
        {!isNew && canEdit && (
          <LibraryDocumentActionsEdit document={this.document || document} schema={this.schema} as={as} />
        )}
        {canCreateChildren && (
          <LibraryDocumentActionsCreateChild document={this.document || document} schema={this.schema} as={as} />
        )}
        {canPrint && <LibraryDocumentActionsPrint document={this.document || document} schema={this.schema} as={as} />}
        {this.canBePlaced && (
          <LibraryDocumentActionsFilesPlacement document={this.document || document} schema={this.schema} as={as} />
        )}
        {!isNew && canEdit && !isFolder && (
          <LibraryDocumentActionsMove document={this.document || document} schema={this.schema} as={as} />
        )}
        {!isNew && <LibraryDocumentActionsShare document={this.document || document} as={as} />}
        {!isNew && this.canBeRegistered() && (
          <LibraryDocumentActionsRegister document={this.document || document} as={as} />
        )}
        {!isNew && canDownload && <LibraryDocumentActionsDownload document={this.document || document} as={as} />}
        {organizationSettings.SEDDialog && <LibraryDocumentActionsSed document={this.document || document} as={as} />}
        {!!this.schema?.relations?.length && this.schema.relations.length > 0 && (
          <LibraryDocumentActionsRelations document={this.document || document} schema={this.schema} as={as} />
        )}
        {!isNew && canDelete && (
          <LibraryDocumentActionsDelete
            document={this.document || document}
            schema={this.schema}
            as={as}
            onDelete={onDialogClose}
          />
        )}
        {forDialog && <LibraryDocumentActionsClose onClick={onDialogClose} as={as} />}
      </Actions>
    );
  }

  private async init() {
    const operationId = Symbol();
    this.operationId = operationId;
    let { document } = this.props;

    document = document.role ? document : await getLibraryRecord(document.libraryTableName, document.id);

    const schema = applyContentType(await getLibrarySchemaByRecord(document), document.content_type_id || '');

    if (this.operationId === operationId) {
      this.setData(document, schema);
    }
  }

  @computed
  private get canBePlaced(): boolean {
    const hasNativeCrs = this.schema?.properties?.some(({ name }) => name === 'native_crs');
    if (!hasNativeCrs) {
      return false;
    }

    const filesFields = this.schema?.properties?.filter(field => field.propertyType === PropertyType.FILE);
    if (!filesFields || filesFields.length <= 0) {
      return false;
    }

    return filesFields.some(field => {
      const files: FileInfo[] = this.props.document[field.name] as FileInfo[];

      return !!files?.filter(isTifFile)?.length;
    });
  }

  @boundMethod
  private canBeRegistered(): boolean {
    const { gisogd_regnum, role, is_folder } = this.document || this.props.document;

    // eslint-disable-next-line camelcase
    return !gisogd_regnum && !is_folder && (role === Role.CONTRIBUTOR || role === Role.OWNER || currentUser.isAdmin);
  }

  @action
  private setData(document: LibraryRecord, schema: Schema) {
    this.document = document;
    this.schema = schema;
  }
}
