import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';

import { Schema } from '../../../../services/data/schema/schema.models';
import { applyContentType } from '../../../../services/data/schema/schema.utils';
import { getTaskSchema } from '../../../../services/data/task/task.service';
import { ViewContentWidget } from '../../../ViewContentWidget/ViewContentWidget';
import { assertExplorerItemDataTypeTaskHistory } from '../../Adapter/_type/Explorer-Adapter_type_taskHistory';
import { ExplorerItemType } from '../../Explorer.models';
import { ExplorerInfoDescItem } from '../../InfoDescItem/Explorer-InfoDescItem';
import { cnExplorerWidgets, ExplorerWidgetsProps } from '../Explorer-Widgets.base';

@observer
class ExplorerWidgetsTypeTaskHistory extends Component<ExplorerWidgetsProps> {
  @observable private schema?: Schema;

  constructor(props: ExplorerWidgetsProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount() {
    this.setSchema(await getTaskSchema());
  }

  render() {
    const { className, item } = this.props;

    assertExplorerItemDataTypeTaskHistory(item);

    return (
      <div className={cnExplorerWidgets(null, [className])}>
        <ExplorerInfoDescItem multiline>
          {this.schema && (
            <ViewContentWidget schema={this.schema} data={item.payload.massage} title='Свойства задачи' />
          )}
        </ExplorerInfoDescItem>
      </div>
    );
  }

  @action
  private setSchema(schema: Schema) {
    const { item } = this.props;

    assertExplorerItemDataTypeTaskHistory(item);

    this.schema = applyContentType(schema, item.payload.massage.content_type_id);
  }
}

export const withTypeTaskHistory = withBemMod<ExplorerWidgetsProps, ExplorerWidgetsProps>(
  cnExplorerWidgets(),
  { type: ExplorerItemType.TASK_HISTORY },
  () => ExplorerWidgetsTypeTaskHistory
);
