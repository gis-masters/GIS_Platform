import React, { Component, ReactElement } from 'react';
import { action, computed, observable, when, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { Checkbox } from '@mui/material';
import { HomeOutlined } from '@mui/icons-material';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';
import { AxiosError } from 'axios';

import { route } from '../../stores/Route.store';
import { currentUser } from '../../stores/CurrentUser.store';
import { getXTableColumnsFromSchema } from '../XTable/XTable.utils';
import { PropertySchema, PropertyType, Schema } from '../../services/data/schema.models';
import {
  DocumentLibrary,
  getLibrary,
  getLibraryRecords2,
  LibraryRecord
} from '../../services/data/doc-library.service';
import { communicationService } from '../../services/communication.service';
import { calculateValues } from '../../services/formValidation.service';
import { schemaService } from '../../services/data/schema.service';
import { FilterQuery } from '../../services/util/filterObjects';
import { SortParams } from '../../services/util/sortObjects';
import { PageOptions, SortOrder } from '../../services/models';
import { services } from '../../services/services';
import { LibraryDocumentActions } from '../LibraryDocumentActions/LibraryDocumentActions.composed';
import { BreadcrumbsItemData } from '../Breadcrumbs/Item/Breadcrumbs-Item';
import { XTable, XTableColumn, XTableInvoke } from '../XTable/XTable';
import { EmptyListView } from '../EmptyListView/EmptyListView';
import { Breadcrumbs } from '../Breadcrumbs/Breadcrumbs';
import { DocumentInfo } from '../Documents/Documents';
import { Loading } from '../Loading/Loading';

import { LibraryRegistrySettings } from './Settings/LibraryRegistry-Settings';
import { LibraryRegistryExport } from './Export/LibraryRegistry-Export';

import '!style-loader!css-loader!sass-loader!./LibraryRegistry.scss';

const cnLibraryRegistry = cn('LibraryRegistry');

interface LibraryRegistryProps {
  id: string;
  libraryId: string;
  inDialog?: boolean;
  urlChangeEnabled?: boolean;
  addedDocuments?: DocumentInfo[];
  checkedLibraryDocuments?: LibraryRecord[];
  onSelect?: (items: LibraryRecord[]) => void;
}

@observer
export class LibraryRegistry extends Component<LibraryRegistryProps> {
  @observable private library?: DocumentLibrary;
  @observable private schema?: Schema;
  @observable private hiddenFields: string[] = [];
  @observable private tablePageOptions?: PageOptions;
  @observable private libraryDocuments: LibraryRecord[] = [];
  @observable private error: string;

  private tableInvoke: XTableInvoke = {};

  constructor(props: LibraryRegistryProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount() {
    await this.getInfo();

    communicationService.libraryItemsUpdated.on(async () => {
      if (this.tableInvoke.reload) {
        await this.tableInvoke.reload();
      }
    });

    await this.restoreSettings();
  }

  componentWillUnmount() {
    communicationService.off(this);
  }

  render() {
    return (
      <div className={cnLibraryRegistry()}>
        {this.ready && (
          <>
            {!this.props.inDialog && <Breadcrumbs itemsType='link' items={this.breadcrumbsItems} />}
            <XTable<LibraryRecord>
              className={cnLibraryRegistry('Table')}
              cols={this.cols}
              hiddenFields={this.hiddenFields}
              getData={this.getData}
              defaultSort={this.sort}
              secondarySortField='id'
              filtersAlwaysEnabled
              defaultFilter={this.filter}
              headerActions={
                <>
                  <LibraryRegistryExport
                    tablePageOptions={this.tablePageOptions}
                    properties={this.properties}
                    library={this.library}
                    schema={this.schema}
                    cols={this.cols}
                  />
                  <LibraryRegistrySettings
                    properties={this.properties}
                    hiddenFields={this.hiddenFields}
                    onChangeHiddenFields={this.setHiddenFields}
                  />
                </>
              }
              invoke={this.tableInvoke}
              onPageOptionsChange={this.handleTablePageOptionsChange}
            />
          </>
        )}
        {!this.ready && !this.error && <Loading noBackdrop />}

        {this.error && <EmptyListView text={this.error} />}
      </div>
    );
  }

  @computed
  private get properties(): PropertySchema[] {
    return (this.schema?.properties || []).filter(
      ({ hidden, propertyType }) =>
        !hidden && propertyType !== PropertyType.BINARY && propertyType !== PropertyType.FIAS
    );
  }

  @computed
  private get breadcrumbsItems(): BreadcrumbsItemData[] {
    const libraryRootUrlItems = ['r', 'root', 'lr', 'libraryRoot'];
    const libraryRootPath = JSON.stringify([...libraryRootUrlItems, 'empty', 'empty']);
    const libraryPath = JSON.stringify([...libraryRootUrlItems, 'library', this.library?.identifier, 'empty', 'empty']);

    return [
      { title: <HomeOutlined />, url: '/data-management' },
      {
        title: 'Библиотеки документов',
        url: `/data-management?path_dm=${libraryRootPath}`
      },
      {
        title: this.library?.title,
        url: `/data-management?path_dm=${libraryPath}`
      }
    ];
  }

  @computed
  private get cols(): XTableColumn<LibraryRecord>[] {
    return [
      {
        CellContent: this.props.inDialog ? this.renderCheck : this.renderActions,
        align: 'center',
        cellProps: { padding: 'checkbox' }
      },
      ...getXTableColumnsFromSchema<LibraryRecord>(this.schema)
    ];
  }

  @computed
  private get ready(): boolean {
    return Boolean(this.library && this.schema);
  }

  private renderActions({ rowData }: { rowData: LibraryRecord }): ReactElement {
    return <LibraryDocumentActions className={cnLibraryRegistry('Actions')} document={rowData} as='menu' />;
  }

  @boundMethod
  private renderCheck({ rowData }: { rowData: LibraryRecord }): ReactElement {
    const { addedDocuments, checkedLibraryDocuments } = this.props;
    const checked =
      checkedLibraryDocuments.some(item => item.id === rowData.id) ||
      addedDocuments.some(item => item.id === rowData.id);

    return (
      <Checkbox
        disabled={addedDocuments.some(item => item.id === rowData.id)}
        defaultChecked={checked}
        value={rowData.id}
        onChange={this.changeHandler}
      />
    );
  }

  @action
  private setLibrary(library: DocumentLibrary) {
    this.library = library;
  }

  @action
  private setSchema(schema: Schema) {
    this.schema = schema;
  }

  @boundMethod
  private async getData(pageOptions: PageOptions): Promise<[LibraryRecord[], number]> {
    if (!this.library || !this.schema) {
      return [[], 1];
    }
    const [documents, totalPages] = await getLibraryRecords2(this.library.identifier, this.schema.name, pageOptions);
    if (this.props.inDialog) {
      this.setLibraryDocuments(documents);
    }

    return [
      documents.map(document => calculateValues<LibraryRecord>(document, this.schema?.properties || [])),
      totalPages
    ];
  }

  @action.bound
  private async handleTablePageOptionsChange(pageOptions: PageOptions) {
    this.tablePageOptions = pageOptions;

    const { sort, sortOrder: sortDir, filter } = pageOptions;
    const encodedSort = JSON.stringify([sort, sortDir]);
    const encodedFilter = JSON.stringify(filter);

    await services.ngZone.run(async () => {
      await services.router.navigate([location.pathname], {
        queryParams: {
          sort: encodedSort,
          filter: encodedFilter
        },
        queryParamsHandling: 'merge',
        replaceUrl: true
      });
    });
  }

  private getStorageKey(): string {
    return `registrySettings_${currentUser.id}_${this.library.identifier}_${this.props.id}`;
  }

  private storeSettings() {
    localStorage.setItem(this.getStorageKey(), JSON.stringify({ hiddenFields: this.hiddenFields || [] }));
  }

  private async restoreSettings() {
    await when(() => Boolean(this.library));
    const settings = JSON.parse(localStorage.getItem(this.getStorageKey()) || '{}') as { hiddenFields?: string[] };

    if (settings.hiddenFields) {
      this.setHiddenFields(settings.hiddenFields);
    }
  }

  private async getInfo() {
    try {
      this.setLibrary(await getLibrary(this.props.libraryId));
      this.setSchema(await schemaService.getSchema(this.library.schemaId));
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;

      this.setError(err?.response?.data?.message || err?.message);
    }
  }

  @computed
  private get sort(): SortParams<LibraryRecord> {
    try {
      const queryParamsSort = route.queryParams?.sort;
      const sort = queryParamsSort && (JSON.parse(queryParamsSort) as string[]);

      return this.props.urlChangeEnabled && queryParamsSort
        ? { field: sort[0], asc: sort[1] === SortOrder.ASC }
        : { field: 'title', asc: true };
    } catch {
      services.logger.error('Ошибка получения значений сортировки');
    }
  }

  @computed
  private get filter() {
    try {
      const queryParamsFilter = route.queryParams?.filter;
      const filter = queryParamsFilter && (JSON.parse(queryParamsFilter) as FilterQuery);

      return this.props.urlChangeEnabled && queryParamsFilter ? filter : { is_folder: { $in: [null, false] } };
    } catch {
      services.logger.error('Ошибка получения значений фильтров');
    }
  }

  @action.bound
  private setHiddenFields(hiddenFields: string[]) {
    this.hiddenFields = hiddenFields;
    this.storeSettings();
  }

  @action.bound
  private setLibraryDocuments(libraryDocuments: LibraryRecord[]) {
    this.libraryDocuments = libraryDocuments;
  }

  @action
  private setError(error: string) {
    this.error = error;
  }

  @action.bound
  private changeHandler(e: React.ChangeEvent<HTMLInputElement>, checked: boolean) {
    const selectedRecord = this.libraryDocuments.find(item => item.id === Number(e.target.value));

    this.props.onSelect(
      checked
        ? [...this.props.checkedLibraryDocuments, selectedRecord]
        : this.props.checkedLibraryDocuments.filter(item => item !== selectedRecord)
    );
  }
}
