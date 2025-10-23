import React, { Component, type ReactElement } from 'react';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { HomeOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { type AxiosError } from 'axios';

import { type FileConnection } from '../../services/data/files/files.models';
import { PropertyType } from '../../services/data/schema/schema.models';
import { type VectorTable } from '../../services/data/vectorData/vectorData.models';
import {
  getDataset,
  getVectorTable,
  getVectorTableConnections,
  getVectorTableFeatures
} from '../../services/data/vectorData/vectorData.service';
import { type WfsFeature } from '../../services/geoserver/wfs/wfs.models';
import { type PageOptions } from '../../services/models';
import { currentUser } from '../../stores/CurrentUser.store';
import { Breadcrumbs, type BreadcrumbsItemData } from '../Breadcrumbs/Breadcrumbs';
import { datasetRootUrlItems } from '../DataManagement/DataManagement.utils';
import { EmptyListView } from '../EmptyListView/EmptyListView';
import { GlobalSearch } from '../GlobalSearch/GlobalSearch';
import { Loading } from '../Loading/Loading';
import { Registry } from '../Registry/Registry';
import { RegistrySettings } from '../RegistrySettings/RegistrySettings';
import { type XTableColumn } from '../XTable/XTable.models';
import { getXTableColumnsFromSchema } from '../XTable/XTable.utils';
import { VectorTableRegistryOpenAction } from './OpenAction/VectorTableRegistry-OpenAction';

import './VectorTableRegistry.scss';

const cnVectorTableRegistry = cn('VectorTableRegistry');

export interface VectorTableRegistryProps {
  id: string;
  vectorTableIdentifier: string;
  datasetIdentifier: string;
}

@observer
export default class VectorTableRegistry extends Component<VectorTableRegistryProps> {
  @observable private loading?: boolean;
  @observable private error: string | undefined;
  @observable private connections: FileConnection[] = [];
  @observable private wfsFeatures: WfsFeature[] = [];
  @observable private hiddenFields: string[] = [];
  @observable private vectorTable: VectorTable | undefined;
  @observable private breadcrumbsItems: BreadcrumbsItemData[] = [];

  private currentVectorTableId = '';

  constructor(props: VectorTableRegistryProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount() {
    await this.getSchema();
    await this.setBreadcrumbsItems();
  }

  render() {
    const { vectorTableIdentifier, datasetIdentifier } = this.props;

    return (
      <div className={cnVectorTableRegistry()}>
        {this.ready && (
          <>
            <Breadcrumbs items={this.breadcrumbsItems} itemsType='link' size='medium' />

            <Registry<Record<string, unknown>>
              className={cnVectorTableRegistry('Table')}
              cols={this.cols}
              id={this.getId()}
              getData={this.getData}
              filtersAlwaysEnabled
              customActionFirst
              showFiltersPanel
              urlChangeEnabled
              headerActions={
                <>
                  <GlobalSearch source={{ table: vectorTableIdentifier, dataset: datasetIdentifier }} />

                  <RegistrySettings
                    properties={this.vectorTable?.schema.properties || []}
                    hiddenFields={this.hiddenFields}
                    onChangeHiddenFields={this.setHiddenFields}
                  />
                </>
              }
            />
          </>
        )}
        {!this.ready && !this.error && <Loading visible={this.loading} noBackdrop />}

        {this.error && <EmptyListView text={this.error} />}
      </div>
    );
  }

  private getStorageKey(): string {
    return `registrySettings_${currentUser.id}_${this.props.vectorTableIdentifier}_${this.props.id}`;
  }

  private getId(): string {
    return this.props.id + '_VectorTableRegistryRegistry_' + this.props.vectorTableIdentifier;
  }

  @action
  private async setBreadcrumbsItems(): Promise<void> {
    if (this.vectorTable) {
      const dataset = await getDataset(this.vectorTable.dataset);

      const { title: tableTitle, identifier: tableIdentifier } = this.vectorTable;
      const { title: datasetTitle, identifier: datasetIdentifier } = dataset;

      const datasetRootPath = JSON.stringify([...datasetRootUrlItems, 'none', 'none']);
      const datasetPath = JSON.stringify([...datasetRootUrlItems, 'dataset', datasetIdentifier, 'none', 'none']);
      const vectorTablePath = JSON.stringify([
        ...datasetRootUrlItems,
        'dataset',
        datasetIdentifier,
        'table',
        tableIdentifier
      ]);

      this.breadcrumbsItems = [
        { title: <HomeOutlined />, url: '/data-management' },
        {
          title: 'Наборы данных',
          url: `/data-management?path_dm=${datasetRootPath}`
        },
        {
          title: datasetTitle,
          url: `/data-management?path_dm=${datasetPath}`
        },
        {
          title: tableTitle,
          url: `/data-management?path_dm=${vectorTablePath}`
        }
      ];
    }
  }

  @computed
  private get cols(): XTableColumn<Record<string, unknown>>[] {
    if (!this.vectorTable) {
      return [];
    }

    const checkboxCell: XTableColumn<Record<string, unknown>> = {
      CellContent: this.renderActions,
      align: 'center',
      minWidth: 30,
      filterable: false,
      cellProps: { padding: 'checkbox' }
    };

    return [checkboxCell, ...getXTableColumnsFromSchema<Record<string, unknown>>(this.vectorTable.schema)].map(
      (item: XTableColumn<Record<string, unknown>>) => ({
        ...item,
        // скрыл поля с типом GEOMETRY т.к. Виктор сказал что мы не умеем иъ отображать и это косяк
        hidden: item.type === PropertyType.GEOMETRY || this.hiddenFields.includes(String(item.field)) || item.hidden,
        filterable: item.filterable
      })
    );
  }

  @action.bound
  private setHiddenFields(hiddenFields: string[]) {
    this.hiddenFields = hiddenFields;
    this.storeSettings();
  }

  private storeSettings() {
    localStorage.setItem(
      this.getStorageKey(),
      JSON.stringify({
        hiddenFields: this.hiddenFields || [],
        content_type_id: this.vectorTable?.schema.appliedContentType || null
      })
    );
  }

  @boundMethod
  private renderActions({ rowData }: { rowData: Record<string, unknown> }): ReactElement | undefined {
    const feature = this.wfsFeatures.find(({ id }) => id === rowData.id);

    if (this.vectorTable?.schema && feature) {
      return (
        <VectorTableRegistryOpenAction
          schema={this.vectorTable?.schema}
          feature={feature}
          vectorTable={this.vectorTable}
        />
      );
    }
  }

  @computed
  private get ready(): boolean {
    return Boolean(this.vectorTable);
  }

  private async getSchema() {
    try {
      this.setVectorTable(await getVectorTable(this.props.datasetIdentifier, this.props.vectorTableIdentifier));
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;

      this.setError(err?.response?.data?.message || err?.message);
    }
  }

  @boundMethod
  private async getData(pageOptions: PageOptions): Promise<[Record<string, unknown>[], number]> {
    await this.fetchConnections();

    const { dataset, tableName } = this.getDatasetAndTableName();

    if (!dataset || !tableName) {
      return [[], 1];
    }

    const res = await getVectorTableFeatures(dataset, tableName, pageOptions);

    const data = res.content.map(item => {
      return { ...item.properties, id: item.id };
    });

    this.setWfsFeatures(res.content);

    return [data, res.page.totalPages];
  }

  private getDatasetAndTableName(): { dataset?: string; tableName?: string } {
    if (this.vectorTable) {
      return {
        dataset: this.vectorTable.dataset,
        tableName: this.vectorTable.identifier
      };
    }

    if (this.connections.length > 0) {
      const firstConnection = this.connections[0];

      return {
        dataset: firstConnection.layer?.dataset,
        tableName: firstConnection.layer?.tableName
      };
    }

    return {};
  }

  private async fetchConnections() {
    const { vectorTableIdentifier: vectorTable } = this.props;
    this.setLoading(true);
    this.currentVectorTableId = vectorTable;

    const vectorTableConnections = await getVectorTableConnections(vectorTable);

    if (vectorTableConnections.length && this.currentVectorTableId === vectorTable) {
      this.setConnections(vectorTableConnections);
    }

    this.setLoading(false);
  }

  @action
  private setWfsFeatures(wfsFeatures: WfsFeature[]) {
    this.wfsFeatures = wfsFeatures;
  }

  @action
  private setVectorTable(vectorTable: VectorTable) {
    this.vectorTable = vectorTable;
  }

  @action
  private setConnections(connections: FileConnection[]) {
    this.connections = connections;
  }

  @action
  private setError(error: string) {
    this.error = error;
  }

  @action
  private setLoading(loading: boolean) {
    this.loading = loading;
  }
}
