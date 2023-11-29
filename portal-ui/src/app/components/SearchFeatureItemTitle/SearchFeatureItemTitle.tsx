import React, { Component } from 'react';
import { observer } from 'mobx-react';

import { observable, action, makeObservable, computed } from 'mobx';

import { changeSchemaNamesCaseByFeature } from '../../services/data/schema/schema.utils';
import { getFeaturesListItemTitle } from '../FeaturesListItem/FeaturesListItem.util';
import { schemaService } from '../../services/data/schema/schema.service';
import { WfsFeature } from '../../services/geoserver/wfs/wfs.models';
import { Schema } from '../../services/data/schema/schema.models';

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
    return <>{this.titleAndEmptiness}</>;
  }

  @computed
  private get titleAndEmptiness(): string {
    if (this.schema) {
      return getFeaturesListItemTitle(
        this.props.feature,
        changeSchemaNamesCaseByFeature(this.schema, this.props.feature)
      ).title;
    }
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
