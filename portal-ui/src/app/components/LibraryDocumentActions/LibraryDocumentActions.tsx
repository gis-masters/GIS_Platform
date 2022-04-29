import React, { Component, ComponentType } from 'react';
import { action, computed, observable } from 'mobx';
import { observer } from 'mobx-react';
import { IClassNameProps } from '@bem-react/core';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';
import { isEqual } from 'lodash';

import { currentUser } from '../../stores/CurrentUser.store';
import { getLibraryRecord, LibraryRecord } from '../../services/crg/doc-library.service';
import { organizationSettings } from '../../stores/OrganizationSettings.store';
import { PropertyType, Schema } from '../../services/crg/schema.models';
import { applyContentType } from '../../services/crg/schema.utils';
import { schemaService } from '../../services/crg/schema.service';
import { Role } from '../../services/crg/permissions.models';
import { FileInfo } from '../../services/files.service';
import { isTifFile } from '../../services/files.util';

import { ActionsItemVariant } from './Item/LibraryDocumentActions-Item';
import { LibraryDocumentActionsSed } from './Sed/LibraryDocumentActions-Sed';
import { LibraryDocumentActionsSave } from './Save/LibraryDocumentActions-Save';
import { LibraryDocumentActionsOpen } from './Open/LibraryDocumentActions-Open';
import { LibraryDocumentActionsEdit } from './Edit/LibraryDocumentActions-Edit';
import { LibraryDocumentActionsShare } from './Share/LibraryDocumentActions-Share';
import { LibraryDocumentActionsClose } from './Close/LibraryDocumentActions-Close';
import { LibraryDocumentActionsDelete } from './Delete/LibraryDocumentActions-Delete';
import { LibraryDocumentActionsDownload } from './Download/LibraryDocumentActions-Download';
import { LibraryDocumentActionsRegister } from './Register/LibraryDocumentActions-Register';
import { LibraryDocumentActionsCreateChild } from './CreateChild/LibraryDocumentActions-CreateChild';
import { LibraryDocumentActionsFilesPlacement } from './FilesPlacement/LibraryDocumentActions-FilesPlacement';

import '!style-loader!css-loader!sass-loader!./LibraryDocumentActions.scss';

export const cnLibraryDocumentActions = cn('LibraryDocumentActions');

export interface LibraryDocumentActionsProps extends IClassNameProps {
  document: LibraryRecord;
  as: ActionsItemVariant;
  hideOpen?: boolean;
  forDialog?: boolean;
  ContainerComponent?: ComponentType;
  onDialogClose?(): void;
  onSave?(created: LibraryRecord): void;
}

@observer
export class LibraryDocumentActions extends Component<LibraryDocumentActionsProps> {
  @observable private document: LibraryRecord;
  @observable private schema: Schema<LibraryRecord>;
  private operationId: symbol;

  async componentDidMount() {
    await this.init();
  }

  async componentDidUpdate(prevProps: LibraryDocumentActionsProps) {
    if (!isEqual(this.props.document, prevProps.document)) {
      await this.init();
    }
  }

  render() {
    const {
      as,
      ContainerComponent = 'div',
      document,
      className,
      hideOpen,
      forDialog,
      onDialogClose,
      onSave
    } = this.props;
    const canEdit = [Role.CONTRIBUTOR, Role.OWNER].includes(this.document?.role) || currentUser.isAdmin;
    const canCreateChildren = Boolean(this.schema?.children?.length);
    const canDownload = this.schema?.properties.some(({ propertyType }) => propertyType === PropertyType.BINARY);
    const canDelete =
      organizationSettings.fileDownloadEnabled && (this.document?.role === Role.OWNER || currentUser.isAdmin);
    const isNew = !document.id;

    return (
      <ContainerComponent className={cnLibraryDocumentActions({ forDialog }, [className])}>
        {isNew && <LibraryDocumentActionsSave onSave={onSave} document={this.document || document} as={as} />}

        {!hideOpen && <LibraryDocumentActionsOpen document={this.document || document} as={as} />}

        {!isNew && canEdit && (
          <LibraryDocumentActionsEdit document={this.document || document} schema={this.schema} as={as} />
        )}

        {canCreateChildren && (
          <LibraryDocumentActionsCreateChild document={this.document || document} schema={this.schema} as={as} />
        )}

        {this.canBePlaced && (
          <LibraryDocumentActionsFilesPlacement document={this.document || document} schema={this.schema} as={as} />
        )}

        {!isNew && <LibraryDocumentActionsShare document={this.document || document} as={as} />}

        {!isNew && this.canBeRegistered() && (
          <LibraryDocumentActionsRegister document={this.document || document} as={as} />
        )}

        {!isNew && canDownload && <LibraryDocumentActionsDownload document={this.document || document} as={as} />}

        <LibraryDocumentActionsSed document={this.document || document} as={as} />

        {!isNew && canDelete && (
          <LibraryDocumentActionsDelete document={this.document || document} as={as} onDelete={onDialogClose} />
        )}

        {forDialog && <LibraryDocumentActionsClose onClick={onDialogClose} as={as} />}
      </ContainerComponent>
    );
  }

  private async init() {
    const operationId = Symbol();
    this.operationId = operationId;
    let { document } = this.props;

    document = document.role ? document : await getLibraryRecord(document.libraryId, document.id);

    const schema = applyContentType(await schemaService.getSchema(document.schemaId), document.content_type_id);

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
    const { gisogd_regnum, role } = this.props.document;

    // eslint-disable-next-line camelcase
    return !gisogd_regnum && (role === Role.CONTRIBUTOR || role === Role.OWNER || currentUser.isAdmin);
  }

  @action
  private setData(document: LibraryRecord, schema: Schema) {
    this.document = document;
    this.schema = schema;
  }
}
