import React, { Component } from 'react';
import { action, computed, type IReactionDisposer, makeObservable, observable, reaction } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { communicationService } from '../../../services/communication.service';
import { type Schema } from '../../../services/data/schema/schema.models';
import { type CrgVectorLayer } from '../../../services/gis/layers/layers.models';
import { FilterBySelectionMode, MapMode, MapSelectionTypes } from '../../../services/map/map.models';
import { mapService } from '../../../services/map/map.service';
import { EditFeatureMode } from '../../../services/map/mode/map-mode.models';
import { mapModeService } from '../../../services/map/mode/map-mode.service';
import { type PageOptions } from '../../../services/models';
import { getFieldFilterValue } from '../../../services/util/filters/filters';
import { type FilterQuery } from '../../../services/util/filters/filters.models';
import { type SortParams } from '../../../services/util/sortObjects';
import { attributesTableStore } from '../../../stores/AttributesTable.store';
import { selectedFeaturesStore } from '../../../stores/SelectedFeatures.store';
import { Loading } from '../../Loading/Loading';
import { XTable, type XTableInvoke } from '../../XTable/XTable';
import { type XTableColumn } from '../../XTable/XTable.models';
import { type AttributesTableRecord, FILTER_BY_SELECTION } from '../Attributes.models';

import './Attributes-Table.scss';
import '../CheckCell/Attributes-CheckCell.scss';
import '../TableContainer/Attributes-TableContainer.scss';

const cnAttributesTable = cn('Attributes', 'Table');
const cnAttributesTableContainer = cn('Attributes', 'TableContainer');

interface AttributesTableProps {
  layer: CrgVectorLayer;
  schema?: Schema;
  cols: XTableColumn<AttributesTableRecord>[];
  onPageOptionsChange(pageOptions: PageOptions): void;
  getData(pageOptions: PageOptions): Promise<[AttributesTableRecord[], number]>;
  invoke: XTableInvoke;
}

@observer
export class AttributesTable extends Component<AttributesTableProps> {
  @observable private pageOptions?: PageOptions;

  private tableInvoke: XTableInvoke = {};
  private selectionReactionDisposer?: IReactionDisposer;

  constructor(props: AttributesTableProps) {
    super(props);
    makeObservable(this);
  }

  componentDidMount() {
    const { invoke, layer } = this.props;

    communicationService.featuresUpdated.on(this.reloadTable, this);

    if (!invoke) {
      throw new Error('Invoke is required');
    }

    invoke.setPageSize = this.forwardInvoke('setPageSize');
    invoke.setFilter = this.forwardInvoke('setFilter');
    invoke.paginate = this.forwardInvoke('paginate');
    invoke.reload = this.forwardInvoke('reload');
    invoke.reset = this.forwardInvoke('reset');

    this.selectionReactionDisposer = reaction(
      () => selectedFeaturesStore.featuresByResourceId[layer.resourceId],
      async () => {
        if (this.filterBySelectionEnabled) {
          await this.reloadTable();
        }
      }
    );
  }

  async componentDidUpdate(prevProps: AttributesTableProps) {
    const { layer } = this.props;

    if (layer?.id !== prevProps.layer?.id && this.tableInvoke?.reset && this.tableInvoke?.reload) {
      this.tableInvoke.reset({ filter: attributesTableStore.getLayerFilter(layer.resourceId) });
      await this.tableInvoke.reload();
    }
  }

  componentWillUnmount(): void {
    communicationService.off(this);
    this.selectionReactionDisposer?.();
  }

  render() {
    const { layer, cols, schema, getData } = this.props;

    return schema ? (
      <XTable<AttributesTableRecord>
        id={`AttributesTable_${layer.resourceId}`}
        className={cnAttributesTable()}
        cols={cols}
        filtersAlwaysEnabled
        headerless
        footerless
        singleLineContent
        enableMaxDefaultWidth
        containerProps={{ className: cnAttributesTableContainer(), square: true }}
        size='small'
        getData={getData}
        getRowId={this.rowIdGetter}
        invoke={this.tableInvoke}
        onPageOptionsChange={this.handlePageOptionsChange}
        onRowDoubleClick={this.handleRowDoubleClick}
      />
    ) : (
      <Loading visible />
    );
  }

  @computed
  private get filterBySelectionEnabled(): boolean {
    return getFieldFilterValue(this.pageOptions?.filter || {}, FILTER_BY_SELECTION) !== FilterBySelectionMode.DISABLED;
  }

  private rowIdGetter({ cutId }: AttributesTableRecord) {
    return cutId;
  }

  private forwardInvoke<K extends keyof XTableInvoke>(key: K): XTableInvoke[K] {
    return this.callInvoke.bind(this, key) as XTableInvoke[K];
  }

  private callInvoke(key: keyof XTableInvoke, ...args: Parameters<Required<XTableInvoke>[keyof XTableInvoke]>) {
    if (this.tableInvoke?.[key]) {
      return this.tableInvoke?.[key]?.(...(args as [number & FilterQuery & SortParams<unknown>]));
    }
  }

  @action.bound
  private handlePageOptionsChange(pageOptions: PageOptions) {
    const { onPageOptionsChange, layer } = this.props;

    // this.pageOptions может быть совсем пустым только при инициализации
    if (!this.pageOptions && attributesTableStore.filter[layer.resourceId]) {
      this.tableInvoke?.setFilter?.(attributesTableStore.filter[layer.resourceId]);
    } else {
      onPageOptionsChange(pageOptions);
      attributesTableStore.updateFilter(layer, Object.keys(pageOptions.filter).length ? pageOptions.filter : undefined);
    }

    this.pageOptions = pageOptions;
  }

  @boundMethod
  private async handleRowDoubleClick({ feature }: AttributesTableRecord) {
    await mapService.positionToFeature(feature);

    if (!selectedFeaturesStore.limitReached) {
      await mapModeService.changeMode(
        MapMode.SELECTED_FEATURES,
        {
          payload: {
            features: [feature],
            type: MapSelectionTypes.ADD
          }
        },
        'handleRowDoubleClick 2'
      );
    }

    await mapModeService.changeMode(
      MapMode.EDIT_FEATURE,
      {
        payload: { features: [feature], mode: EditFeatureMode.single }
      },
      'handleRowDoubleClick 2'
    );
  }

  @boundMethod
  private async reloadTable() {
    if (this.tableInvoke?.reload) {
      await this.tableInvoke.reload();
    }
  }
}
