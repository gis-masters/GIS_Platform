import React, { Component } from 'react';
import { action, computed, observable, makeObservable, IReactionDisposer, reaction } from 'mobx';
import { observer } from 'mobx-react';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';

import { FilterBySelection, mapStore } from '../../../stores/Map.store';
import { communicationService } from '../../../services/communication.service';
import { CrgVectorLayer } from '../../../services/gis/projects.models';
import { getXTableColumnsFromSchema } from '../../XTable/XTable.utils';
import { getFeatures } from '../../../services/geoserver/wfs.service';
import { schemaService } from '../../../services/data/schema.service';
import { WfsFeature } from '../../../services/geoserver/wfs.models';
import { Schema } from '../../../services/data/schema.models';
import { PageOptions } from '../../../services/models';
import { XTable, XTableColumn, XTableInvoke } from '../../XTable/XTable';
import { Loading } from '../../Loading/Loading';

import { AttributesCheckMaster } from '../CheckMaster/Attributes-CheckMaster';
import { AttributesCheckFilter } from '../CheckFilter/Attributes-CheckFilter';
import { AttributesCheck } from '../Check/Attributes-Check';

import '!style-loader!css-loader!sass-loader!./Attributes-Table.scss';
import '!style-loader!css-loader!sass-loader!../TableContainer/Attributes-TableContainer.scss';
import '!style-loader!css-loader!sass-loader!../CheckCell/Attributes-CheckCell.scss';

const cnAttributesTable = cn('Attributes', 'Table');
const cnAttributesTableContainer = cn('Attributes', 'TableContainer');
const cnAttributesCheckCell = cn('Attributes', 'CheckCell');

interface AttributesTableProps {
  layer: CrgVectorLayer;
  onFeaturesMatchedChange(count: number): void;
  onFeaturesTotalChange(count: number): void;
  onPageOptionsChange(pageOptions: PageOptions): void;
  invoke: XTableInvoke;
}

export interface AttributesTableRecord extends Record<string, unknown> {
  cutId: string;
  feature: WfsFeature;
}

@observer
export class AttributesTable extends Component<AttributesTableProps> {
  @observable private featuresMatched = 0;
  @observable private pageOptions?: PageOptions;
  @observable private schema?: Schema;
  private fetchingSchemaOperationId: symbol;
  private tableInvoke: XTableInvoke = {};
  private selectionReactionDisposer?: IReactionDisposer;

  constructor(props: AttributesTableProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount() {
    const { invoke, layer } = this.props;
    await this.fetchSchema();

    communicationService.featuresUpdated.on(this.reloadTable, this);

    invoke.setPageSize = this.forwardInvoke('setPageSize');
    invoke.paginate = this.forwardInvoke('paginate');
    invoke.reload = this.forwardInvoke('reload');
    invoke.reset = this.forwardInvoke('reset');

    this.selectionReactionDisposer = reaction(
      () => mapStore.selectedFeaturesByTableName[layer.tableName],
      async () => {
        if (this.filterBySelectionEnabled) {
          await this.reloadTable();
        }
      }
    );
  }

  async componentDidUpdate(prevProps: AttributesTableProps) {
    if (this.props.layer?.schemaId !== prevProps.layer?.schemaId) {
      await this.fetchSchema();
      if (this.tableInvoke.reload && this.tableInvoke.reset) {
        this.tableInvoke.reset();
        await this.tableInvoke.reload();
      }
    }
  }

  componentWillUnmount(): void {
    communicationService.off(this);
    this.selectionReactionDisposer();
  }

  render() {
    const { layer } = this.props;

    return this.schema ? (
      <XTable<AttributesTableRecord>
        id={`AttributesTable_${layer.tableName}`}
        className={cnAttributesTable()}
        cols={this.cols}
        filtersAlwaysEnabled
        headerless
        footerless
        singleLineContent
        containerProps={{ className: cnAttributesTableContainer(), square: true }}
        size='small'
        getData={this.getData}
        getRowId={this.rowIdGetter}
        invoke={this.tableInvoke}
        onPageOptionsChange={this.handlePageOptionsChange}
      />
    ) : (
      <Loading visible />
    );
  }

  @computed
  private get cols(): XTableColumn<AttributesTableRecord>[] {
    const { layer } = this.props;

    return [
      {
        field: '_idCheck',
        title: (
          <AttributesCheckMaster layer={layer} featuresMatched={this.featuresMatched} pageOptions={this.pageOptions} />
        ),
        CustomFilterComponent: AttributesCheckFilter,
        filterable: !!mapStore.selectedFeaturesByTableName[layer.tableName]?.length,
        CellContent: AttributesCheck,
        align: 'center',
        headerCellProps: { padding: 'checkbox', size: 'small', align: 'center', className: cnAttributesCheckCell() },
        cellProps: { padding: 'checkbox' }
      },
      { field: 'cutId', title: 'ID' },
      ...getXTableColumnsFromSchema<AttributesTableRecord>(this.schema)
    ];
  }

  @computed
  private get filterBySelectionEnabled(): boolean {
    const { filterBySelection } = this.pageOptions.filter || {};

    return filterBySelection && filterBySelection !== FilterBySelection.DISABLED;
  }

  private rowIdGetter({ cutId }: AttributesTableRecord) {
    return cutId;
  }

  @boundMethod
  private async getData(pageOptions: PageOptions): Promise<[AttributesTableRecord[], number]> {
    const { layer, onFeaturesMatchedChange, onFeaturesTotalChange } = this.props;
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
      ...feature.properties
    }));

    onFeaturesTotalChange(featuresTotal);
    onFeaturesMatchedChange(featuresMatched);
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

  private forwardInvoke<K extends keyof XTableInvoke>(key: K): XTableInvoke[K] {
    return this.callInvoke.bind(this, key) as XTableInvoke[K];
  }

  private callInvoke(key: keyof XTableInvoke, ...args: Parameters<XTableInvoke[keyof XTableInvoke]>) {
    if (this.tableInvoke[key]) {
      return this.tableInvoke[key](...(args as [number]));
    }
  }

  @action
  private setSchema(schema: Schema) {
    this.schema = schema;
  }

  @action
  private setFeaturesMatched(featuresMatched: number) {
    this.featuresMatched = featuresMatched;
  }

  @action.bound
  private handlePageOptionsChange(pageOptions: PageOptions) {
    const { onPageOptionsChange, layer } = this.props;
    this.pageOptions = pageOptions;
    onPageOptionsChange(pageOptions);
    mapStore.updateAttributeTableFilter(layer, Object.keys(pageOptions.filter).length ? pageOptions.filter : undefined);
  }

  @boundMethod
  private async reloadTable() {
    if (this.tableInvoke.reload) {
      await this.tableInvoke.reload();
    }
  }
}
