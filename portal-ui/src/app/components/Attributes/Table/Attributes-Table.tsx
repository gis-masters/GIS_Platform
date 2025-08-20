import React, { Component } from 'react';
import { action, computed, IReactionDisposer, makeObservable, observable, reaction } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { communicationService } from '../../../services/communication.service';
import { Schema } from '../../../services/data/schema/schema.models';
import { CrgVectorLayer } from '../../../services/gis/layers/layers.models';
import { EditFeatureMode } from '../../../services/map/a-map-mode/edit-feature/EditFeature.models';
import { mapModeManager } from '../../../services/map/a-map-mode/MapModeManager';
import { selectedFeaturesStore } from '../../../services/map/a-map-mode/selected-features/SelectedFeatures.store';
import { FilterBySelectionMode, MapMode, MapSelectionTypes } from '../../../services/map/map.models';
import { mapService } from '../../../services/map/map.service';
import { PageOptions } from '../../../services/models';
import { getFieldFilterValue } from '../../../services/util/filters/filters';
import { FilterQuery } from '../../../services/util/filters/filters.models';
import { SortParams } from '../../../services/util/sortObjects';
import { attributesTableStore } from '../../../stores/AttributesTable.store';
import { Loading } from '../../Loading/Loading';
import { XTable, XTableInvoke } from '../../XTable/XTable';
import { XTableColumn } from '../../XTable/XTable.models';
import { AttributesTableRecord, FILTER_BY_SELECTION } from '../Attributes.models';

import '!style-loader!css-loader!sass-loader!./Attributes-Table.scss';
import '!style-loader!css-loader!sass-loader!../CheckCell/Attributes-CheckCell.scss';
import '!style-loader!css-loader!sass-loader!../TableContainer/Attributes-TableContainer.scss';

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
      () => selectedFeaturesStore.featuresByTableName[layer.tableName],
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
      this.tableInvoke.reset({ filter: attributesTableStore.getLayerFilter(layer.tableName) });
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
        id={`AttributesTable_${layer.tableName}`}
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
    if (!this.pageOptions && attributesTableStore.filter[layer.tableName]) {
      this.tableInvoke?.setFilter?.(attributesTableStore.filter[layer.tableName]);
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
      await mapModeManager.changeMode(
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

    await mapModeManager.changeMode(
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
