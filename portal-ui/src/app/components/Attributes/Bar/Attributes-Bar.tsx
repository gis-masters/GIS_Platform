import React, { Component } from 'react';
import { cloneDeep } from 'lodash';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { action, observable, makeObservable, computed } from 'mobx';

import { mapStore } from '../../../stores/Map.store';
import { currentProject } from '../../../stores/CurrentProject.store';
import { getFieldFilterValue, modifyFieldFilterValue } from '../../../services/util/filterObjects';
import { getLayerSchema } from '../../../services/gis/layers/layers.service';
import { CrgVectorLayer } from '../../../services/gis/layers/layers.models';
import { calculateValues } from '../../../services/util/form/formValidation.utils';
import { getFeatures } from '../../../services/geoserver/wfs/wfs.service';
import { applyView } from '../../../services/data/schema/schema.utils';
import { getXTableColumnsFromSchema } from '../../XTable/XTable.utils';
import { Schema } from '../../../services/data/schema/schema.models';
import { FilterBySelection } from '../../../services/map/map.models';
import { convertToComplexField } from '../../Form/Form.utils';
import { XTableColumn } from '../../XTable/XTable.models';
import { PageOptions } from '../../../services/models';
import { XTableInvoke } from '../../XTable/XTable';

import { AttributesRowHead } from '../RowHead/Attributes-RowHead';
import { AttributesBarHead } from '../BarHead/Attributes-BarHead';
import { AttributesCounter } from '../Counter/Attributes-Counter';
import { AttributesBarTitle } from '../BarTitle/Attributes-BarTitle';
import { AttributesBarClose } from '../BarClose/Attributes-BarClose';
import { AttributesBarHeadGap } from '../BarHeadGap/Attributes-BarHeadGap';
import { AttributesBarActions } from '../BarActions/Attributes-BarActions';
import { extractFeatureId } from '../../../services/geoserver/feature.util';
import { AttributesBarMinimize } from '../BarMinimize/Attributes-BarMinimize';
import { AttributesCheckMaster } from '../CheckMaster/Attributes-CheckMaster';
import { AttributesCheckFilter } from '../CheckFilter/Attributes-CheckFilter';
import { AttributesFiltersEnabler } from '../FiltersEnabler/Attributes-FiltersEnabler';
import { AttributesBarRightActions } from '../BarRightActions/Attributes-BarRightActions';
import { AttributesTable, AttributesTableRecord, FILTER_BY_SELECTION } from '../Table/Attributes-Table';
import { AttributesResize } from '../Resize/Attributes-Resize';

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

  private getHeight(): number {
    const height = localStorage.getItem('atr-size');

    return Number(height) || 400;
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
        filterable: !!mapStore.selectedFeaturesByTableName[layer.tableName]?.length,
        CellContent: AttributesRowHead,
        cellContentProps: { style: { overflow: 'visible' } },
        align: 'left',
        width: 74,
        minWidth: 74,
        headerCellProps: {
          padding: 'checkbox',
          size: 'small',
          align: 'center',
          className: cnAttributesCheckCell()
        },
        cellProps: { padding: 'checkbox' }
      },
      { field: 'cutId', title: 'ID', minWidth: 50 },
      ...getXTableColumnsFromSchema(this.schema)
    ] as XTableColumn<AttributesTableRecord>[];
  }

  @boundMethod
  private async getData(pageOptions: PageOptions): Promise<[AttributesTableRecord[], number]> {
    const { layer } = this.props;

    const filter = cloneDeep(pageOptions.filter || {});
    const filterBySelection = getFieldFilterValue(filter, FILTER_BY_SELECTION);
    modifyFieldFilterValue(filter, FILTER_BY_SELECTION);

    const featureIds =
      filterBySelection && filterBySelection !== FilterBySelection.DISABLED
        ? mapStore.selectedFeaturesByTableName[layer.tableName]?.map(({ id }) => id)
        : [];

    const [features, totalPages, featuresMatched, featuresTotal] = await getFeatures(
      layer,
      { ...pageOptions, filter },
      this.schema?.definitionQuery,
      featureIds,
      filterBySelection === FilterBySelection.ONLY_NOT_SELECTED
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
