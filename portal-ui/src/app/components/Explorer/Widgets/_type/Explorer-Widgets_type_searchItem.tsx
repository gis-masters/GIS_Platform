import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';
import { isEqual } from 'lodash';

import { SearchItemData } from '../../../../services/data/search/search.model';
import { communicationService } from '../../../../services/communication.service';
import { ViewContentWidget } from '../../../ViewContentWidget/ViewContentWidget';
import { applyContentType } from '../../../../services/data/schema/schema.utils';
import { ExplorerInfoDescItem } from '../../InfoDescItem/Explorer-InfoDescItem';
import { schemaService } from '../../../../services/data/schema/schema.service';
import { Schema } from '../../../../services/data/schema/schema.models';

import { ExplorerItemType, ExplorerItemData } from '../../Explorer.models';
import { cnExplorerWidgets, ExplorerWidgetsProps } from '../Explorer-Widgets.base';

@observer
class ExplorerWidgetsTypeSearchItem extends Component<ExplorerWidgetsProps> {
  @observable private schema?: Schema;
  private operationId?: symbol;

  constructor(props: ExplorerWidgetsProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount() {
    await this.fetchData();
  }

  async componentDidUpdate(prevProps: ExplorerWidgetsProps) {
    if (!isEqual(this.props.item, prevProps.item)) {
      await this.fetchData();
    }
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
              data={(item as ExplorerItemData<SearchItemData>).payload.payload}
              title='Карточка документа'
            />
          </ExplorerInfoDescItem>
        )}
      </div>
    );
  }

  private async fetchData() {
    const { item } = this.props;
    const { payload } = item as ExplorerItemData<SearchItemData>;
    const operationId = Symbol();

    this.operationId = operationId;
    if (payload.type === 'DOCUMENT') {
      let schema = await schemaService.getSchema(payload.source.schema);

      if (this.operationId === operationId) {
        if (payload.payload.content_type_id) {
          schema = applyContentType(schema, payload.payload.content_type_id);
        }

        this.setSchema(schema);
      }
    }
  }

  @action
  private setSchema(schema: Schema) {
    this.schema = schema;
  }
}

export const withTypeSearchItem = withBemMod<ExplorerWidgetsProps, ExplorerWidgetsProps>(
  cnExplorerWidgets(),
  { type: ExplorerItemType.SEARCH_ITEM },
  () => ExplorerWidgetsTypeSearchItem
);
