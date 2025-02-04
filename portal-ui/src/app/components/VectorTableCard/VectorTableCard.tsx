import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { HomeOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { isEqual } from 'lodash';

import { VectorTable, vectorTableSchema } from '../../services/data/vectorData/vectorData.models';
import { getDataset } from '../../services/data/vectorData/vectorData.service';
import { formatDate } from '../../services/util/date.util';
import { Breadcrumbs, BreadcrumbsItemData } from '../Breadcrumbs/Breadcrumbs';
import { ViewContentWidget } from '../ViewContentWidget/ViewContentWidget';

import '!style-loader!css-loader!sass-loader!./VectorTableCard.scss';

const cnVectorTableCard = cn('VectorTableCard');

interface VectorTableCardProps {
  vectorTable?: VectorTable;
}

const datasetRootUrlItems = ['r', 'root', 'dr', 'datasetRoot'];

@observer
export class VectorTableCard extends Component<VectorTableCardProps> {
  @observable private breadcrumbsItems: BreadcrumbsItemData[] = [];

  constructor(props: VectorTableCardProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount() {
    if (this.props.vectorTable) {
      await this.loadBreadcrumbsItems();
    }
  }

  async componentDidUpdate(prevProps: VectorTableCardProps) {
    const { vectorTable } = this.props;
    if (!isEqual(prevProps.vectorTable, vectorTable)) {
      await this.loadBreadcrumbsItems();
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

  private async loadBreadcrumbsItems() {
    if (!this.props.vectorTable) {
      throw new Error('VectorTable не может быть пустым');
    }

    this.setBreadcrumbsItems(await this.getVectorTableBreadcrumbs(this.props.vectorTable));
  }

  @action.bound
  private setBreadcrumbsItems(breadcrumbsItems: BreadcrumbsItemData[]) {
    this.breadcrumbsItems = breadcrumbsItems;
  }

  private async getVectorTableBreadcrumbs(item: VectorTable): Promise<BreadcrumbsItemData[]> {
    const { dataset, identifier, title } = item;
    const datasetRootPath = JSON.stringify([...datasetRootUrlItems, 'none', 'none']);
    const datasetPath = JSON.stringify([...datasetRootUrlItems, 'dataset', dataset, 'none', 'none']);
    const datasetItem = await getDataset(dataset);
    const currentItem = ['table', identifier];
    const pathWithoutCurrent = JSON.stringify([...datasetRootUrlItems, 'dataset', dataset, ...currentItem]);

    return [
      { title: <HomeOutlined />, url: '/data-management' },
      {
        title: 'Наборы данных',
        url: `/data-management?path_dm=${datasetRootPath}`
      },
      {
        title: datasetItem.title,
        url: `/data-management?path_dm=${datasetPath}`
      },
      {
        title: <b>{title}</b>,
        url: `/data-management?path_dm=${pathWithoutCurrent}`
      }
    ];
  }
}
