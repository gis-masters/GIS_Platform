import React, { Component } from 'react';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { isObject } from 'lodash';

import { communicationService, DataChangeEventDetail } from '../../../../services/communication.service';
import { libraryClient } from '../../../../services/data/library/library.client';
import { LibraryRecord } from '../../../../services/data/library/library.models';
import { getLibraryRecord, getLibrarySchemaByRecord } from '../../../../services/data/library/library.service';
import { Role } from '../../../../services/data/permissions/permissions.models';
import { Schema } from '../../../../services/data/schema/schema.models';
import { applyContentType } from '../../../../services/data/schema/schema.utils';
import { currentUser } from '../../../../stores/CurrentUser.store';
import { DocumentVersionsWidget } from '../../../DocumentVersionsWidget/DocumentVersionsWidget';
import { PermissionsWidget } from '../../../PermissionsWidget/PermissionsWidget';
import { ViewContentWidget } from '../../../ViewContentWidget/ViewContentWidget';
import { getId } from '../../Adapter/Explorer-Adapter';
import { ExplorerItemEntityTypeTitle, ExplorerItemType, itemTypeError } from '../../Explorer.models';
import { ExplorerInfoDescItem } from '../../InfoDescItem/Explorer-InfoDescItem';
import { cnExplorerWidgets, ExplorerWidgetsProps } from '../Explorer-Widgets.base';

@observer
export class ExplorerWidgetsTypeLibraryRecord extends Component<ExplorerWidgetsProps> {
  @observable private schema?: Schema;
  @observable private currentRecord?: LibraryRecord;
  private operationId?: symbol;

  constructor(props: ExplorerWidgetsProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount() {
    await this.fetchData();
  }

  async componentDidUpdate(prevProps: Readonly<ExplorerWidgetsProps>) {
    const { item } = this.props;
    if (getId(item) !== getId(prevProps.item)) {
      await this.fetchData();
    }

    communicationService.libraryRecordUpdated.on(async (e: CustomEvent<DataChangeEventDetail<LibraryRecord>>) => {
      const { type, data } = e.detail;
      if (getId({ type: ExplorerItemType.DOCUMENT, payload: data }) === getId(item) && type !== 'delete') {
        await this.fetchData();
      }
    }, this);
  }

  componentWillUnmount() {
    communicationService.off(this);
  }

  render() {
    const { className, type, item } = this.props;

    if (item.type !== ExplorerItemType.FOLDER && item.type !== ExplorerItemType.DOCUMENT) {
      throw itemTypeError;
    }

    return (
      <div className={cnExplorerWidgets(null, [className])}>
        {this.currentRecord && this.schema && (
          <>
            <ExplorerInfoDescItem multiline>
              <ViewContentWidget
                formRole='viewDocument'
                schema={this.schema}
                data={this.currentRecord}
                title='Карточка документа'
              />
            </ExplorerInfoDescItem>

            {this.isLibraryVersioned && type === ExplorerItemType.DOCUMENT && (
              <DocumentVersionsWidget document={item.payload} />
            )}

            <PermissionsWidget
              url={libraryClient.getDocumentLibraryRecordRoleAssignmentUrl(
                item.payload.libraryTableName,
                item.payload.id
              )}
              title={this.currentRecord.title}
              itemEntityType={
                type === ExplorerItemType.DOCUMENT
                  ? ExplorerItemEntityTypeTitle.DOCUMENT
                  : ExplorerItemEntityTypeTitle.FOLDER
              }
              disabled={!(currentUser.isAdmin || this.currentRecord.role === Role.OWNER)}
            />
          </>
        )}
      </div>
    );
  }

  private async fetchData() {
    const { item } = this.props;

    if (item.type !== ExplorerItemType.FOLDER && item.type !== ExplorerItemType.DOCUMENT) {
      throw itemTypeError;
    }

    const operationId = Symbol();
    this.operationId = operationId;

    const schema = await getLibrarySchemaByRecord(item.payload);
    const record = await getLibraryRecord(item.payload.libraryTableName, item.payload.id);

    if (this.operationId === operationId) {
      this.setSchema(applyContentType(schema, item.payload.content_type_id));
      this.setCurrentRecord(record);
    }
  }

  @computed
  private get isLibraryVersioned(): boolean {
    const lib = this.props.store.path.find(({ type }) => type === ExplorerItemType.LIBRARY)?.payload;

    return Boolean(lib) && isObject(lib) && 'versioned' in lib && Boolean(lib.versioned);
  }

  @action
  private setSchema(schema: Schema) {
    this.schema = schema;
  }

  @action
  private setCurrentRecord(record: LibraryRecord) {
    this.currentRecord = record;
  }
}
