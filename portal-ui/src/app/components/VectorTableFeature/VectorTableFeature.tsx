import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { HomeOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { isEqual } from 'lodash';

import { Schema } from '../../services/data/schema/schema.models';
import { schemaService } from '../../services/data/schema/schema.service';
import { SearchSourceForFeature } from '../../services/data/search/search.model';
import { WfsFeature } from '../../services/geoserver/wfs/wfs.models';
import { formatDate } from '../../services/util/date.util';
import { Breadcrumbs, BreadcrumbsItemData } from '../Breadcrumbs/Breadcrumbs';
import { datasetRootUrlItems } from '../DataManagement/DataManagement.utils';
import { ViewContentWidget } from '../ViewContentWidget/ViewContentWidget';

import '!style-loader!css-loader!sass-loader!./VectorTableFeature.scss';

const cnVectorTableFeature = cn('VectorTableFeature');

export interface VectorTableFeatureProps {
  feature: WfsFeature;
  source?: SearchSourceForFeature;
}

@observer
export class VectorTableFeature extends Component<VectorTableFeatureProps> {
  @observable private breadcrumbsItems: BreadcrumbsItemData[] = [];
  @observable private schema: Schema | undefined;

  constructor(props: VectorTableFeatureProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount() {
    await this.fetchSchema();

    if (this.props.feature) {
      this.getBreadcrumbsItems();
    }
  }

  componentDidUpdate(prevProps: VectorTableFeatureProps) {
    const { feature } = this.props;
    if (!isEqual(prevProps.feature, feature)) {
      this.getBreadcrumbsItems();
    }
  }

  render() {
    const { feature } = this.props;

    return (
      <div className={cnVectorTableFeature()}>
        <Breadcrumbs className={cnVectorTableFeature('Breadcrumbs')} itemsType='link' items={this.breadcrumbsItems} />

        <div className={cnVectorTableFeature('Date')}>
          <span className={cnVectorTableFeature('DateTitle')}>Дата создания:</span>
          {formatDate(String(feature.properties.created_at), 'LL')}
        </div>

        <div className={cnVectorTableFeature('FeatureCard')}>
          {this.schema && <ViewContentWidget schema={this.schema} data={feature.properties} title='Карточка объекта' />}
        </div>
      </div>
    );
  }

  private async fetchSchema(): Promise<void> {
    if (this.props.source?.schema) {
      const schema = await schemaService.getSchema(this.props.source.schema);

      this.setSchema(schema);
    }
  }

  @action.bound
  private setSchema(schema: Schema) {
    this.schema = schema;
  }

  @action.bound
  private getBreadcrumbsItems() {
    if (this.props.source) {
      const { dataset, table, datasetTitle, tableTitle } = this.props.source;
      const datasetRootPath = JSON.stringify([...datasetRootUrlItems, 'none', 'none']);
      const datasetPath = JSON.stringify([...datasetRootUrlItems, 'dataset', dataset, 'none', 'none']);
      const vectorTablePath = JSON.stringify([...datasetRootUrlItems, 'dataset', dataset, 'table', table]);

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
}
