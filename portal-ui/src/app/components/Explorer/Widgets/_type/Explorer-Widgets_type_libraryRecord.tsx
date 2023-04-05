import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';

import { getDocumentLibraryRecordRoleAssignmentUrl } from '../../../../services/api/server-urls.service';
import { getLibraryRecord } from '../../../../services/data/docLibrary/docLibrary.service';
import { LibraryRecord } from '../../../../services/data/docLibrary/docLibrary.models';
import { communicationService, DataChangeEventDetail } from '../../../../services/communication.service';
import { ViewContentWidget } from '../../../ViewContentWidget/ViewContentWidget';
import { PermissionsWidget } from '../../../PermissionsWidget/PermissionsWidget';
import { applyContentType } from '../../../../services/data/schema/schema.utils';
import { schemaService } from '../../../../services/data/schema/schema.service';
import { Role } from '../../../../services/data/permissions/permissions.models';
import { currentUser } from '../../../../stores/CurrentUser.store';
import { Schema } from '../../../../services/data/schema/schema.models';

import { ExplorerItemData, ExplorerItemEntityTypeTitle, ExplorerItemType } from '../../Explorer.models';
import { cnExplorerWidgets, ExplorerWidgetsProps } from '../Explorer-Widgets.base';
import { ExplorerInfoDescItem } from '../../InfoDescItem/Explorer-InfoDescItem';
import { getId } from '../../Adapter/Explorer-Adapter';

@observer
export class ExplorerWidgetsTypeLibraryRecord extends Component<ExplorerWidgetsProps> {
  @observable private url?: string;
  @observable private schema?: Schema;
  @observable private currentRecord?: LibraryRecord;
  private operationId: symbol;

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
    const { className, type } = this.props;

    return (
      <div className={cnExplorerWidgets(null, [className])}>
        {this.currentRecord && (
          <>
            <ExplorerInfoDescItem multiline>
              <ViewContentWidget schema={this.schema} data={this.currentRecord} title='Карточка документа' />
            </ExplorerInfoDescItem>

            <PermissionsWidget
              url={this.url}
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
    const { payload } = item as ExplorerItemData<LibraryRecord>;
    const operationId = Symbol();
    this.operationId = operationId;

    const url = await getDocumentLibraryRecordRoleAssignmentUrl(payload.libraryTableName, payload.id);
    const schema = await schemaService.getSchema(payload.schemaId);
    const record = await getLibraryRecord(payload.libraryTableName, payload.id);

    if (this.operationId === operationId) {
      this.setUrl(url);
      this.setSchema(applyContentType(schema, payload.content_type_id));
      this.setCurrentRecord(record);
    }
  }

  @action
  private setUrl(url: string) {
    this.url = url;
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
