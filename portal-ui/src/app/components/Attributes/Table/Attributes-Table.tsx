import React, { Component } from 'react';
import { action, computed, observable, makeObservable, IReactionDisposer, reaction } from 'mobx';
import { observer } from 'mobx-react';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';

import { EditFeatureMode, sidebars } from '../../../stores/Sidebars.store';
import { attributesTableStore } from '../../../stores/AttributesTable.store';
import { FilterBySelection, MapSelectionTypes, mapStore } from '../../../stores/Map.store';
import { mapSelectionService } from '../../../services/map/map-selection.service';
import { communicationService } from '../../../services/communication.service';
import { CrgVectorLayer } from '../../../services/gis/projects.models';
import { WfsFeature } from '../../../services/geoserver/wfs.models';
import { mapService } from '../../../services/map/map.service';
import { Schema } from '../../../services/data/schema.models';
import { PageOptions } from '../../../services/models';
import { sleep } from '../../../services/util/sleep';
import { XTable, XTableColumn, XTableInvoke } from '../../XTable/XTable';
import { Loading } from '../../Loading/Loading';

import '!style-loader!css-loader!sass-loader!./Attributes-Table.scss';
import '!style-loader!css-loader!sass-loader!../TableContainer/Attributes-TableContainer.scss';
import '!style-loader!css-loader!sass-loader!../CheckCell/Attributes-CheckCell.scss';
import { FilterQuery } from '../../../services/util/filterObjects';
import { SortParams } from '../../../services/util/sortObjects';

const cnAttributesTable = cn('Attributes', 'Table');
const cnAttributesTableContainer = cn('Attributes', 'TableContainer');

export interface AttributesTableRecord extends Record<string, unknown> {
  cutId: string;
  feature: WfsFeature;
}

interface AttributesTableProps {
  layer: CrgVectorLayer;
  schema: Schema;
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

    invoke.setPageSize = this.forwardInvoke('setPageSize');
    invoke.setFilter = this.forwardInvoke('setFilter');
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
    const { layer } = this.props;

    if (layer?.schemaId !== prevProps.layer?.schemaId && this.tableInvoke.reset) {
      this.tableInvoke.reset({ filter: attributesTableStore.getLayerFilter(layer) });
      await this.tableInvoke.reload();
    }
  }

  componentWillUnmount(): void {
    communicationService.off(this);
    this.selectionReactionDisposer();
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
    return this.pageOptions.filter?.filterBySelection !== FilterBySelection.DISABLED;
  }

  private rowIdGetter({ cutId }: AttributesTableRecord) {
    return cutId;
  }

  private forwardInvoke<K extends keyof XTableInvoke>(key: K): XTableInvoke[K] {
    return this.callInvoke.bind(this, key) as XTableInvoke[K];
  }

  private callInvoke(key: keyof XTableInvoke, ...args: Parameters<XTableInvoke[keyof XTableInvoke]>) {
    if (this.tableInvoke[key]) {
      return this.tableInvoke[key](...(args as [number & FilterQuery & SortParams<unknown>]));
    }
  }

  @action.bound
  private handlePageOptionsChange(pageOptions: PageOptions) {
    const { onPageOptionsChange, layer } = this.props;

    // this.pageOptions может быть совсем пустым только при инициализации
    if (!this.pageOptions && attributesTableStore.filter[layer.tableName]) {
      this.tableInvoke.setFilter(attributesTableStore.filter[layer.tableName]);
    } else {
      onPageOptionsChange(pageOptions);
      attributesTableStore.updateFilter(layer, Object.keys(pageOptions.filter).length ? pageOptions.filter : undefined);
    }

    this.pageOptions = pageOptions;
  }

  @boundMethod
  private async handleRowDoubleClick({ feature }: AttributesTableRecord) {
    mapService.positionToFeature(feature);
    if (!mapStore.limitReached) {
      mapSelectionService.selectFeatures([feature], MapSelectionTypes.ADD);
    }
    sidebars.closeEdit();
    await sleep(0);
    sidebars.openEdit({ features: [feature], mode: EditFeatureMode.single });
  }

  @boundMethod
  private async reloadTable() {
    if (this.tableInvoke.reload) {
      await this.tableInvoke.reload();
    }
  }
}
