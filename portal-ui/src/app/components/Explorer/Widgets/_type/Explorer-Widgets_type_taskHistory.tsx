import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';

import { ViewContentWidget } from '../../../ViewContentWidget/ViewContentWidget';
import { applyContentType } from '../../../../services/data/schema/schema.utils';
import { ExplorerInfoDescItem } from '../../InfoDescItem/Explorer-InfoDescItem';
import { getTaskSchema } from '../../../../services/data/task/task.service';
import { TaskHistory } from '../../../../services/data/task/task.models';
import { Schema } from '../../../../services/data/schema/schema.models';

import { cnExplorerWidgets, ExplorerWidgetsProps } from '../Explorer-Widgets.base';
import { ExplorerItemData, ExplorerItemType } from '../../Explorer.models';

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
    const { payload } = item as ExplorerItemData<TaskHistory>;

    return (
      <div className={cnExplorerWidgets(null, [className])}>
        <ExplorerInfoDescItem multiline>
          <ViewContentWidget schema={this.schema} data={payload.massage} title='Свойства задачи' />
        </ExplorerInfoDescItem>
      </div>
    );
  }

  @action
  private setSchema(schema: Schema) {
    const { item } = this.props;
    const { payload } = item as ExplorerItemData<TaskHistory>;

    this.schema = applyContentType(schema, payload.massage.content_type_id);
  }
}

export const withTypeTaskHistory = withBemMod<ExplorerWidgetsProps, ExplorerWidgetsProps>(
  cnExplorerWidgets(),
  { type: ExplorerItemType.TASK_HISTORY },
  () => ExplorerWidgetsTypeTaskHistory
);
