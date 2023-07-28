import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { isEqual } from 'lodash';
import { observable, action, makeObservable } from 'mobx';

import { VectorTable, vectorTableSchema } from '../../services/data/vectorData/vectorData.models';
import { getVectorTableBreadcrumbs } from '../DataManagement/DataManagement.utils';
import { Breadcrumbs, BreadcrumbsItemData } from '../Breadcrumbs/Breadcrumbs';
import { ViewContentWidget } from '../ViewContentWidget/ViewContentWidget';
import { formatDate } from '../../services/util/date.util';

import '!style-loader!css-loader!sass-loader!./VectorTableCard.scss';

const cnVectorTableCard = cn('VectorTableCard');

interface VectorTableCardProps {
  vectorTable?: VectorTable;
}

@observer
export class VectorTableCard extends Component<VectorTableCardProps> {
  @observable private breadcrumbsItems: BreadcrumbsItemData[] = [];

  constructor(props: VectorTableCardProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount() {
    if (this.props.vectorTable) {
      await this.getBreadcrumbsItems();
    }
  }

  async componentDidUpdate(prevProps: VectorTableCardProps) {
    const { vectorTable } = this.props;
    if (!isEqual(prevProps.vectorTable, vectorTable)) {
      await this.getBreadcrumbsItems();
    }
  }

  render() {
    const { vectorTable } = this.props;

    return (
      <div className={cnVectorTableCard()}>
        {vectorTable && (
          <>
            <Breadcrumbs className={cnVectorTableCard('Breadcrumbs')} itemsType='link' items={this.breadcrumbsItems} />
            <div className={cnVectorTableCard('Date')}>
              <span className={cnVectorTableCard('DateTitle')}>Дата создания:</span>
              {formatDate(vectorTable.createdAt, 'LL')}
            </div>

            <div className={cnVectorTableCard('Card')}>
              {vectorTable && (
                <ViewContentWidget schema={vectorTableSchema} data={vectorTable} title='Свойства источника данных' />
              )}
            </div>
          </>
        )}
      </div>
    );
  }

  private async getBreadcrumbsItems() {
    this.setBreadcrumbsItems(await getVectorTableBreadcrumbs(this.props.vectorTable));
  }

  @action.bound
  private setBreadcrumbsItems(breadcrumbsItems: BreadcrumbsItemData[]) {
    this.breadcrumbsItems = breadcrumbsItems;
  }
}
