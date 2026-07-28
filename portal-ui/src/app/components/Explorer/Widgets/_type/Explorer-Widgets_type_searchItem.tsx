import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';
import { isEqual } from 'lodash';

import { communicationService } from '../../../../services/communication.service';
import { getLibrary } from '../../../../services/data/library/library.service';
import { type Schema } from '../../../../services/data/schema/schema.models';
import { applyContentType } from '../../../../services/data/schema/utils/applyContentType';
import { getVectorTable } from '../../../../services/data/vectorData/vectorData.service';
import { ConnectionsFeaturesToProjectsWidget } from '../../../ConnectionsFeaturesToProjectsWidget/ConnectionsFeaturesToProjectsWidget';
import { ViewContentWidget } from '../../../ViewContentWidget/ViewContentWidget';
import { assertExplorerItemDataTypeSearchItem } from '../../Adapter/_type/Explorer-Adapter_type_searchItem';
import { ExplorerItemType } from '../../Explorer.models';
import { ExplorerInfoDescItem } from '../../InfoDescItem/Explorer-InfoDescItem';
import { cnExplorerWidgets, type ExplorerWidgetsProps } from '../Explorer-Widgets.base';

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

    assertExplorerItemDataTypeSearchItem(item);

    const cardTitle = item.payload.type === 'DOCUMENT' ? 'документа' : 'объекта';

    return (
      <div className={cnExplorerWidgets(null, [className])}>
        {item.payload.type === 'FEATURE' && <ConnectionsFeaturesToProjectsWidget feature={item.payload} />}

        {this.schema && (
          <ExplorerInfoDescItem multiline>
            <ViewContentWidget
              schema={this.schema}
              data={item.payload.type === 'DOCUMENT' ? item.payload.payload : item.payload.payload.properties}
              title={`Карточка ${cardTitle}`}
            />
          </ExplorerInfoDescItem>
        )}
      </div>
    );
  }

  private async fetchData() {
    const { item } = this.props;

    assertExplorerItemDataTypeSearchItem(item);

    const operationId = Symbol();

    this.operationId = operationId;

    let schema: Schema;

    if (item.payload.type === 'FEATURE') {
      ({ schema } = await getVectorTable(item.payload.source.dataset, item.payload.source.table));
    } else if (item.payload.type === 'DOCUMENT') {
      ({ schema } = await getLibrary(item.payload.source.library));

      if (item.payload.payload.content_type_id) {
        schema = applyContentType(schema, item.payload.payload.content_type_id);
      }
    } else {
      return;
    }

    if (this.operationId === operationId) {
      this.setSchema(schema);
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
