import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { type Schema } from '../../services/data/schema/schema.models';
import { applyView } from '../../services/data/schema/schema.utils';
import { type WfsFeature } from '../../services/geoserver/wfs/wfs.models';
import { type CrgLayer } from '../../services/gis/layers/layers.models';
import { getLayerSchema } from '../../services/gis/layers/layers.service';
import { featurePrintTemplates } from '../../services/report/report.service';
import { featureExtract } from '../../services/report/templates/feature/featureExtract';
import { type PrintTemplate } from '../../services/report/templates/PrintTemplate';
import { PrintAction } from '../PrintAction/PrintAction';

const cnPrintFeature = cn('PrintFeature');

interface PrintFeatureProps {
  feature: WfsFeature;
  layer?: CrgLayer;
}

@observer
export class PrintFeature extends Component<PrintFeatureProps> {
  @observable private schemaWithAppliedView?: Schema;

  constructor(props: PrintFeatureProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount() {
    await this.loadSchema();
  }

  render() {
    const { feature } = this.props;
    const names = this.schemaWithAppliedView?.printTemplates || [];
    const templates: PrintTemplate<WfsFeature>[] = [
      ...featurePrintTemplates.filter(template => names.includes(template.name)),
      featureExtract
    ];

    return (
      templates.length > 0 && (
        <PrintAction<WfsFeature> className={cnPrintFeature()} as='iconButton' entity={feature} templates={templates} />
      )
    );
  }

  private async loadSchema(): Promise<void> {
    const { layer } = this.props;
    if (!layer) {
      // нет слоя — нет мультиков
      return;
    }
    const schema = await getLayerSchema(layer);
    if (!schema) {
      return;
    }
    this.setSchemaWithAppliedView(applyView(schema, layer.view));
  }

  @action
  private setSchemaWithAppliedView(schema: Schema) {
    this.schemaWithAppliedView = schema;
  }
}
