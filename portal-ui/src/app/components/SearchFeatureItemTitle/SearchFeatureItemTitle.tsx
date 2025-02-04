import React, { Component } from 'react';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';

import { Schema } from '../../services/data/schema/schema.models';
import { schemaService } from '../../services/data/schema/schema.service';
import { changeSchemaNamesCaseByFeature } from '../../services/data/schema/schema.utils';
import { WfsFeature } from '../../services/geoserver/wfs/wfs.models';
import { getFeaturesListItemTitle } from '../FeaturesListItem/FeaturesListItem.util';

interface FeatureTitleProps {
  feature: WfsFeature;
  schemaId: string;
}

@observer
export class FeatureTitle extends Component<FeatureTitleProps> {
  @observable private schema?: Schema;

  private operationId?: symbol;

  constructor(props: FeatureTitleProps) {
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
    const { schemaId } = this.props;
    const operationId = Symbol();

    this.operationId = operationId;
    const schema = await schemaService.getSchema(schemaId);

    if (this.operationId === operationId) {
      this.setSchema(schema);
    }
  }

  @action
  private setSchema(schema: Schema) {
    this.schema = schema;
  }
}
