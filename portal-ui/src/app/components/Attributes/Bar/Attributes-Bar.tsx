import React, { Component } from 'react';
import { action, observable, makeObservable, computed } from 'mobx';
import { observer } from 'mobx-react';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';

import { FilterBySelection, mapStore } from '../../../stores/Map.store';
import { calculateValues } from '../../../services/formValidation.service';
import { CrgVectorLayer } from '../../../services/gis/projects/projects.models';
import { schemaService } from '../../../services/data/schema/schema.service';
import { getFeatures } from '../../../services/geoserver/wfs/wfs.service';
import { Schema } from '../../../services/data/schema/schema.models';
import { PageOptions } from '../../../services/models';
import { getXTableColumnsFromSchemaWithLowerCaseKeys } from '../../XTable/XTable.utils';
import { applyView } from '../../../services/data/schema/schema.utils';
import { currentProject } from '../../../stores/CurrentProject.store';
import { XTableColumn, XTableInvoke } from '../../XTable/XTable';

import { AttributesRowHead } from '../RowHead/Attributes-RowHead';
import { AttributesBarHead } from '../BarHead/Attributes-BarHead';
import { AttributesCounter } from '../Counter/Attributes-Counter';
import { AttributesBarTitle } from '../BarTitle/Attributes-BarTitle';
import { AttributesBarClose } from '../BarClose/Attributes-BarClose';
import { AttributesBarHeadGap } from '../BarHeadGap/Attributes-BarHeadGap';
import { AttributesBarActions } from '../BarActions/Attributes-BarActions';
import { AttributesBarMinimize } from '../BarMinimize/Attributes-BarMinimize';
import { AttributesCheckMaster } from '../CheckMaster/Attributes-CheckMaster';
import { AttributesCheckFilter } from '../CheckFilter/Attributes-CheckFilter';
import { AttributesTable, AttributesTableRecord } from '../Table/Attributes-Table';
import { AttributesFiltersEnabler } from '../FiltersEnabler/Attributes-FiltersEnabler';
import { AttributesBarRightActions } from '../BarRightActions/Attributes-BarRightActions';

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
  @observable featuresMatched = 0;
  @observable featuresTotal = 0;
  private fetchingSchemaOperationId: symbol;

  constructor(props: AttributesBarProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount() {
    await this.fetchSchema();
  }

  async componentDidUpdate(prevProps: AttributesBarProps) {
    if (this.props.layer?.schemaId !== prevProps.layer?.schemaId) {
      await this.fetchSchema();
    }
  }

  render() {
    const { layer, tableInvoke, onMinimize, onClose } = this.props;

    return (
      <div className={cnAttributesBar()}>
        <AttributesBarHead>
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
          <AttributesCheckMaster layer={layer} featuresMatched={this.featuresMatched} pageOptions={this.pageOptions} />
        ),
        CustomFilterComponent: AttributesCheckFilter,
        filterable: !!mapStore.selectedFeaturesByTableName[layer.tableName]?.length,
        CellContent: AttributesRowHead,
        cellContentProps: { style: { overflow: 'visible' } },
        align: 'left',
        width: 74,
        minWidth: 74,
        headerCellProps: { padding: 'checkbox', size: 'small', align: 'center', className: cnAttributesCheckCell() },
        cellProps: { padding: 'checkbox' }
      },
      { field: 'cutId', title: 'ID', minWidth: 50 },
      ...(getXTableColumnsFromSchemaWithLowerCaseKeys(this.schema) as XTableColumn<Partial<AttributesTableRecord>>[])
    ] as XTableColumn<AttributesTableRecord>[];
  }

  @boundMethod
  private async getData(pageOptions: PageOptions): Promise<[AttributesTableRecord[], number]> {
    const { layer } = this.props;
    const { filterBySelection, ...filter } = pageOptions.filter || {};
    const featureIds =
      filterBySelection && filterBySelection !== FilterBySelection.DISABLED
        ? mapStore.selectedFeaturesByTableName[layer.tableName]?.map(({ id }) => id)
        : [];

    const [features, totalPages, featuresMatched, featuresTotal] = await getFeatures(
      layer,
      { ...pageOptions, filter },
      featureIds,
      filterBySelection === FilterBySelection.ONLY_NOT_SELECTED
    );

    const tableRecords: AttributesTableRecord[] = features.map(feature => ({
      cutId: feature.id.split('.')[1],
      feature,
      ...calculateValues(feature.properties, this.schema.properties)
    }));

    this.setFeaturesTotal(featuresTotal);
    this.setFeaturesMatched(featuresMatched);

    return [tableRecords, totalPages];
  }

  private async fetchSchema() {
    const operationId = Symbol();
    this.fetchingSchemaOperationId = operationId;

    const schema = await schemaService.getSchema(this.props.layer.schemaId);
    if (this.fetchingSchemaOperationId === operationId) {
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
  private handlePageOptionsChange(pageOptions: PageOptions) {
    const { onPageOptionsChange } = this.props;
    this.pageOptions = pageOptions;
    onPageOptionsChange(pageOptions);
  }
}
