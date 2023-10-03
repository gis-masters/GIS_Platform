import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';

import { DocumentVersionExtended } from '../../../../services/data/library/library.models';
import { communicationService } from '../../../../services/communication.service';
import { ViewContentWidget } from '../../../ViewContentWidget/ViewContentWidget';
import { applyContentType } from '../../../../services/data/schema/schema.utils';
import { ExplorerInfoDescItem } from '../../InfoDescItem/Explorer-InfoDescItem';
import { schemaService } from '../../../../services/data/schema/schema.service';
import { Schema } from '../../../../services/data/schema/schema.models';

import { cnExplorerWidgets, ExplorerWidgetsProps } from '../Explorer-Widgets.base';
import { ExplorerItemData, ExplorerItemType } from '../../Explorer.models';

@observer
class ExplorerWidgetsTypeDocumentVersion extends Component<ExplorerWidgetsProps> {
  @observable private schema?: Schema;
  private operationId: symbol;

  constructor(props: ExplorerWidgetsProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount() {
    await this.fetchData();

    communicationService.libraryRecordUpdated.on(async () => {
      await this.fetchData();
    }, this);
  }

  componentWillUnmount() {
    communicationService.off(this);
  }

  render() {
    const { className, item } = this.props;

    return (
      <div className={cnExplorerWidgets(null, [className])}>
        {this.schema && (
          <ExplorerInfoDescItem multiline>
            <ViewContentWidget
              schema={this.schema}
              data={(item.payload as DocumentVersionExtended).content}
              title='Карточка документа'
              formRole='viewVersion'
            />
          </ExplorerInfoDescItem>
        )}
      </div>
    );
  }

  private async fetchData() {
    const { item } = this.props;
    const { payload } = item as ExplorerItemData<DocumentVersionExtended>;
    const operationId = Symbol();

    this.operationId = operationId;
    const schema = await schemaService.getSchema(payload.document.schemaId);

    if (this.operationId === operationId) {
      this.setSchema(applyContentType(schema, payload.document.content_type_id));
    }
  }

  @action
  private setSchema(schema: Schema) {
    this.schema = schema;
  }
}

export const withTypeDocumentVersion = withBemMod<ExplorerWidgetsProps, ExplorerWidgetsProps>(
  cnExplorerWidgets(),
  { type: ExplorerItemType.DOCUMENT_VERSION },
  () => ExplorerWidgetsTypeDocumentVersion
);
