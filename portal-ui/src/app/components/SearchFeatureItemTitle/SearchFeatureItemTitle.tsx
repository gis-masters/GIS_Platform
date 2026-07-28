import React, { Component } from 'react';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';

import { type Schema } from '../../services/data/schema/schema.models';
import { changeSchemaNamesCaseByFeature } from '../../services/data/schema/utils/changeSchemaNamesCaseByFeature';
import { getVectorTable } from '../../services/data/vectorData/vectorData.service';
import { type WfsFeature } from '../../services/geoserver/wfs/wfs.models';
import { getFeaturesListItemTitle } from '../FeaturesListItem/FeaturesListItem.util';

interface SearchFeatureItemTitleProps {
  feature: WfsFeature;
  dataset: string;
  table: string;
}

@observer
export class SearchFeatureItemTitle extends Component<SearchFeatureItemTitleProps> {
  @observable private schema?: Schema;

  private operationId?: symbol;

  constructor(props: SearchFeatureItemTitleProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount() {
    await this.fetchData();
  }

  render() {
    return <>{this.title}</>;
  }

  @computed
  private get title(): string {
    if (this.schema) {
      const titleAndEmptiness = getFeaturesListItemTitle(
        this.props.feature,
        changeSchemaNamesCaseByFeature(this.schema, this.props.feature)
      );

      return titleAndEmptiness.title;
    }

    return '';
  }

  private async fetchData() {
    const { dataset, table } = this.props;
    const operationId = Symbol();

    this.operationId = operationId;
    const { schema } = await getVectorTable(dataset, table);

    if (this.operationId === operationId) {
      this.setSchema(schema);
    }
  }

  @action
  private setSchema(schema: Schema) {
    this.schema = schema;
  }
}
