import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { HomeOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';
import { isEqual } from 'lodash';

import { Schema } from '../../services/data/schema/schema.models';
import { Dataset, VectorTable } from '../../services/data/vectorData/vectorData.models';
import { getDataset } from '../../services/data/vectorData/vectorData.service';
import { WfsFeature } from '../../services/geoserver/wfs/wfs.models';
import { Breadcrumbs, BreadcrumbsItemData } from '../Breadcrumbs/Breadcrumbs';
import { datasetRootUrlItems } from '../DataManagement/DataManagement.utils';
import { ViewContentWidget } from '../ViewContentWidget/ViewContentWidget';

import '!style-loader!css-loader!sass-loader!./FeatureView.scss';

const cnFeatureView = cn('FeatureView');

export interface FeatureProps extends IClassNameProps {
  feature: WfsFeature;
  schema: Schema;
  vectorTable: VectorTable;
}

@observer
export class FeatureView extends Component<FeatureProps> {
  @observable private dataset?: Dataset;
  @observable private breadcrumbsItems: BreadcrumbsItemData[] = [];

  constructor(props: FeatureProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount() {
    if (this.props.feature) {
      await this.getDatasetForBreadcrumbs();
      this.setBreadcrumbsItems();
    }
  }

  componentDidUpdate(prevProps: FeatureProps) {
    const { feature } = this.props;
    if (!isEqual(prevProps.feature, feature)) {
      this.setBreadcrumbsItems();
    }
  }

  render() {
    const { feature, className, schema } = this.props;

    return (
      <div className={cnFeatureView(null, [className])}>
        <Breadcrumbs className={cnFeatureView('Breadcrumbs')} itemsType='link' items={this.breadcrumbsItems} />

        <div className={cnFeatureView('FeatureCard')}>
          {schema && <ViewContentWidget schema={schema} data={feature.properties} title='Карточка объекта' />}
        </div>
      </div>
    );
  }

  private async getDatasetForBreadcrumbs(): Promise<void> {
    const { vectorTable } = this.props;
    const dataset = await getDataset(vectorTable.dataset);
    this.setDataset(dataset);
  }

  @action
  private setDataset(dataset: Dataset) {
    this.dataset = dataset;
  }

  @action
  private setBreadcrumbsItems() {
    const { vectorTable } = this.props;

    if (!this.dataset) {
      throw new Error('Набор данных не получен');
    }

    const { title: tableTitle, identifier: tableIdentifier } = vectorTable;
    const { title: datasetTitle, identifier: datasetIdentifier } = this.dataset;

    const datasetRootPath = JSON.stringify([...datasetRootUrlItems, 'none', 'none']);
    const datasetPath = JSON.stringify([...datasetRootUrlItems, 'dataset', datasetIdentifier, 'none', 'none']);
    const vectorTablePath = JSON.stringify([
      ...datasetRootUrlItems,
      'dataset',
      datasetIdentifier,
      'table',
      tableIdentifier
    ]);

    this.breadcrumbsItems = [
      { title: <HomeOutlined />, url: '/data-management' },
      {
        title: 'Наборы данных',
        url: `/data-management?path_dm=${datasetRootPath}`
      },
      {
        title: datasetTitle,
        url: `/data-management?path_dm=${datasetPath}`
      },
      {
        title: tableTitle,
        url: `/data-management?path_dm=${vectorTablePath}`
      }
    ];
  }
}
