import React, { Component, ComponentType } from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { IClassNameProps } from '@bem-react/core';
import { cn } from '@bem-react/classname';
import { isEqual } from 'lodash';

import { currentUser } from '../../stores/CurrentUser.store';
import { convertSchema, getSchemaWithAppliedContentType } from '../../services/crg/schema.utils';
import { getLibraryRecord, LibraryRecord } from '../../services/crg/doc-library.service';
import { PropertySchema, PropertyType } from '../../services/crg/schema.models';
import { schemaService } from '../../services/crg/schema.service';
import { Role } from '../../services/crg/permissions.models';

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

import '!style-loader!css-loader!sass-loader!./LibraryDocumentActions.scss';

export const cnLibraryDocumentActions = cn('LibraryDocumentActions');

export interface LibraryDocumentActionsProps extends IClassNameProps {
  document: LibraryRecord;
  as: ActionsItemVariant;
  hideOpen?: boolean;
  forDialog?: boolean;
  onDialogClose?(): void;
  onSave?(created: LibraryRecord): void;
  ContainerComponent?: ComponentType;
}

@observer
export class LibraryDocumentActions extends Component<LibraryDocumentActionsProps> {
  @observable private document: LibraryRecord;
  @observable private fields: PropertySchema<LibraryRecord>[];
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
    const canDelete = this.document?.role === Role.OWNER || currentUser.isAdmin;
    const hasBinary = this.fields?.some(({ propertyType }) => propertyType === PropertyType.BINARY);
    const isNew = !document.id;

    return (
      <ContainerComponent className={cnLibraryDocumentActions({ forDialog }, [className])}>
        {isNew && <LibraryDocumentActionsSave onSave={onSave} document={this.document || document} as={as} />}
        {!hideOpen && <LibraryDocumentActionsOpen document={this.document || document} as={as} />}
        {!isNew && canEdit && (
          <LibraryDocumentActionsEdit document={this.document || document} fields={this.fields} as={as} />
        )}
        {!isNew && <LibraryDocumentActionsShare document={this.document || document} as={as} />}
        {!isNew && <LibraryDocumentActionsRegister document={this.document || document} as={as} />}
        {!isNew && hasBinary && <LibraryDocumentActionsDownload document={this.document || document} as={as} />}
        <LibraryDocumentActionsSed document={this.document || document} as={as} />
        {!isNew && canDelete && (
          <LibraryDocumentActionsDelete
            document={this.document || document}
            fields={this.fields}
            as={as}
            onDelete={onDialogClose}
          />
        )}
        {forDialog && <LibraryDocumentActionsClose onClick={onDialogClose} as={as} />}
      </ContainerComponent>
    );
  }

  private async init() {
    const operationId = Symbol();
    this.operationId = operationId;
    let { document } = this.props;

    document = document.role ? document : await getLibraryRecord(document.libraryId, document.id, document.schemaId);

    const oldSchema = getSchemaWithAppliedContentType(
      await schemaService.getSchema(document.schemaId),
      document.content_type_id
    );

    const fields = convertSchema(oldSchema.properties);

    if (this.operationId === operationId) {
      this.setData(document, fields);
    }
  }

  @action
  private setData(document: LibraryRecord, fields: PropertySchema[]) {
    this.document = document;
    this.fields = fields;
  }
}
