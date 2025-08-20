import React, { Component } from 'react';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { Schema } from '../../../services/data/schema/schema.models';
import { applyView } from '../../../services/data/schema/schema.utils';
import { extractFeatureId } from '../../../services/geoserver/featureType/featureType.util';
import { getFeatures } from '../../../services/geoserver/wfs/wfs.service';
import { CrgVectorLayer } from '../../../services/gis/layers/layers.models';
import { getLayerSchema } from '../../../services/gis/layers/layers.service';
import { selectedFeaturesStore } from '../../../services/map/a-map-mode/selected-features/SelectedFeatures.store';
import { PageOptions } from '../../../services/models';
import { calculateValues } from '../../../services/util/form/formValidation.utils';
import { currentProject } from '../../../stores/CurrentProject.store';
import { convertToComplexField } from '../../Form/Form.utils';
import { XTableInvoke } from '../../XTable/XTable';
import { XTableColumn } from '../../XTable/XTable.models';
import { getXTableColumnsFromSchema } from '../../XTable/XTable.utils';
import { AttributesTableRecord } from '../Attributes.models';
import { extractFeatureIdsFromAttributesFilter } from '../Attributes.utils';
import { AttributesBarActions } from '../BarActions/Attributes-BarActions';
import { AttributesBarClose } from '../BarClose/Attributes-BarClose';
import { AttributesBarHead } from '../BarHead/Attributes-BarHead';
import { AttributesBarHeadGap } from '../BarHeadGap/Attributes-BarHeadGap';
import { AttributesBarMinimize } from '../BarMinimize/Attributes-BarMinimize';
import { AttributesBarRightActions } from '../BarRightActions/Attributes-BarRightActions';
import { AttributesBarTitle } from '../BarTitle/Attributes-BarTitle';
import { AttributesCheckFilter } from '../CheckFilter/Attributes-CheckFilter';
import { AttributesCheckMaster } from '../CheckMaster/Attributes-CheckMaster';
import { AttributesCounter } from '../Counter/Attributes-Counter';
import { AttributesFiltersEnabler } from '../FiltersEnabler/Attributes-FiltersEnabler';
import { AttributesResize } from '../Resize/Attributes-Resize';
import { AttributesRowHead } from '../RowHead/Attributes-RowHead';
import { AttributesTable } from '../Table/Attributes-Table';

import '!style-loader!css-loader!sass-loader!./Attributes-Bar.scss';

const cnAttributesBar = cn('Attributes', 'Bar');
const cnAttributesCheckCell = cn('Attributes', 'CheckCell');

interface AttributesBarProps {
  layer: CrgVectorLayer;
  tableInvoke: XTableInvoke;
  onMinimize(): void;
  onClose(): void;
  onPageOptionsChange(pageOptions: PageOptions): void;
}

@observer
export class AttributesBar extends Component<AttributesBarProps> {
  @observable private pageOptions?: PageOptions;
  @observable private _schema?: Schema;
  @observable private featuresMatched = 0;
  @observable private featuresTotal = 0;
  @observable private height = this.getHeight();
  private fetchingSchemaOperationId?: symbol;

  constructor(props: AttributesBarProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount() {
    await this.fetchSchema();
  }

  async componentDidUpdate(prevProps: AttributesBarProps) {
    if (this.props.layer?.id !== prevProps.layer?.id) {
      await this.fetchSchema();
    }
  }

  render() {
    const { layer, tableInvoke, onMinimize, onClose } = this.props;

    return (
      <div className={cnAttributesBar()} style={{ height: this.height }}>
        <AttributesBarHead>
          <AttributesResize initialHeight={this.height} onResize={this.resize} />
          <AttributesBarTitle>{layer.title}</AttributesBarTitle>
          <AttributesCounter layer={layer} featuresMatched={this.featuresMatched} featuresTotal={this.featuresTotal} />
          <AttributesFiltersEnabler layer={layer} />
          <AttributesBarHeadGap />
          <AttributesBarActions
            layer={layer}
            cols={this.cols}
            pageOptions={this.pageOptions}
            featuresTotal={this.featuresTotal}
            getData={this.getData}
          />
          <AttributesBarRightActions>
            <AttributesBarMinimize onClick={onMinimize} />
            <AttributesBarClose onClick={onClose} />
          </AttributesBarRightActions>
        </AttributesBarHead>
        <AttributesTable
          layer={layer}
          cols={this.cols}
          schema={this.schema}
          invoke={tableInvoke}
          onPageOptionsChange={this.handlePageOptionsChange}
          getData={this.getData}
        />
      </div>
    );
  }

  @computed
  private get schema(): Schema | undefined {
    if (this._schema) {
      const currentLayer = currentProject.vectorLayers.find(item => item.id === this.props.layer.id);

      return applyView(this._schema, currentLayer?.view);
    }
  }

  @computed
  private get cols(): XTableColumn<AttributesTableRecord>[] {
    const { layer } = this.props;

    if (!this.schema) {
      return [];
    }

    return [
      {
        field: '_idCheck',
        title: (
          <AttributesCheckMaster
            layer={layer}
            featuresMatched={this.featuresMatched}
            pageOptions={this.pageOptions}
            definitionQuery={this.schema?.definitionQuery}
          />
        ),
        CustomFilterComponent: AttributesCheckFilter,
        filterable: !!selectedFeaturesStore.featuresByTableName[layer.tableName]?.length,
        CellContent: AttributesRowHead,
        cellContentProps: { style: { overflow: 'visible' } },
        align: 'left',
        width: 74,
        minWidth: 40,
        headerCellProps: {
          padding: 'checkbox',
          size: 'small',
          align: 'center',
          className: cnAttributesCheckCell()
        },
        cellProps: {
          padding: 'checkbox'
        }
      },

      ...getXTableColumnsFromSchema(this.schema)
    ] as XTableColumn<AttributesTableRecord>[];
  }

  private getHeight(): number {
    const height = localStorage.getItem('atr-size');

    return Number(height) || 400;
  }

  @boundMethod
  private async getData(pageOptions: PageOptions): Promise<[AttributesTableRecord[], number]> {
    const { layer } = this.props;
    const [featureIds, filter, featureIdsNegative] = extractFeatureIdsFromAttributesFilter(pageOptions.filter, layer);

    const [features, totalPages, featuresMatched, featuresTotal] = await getFeatures(
      layer,
      { ...pageOptions, filter },
      this.schema?.definitionQuery,
      featureIds,
      featureIdsNegative
    );

    const tableRecords: AttributesTableRecord[] = features.map(feature => {
      const featureCalcProperties = calculateValues(feature.properties, this.schema?.properties || []);
      const properties = this.schema?.properties || [];

      for (const property of properties) {
        featureCalcProperties[property.name] = convertToComplexField(property, featureCalcProperties);
      }

      return {
        cutId: extractFeatureId(feature.id),
        feature,
        ...featureCalcProperties
      };
    });

    this.setFeaturesTotal(featuresTotal);
    this.setFeaturesMatched(featuresMatched);

    return [tableRecords, totalPages];
  }

  private async fetchSchema() {
    const operationId = Symbol();
    this.fetchingSchemaOperationId = operationId;

    const schema = await getLayerSchema(this.props.layer);
    if (this.fetchingSchemaOperationId === operationId && schema) {
      this.setSchema(schema);
    }
  }

  @action.bound
  private setFeaturesMatched(count: number) {
    this.featuresMatched = count;
  }

  @action.bound
  private setFeaturesTotal(count: number) {
    this.featuresTotal = count;
  }

  @action
  private setSchema(schema: Schema) {
    this._schema = schema;
  }

  @action.bound
  private resize(height: number) {
    if (height > 700 || height <= 150) {
      return;
    }
    this.height = height;
  }

  @action.bound
  private handlePageOptionsChange(pageOptions: PageOptions) {
    const { onPageOptionsChange } = this.props;
    this.pageOptions = pageOptions;
    onPageOptionsChange(pageOptions);
  }
}
