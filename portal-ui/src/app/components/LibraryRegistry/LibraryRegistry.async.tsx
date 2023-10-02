import React, { Component, ReactElement } from 'react';
import { action, computed, observable, when, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { Subject } from 'rxjs';
import { cloneDeep } from 'lodash';
import { Checkbox } from '@mui/material';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';
import { AxiosError } from 'axios';

import { currentUser } from '../../stores/CurrentUser.store';
import { getXTableColumnsFromSchema } from '../XTable/XTable.utils';
import { PropertySchema, PropertyType, Schema } from '../../services/data/schema/schema.models';
import { communicationService } from '../../services/communication.service';
import { calculateValues } from '../../services/formValidation.service';
import { schemaService } from '../../services/data/schema/schema.service';
import {
  addFilterPart,
  FilterQuery,
  getFieldFilterValue,
  modifyFieldFilterValue,
  removeFieldFilter
} from '../../services/util/filterObjects';
import { PageOptions } from '../../services/models';
import { SortParams } from '../../services/util/sortObjects';
import { XTableFilterPanelItemContentProps } from '../XTable/FilterPanelItemContent/XTable-FilterPanelItemContent.base';
import { LibraryDeletedDocumentActions } from '../LibraryDeletedDocumentActions/LibraryDeletedDocumentActions';
import { getIdsFromPath, getPathFilter, registryDefaultFilter } from '../DataManagement/DataManagement.utils';
import { getLibrary, getLibraryRecordsAsRegistry } from '../../services/data/docLibrary/docLibrary.service';
import { DocumentLibrary, LibraryRecord } from '../../services/data/docLibrary/docLibrary.models';
import { LibraryDocumentActions } from '../LibraryDocumentActions/LibraryDocumentActions';
import { XTableColumn, XTableExtraColumnType } from '../XTable/XTable.models';
import { LibraryViewSwitch } from '../LibraryViewSwitch/LibraryViewSwitch';
import { EmptyListView } from '../EmptyListView/EmptyListView';
import { DeletedDocuments } from '../Icons/DeletedDocuments';
import { convertToComplexField } from '../Form/Form.utils';
import { DocumentInfo } from '../Documents/Documents';
import { Registry } from '../Registry/Registry';
import { XTableProps } from '../XTable/XTable';
import { Loading } from '../Loading/Loading';

import { getBreadcrumbsPathFromFilter } from './LibraryRegistry.util';
import { LibraryRegistryExport } from './Export/LibraryRegistry-Export';
import { LibraryRegistrySettings } from './Settings/LibraryRegistry-Settings';
import { LibraryRegistryBreadcrumbs } from './Breadcrumbs/LibraryRegistry-Breadcrumbs';
import { LibraryRegistryPathFilterPanelItem } from './PathFilterPanelItem/LibraryRegistry-PathFilterPanelItem';
import { LibraryDeletedDocumentsSwitch } from '../LibraryDeletedDocumentsSwitch/LibraryDeletedDocumentsSwitch';

import '!style-loader!css-loader!sass-loader!./LibraryRegistry.scss';

const cnLibraryRegistry = cn('LibraryRegistry');

export interface LibraryRegistryProps {
  id: string;
  libraryTableName: string;
  inDialog?: boolean;
  urlChangeEnabled?: boolean;
  addedDocuments?: DocumentInfo[];
  checkedLibraryDocuments?: LibraryRecord[];
  onSelect?: (items: LibraryRecord[]) => void;
}

@observer
export default class LibraryRegistry extends Component<LibraryRegistryProps> {
  @observable private library?: DocumentLibrary;
  @observable private schema?: Schema;
  @observable private hiddenFields: string[] = [];
  @observable private tablePageOptions?: PageOptions;
  @observable private libraryDocuments: LibraryRecord[] = [];
  @observable private error: string;
  private defaultSort: SortParams<LibraryRecord> = { field: 'title', asc: true };
  private defaultFilter: FilterQuery = registryDefaultFilter;
  private unsubscribe$: Subject<void> = new Subject<void>();
  private tableInvoke: XTableProps<LibraryRecord>['invoke'] = {};

  constructor(props: LibraryRegistryProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount() {
    await this.getInfo();

    communicationService.libraryRecordUpdated.on(async () => {
      if (this.tableInvoke.reload) {
        await this.tableInvoke.reload();
      }
    });

    await this.restoreSettings();
  }

  componentWillUnmount() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    communicationService.off(this);
  }

  render() {
    return (
      <div className={cnLibraryRegistry()}>
        {this.ready && (
          <>
            {!this.props.inDialog && (
              <LibraryRegistryBreadcrumbs
                filter={this.tablePageOptions?.filter}
                library={this.library}
                path={this.breadcrumbsPath}
                additionalItem={
                  this.showDeletedDocuments && (
                    <div className={cnLibraryRegistry('BreadcrumbsTextTitle')}>
                      <DeletedDocuments className={cnLibraryRegistry('BreadcrumbsTextTitleIcon')} color='inherit' />
                      Корзина
                    </div>
                  )
                }
                onItemClick={this.handleBreadcrumbsItemClick}
                fromHome
              />
            )}

            <Registry<LibraryRecord>
              className={cnLibraryRegistry('Table')}
              cols={this.cols}
              id={this.getId()}
              getData={this.getData}
              defaultSort={this.defaultSort}
              secondarySortField='id'
              filtersAlwaysEnabled
              showFiltersPanel
              inDialog={this.props.inDialog}
              urlChangeEnabled
              defaultFilter={this.defaultFilter}
              invoke={this.tableInvoke}
              setPageOptions={this.setPageOptions}
              headerActions={
                <>
                  {!this.showDeletedDocuments && (
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
                  )}
                  <LibraryDeletedDocumentsSwitch
                    library={this.library}
                    showDeletedDocuments={this.showDeletedDocuments}
                    path={this.breadcrumbsPath}
                  />

                  {!this.showDeletedDocuments && (
                    <LibraryViewSwitch to='explorer' library={this.library} path={this.breadcrumbsPath} />
                  )}
                </>
              }
            />
          </>
        )}
        {!this.ready && !this.error && <Loading noBackdrop />}

        {this.error && <EmptyListView text={this.error} />}
      </div>
    );
  }

  private getId(): string {
    return this.props.id + '_LibraryRegistry_' + this.library.table_name;
  }

  @computed
  private get properties(): PropertySchema[] {
    return (this.schema?.properties || []).filter(
      ({ hidden, propertyType }) =>
        !hidden && propertyType !== PropertyType.BINARY && propertyType !== PropertyType.FIAS
    );
  }

  @computed
  private get breadcrumbsPath(): number[] {
    return getBreadcrumbsPathFromFilter(this.tablePageOptions?.filter || {});
  }

  @computed
  private get cols(): XTableColumn<LibraryRecord>[] {
    const pathProperty = this.schema.properties.find(({ name }) => name === 'path');
    const pathHidden = !pathProperty || pathProperty.hidden;
    const cols: XTableColumn<LibraryRecord>[] = [
      {
        CellContent: this.props.inDialog ? this.renderCheck : this.renderActions,
        align: 'center',
        minWidth: 60,
        cellProps: { padding: 'checkbox' }
      },
      ...getXTableColumnsFromSchema<LibraryRecord>(this.schema, [
        {
          field: 'id',
          type: XTableExtraColumnType.ID
        },
        {
          field: 'is_deleted',
          hidden: true,
          type: PropertyType.BOOL
        },
        {
          field: 'path',
          type: PropertyType.CUSTOM,
          CellContent: ({ rowData, filterParams }) => (
            <LibraryRegistryBreadcrumbs
              size='small'
              filter={filterParams}
              library={this.library}
              path={getIdsFromPath(rowData.path)}
              onItemClick={this.handleBreadcrumbsItemClick}
            />
          ),
          CustomFilterPanelItemComponent: observer((props: XTableFilterPanelItemContentProps<LibraryRecord>) => (
            <LibraryRegistryPathFilterPanelItem library={this.library} {...props} />
          )),
          width: 150
        },
        {
          field: 'title',
          AfterCellContent: pathHidden
            ? ({ rowData, filterParams }) => (
                <LibraryRegistryBreadcrumbs
                  size='small'
                  filter={filterParams}
                  library={this.library}
                  path={getIdsFromPath(rowData.path)}
                  onItemClick={this.handleBreadcrumbsItemClick}
                  menuButtonOnly
                />
              )
            : undefined
        }
      ])
    ].map((item: XTableColumn<LibraryRecord>) => ({
      ...item,
      hidden: this.hiddenFields.includes(String(item.field)) || item.hidden
    }));

    if (pathHidden) {
      const pathColIndex = cols.findIndex(({ field }) => field === 'path');
      if (pathColIndex !== -1) {
        cols.splice(pathColIndex, 1);
      }
    }

    return cols;
  }

  @computed
  private get ready(): boolean {
    return Boolean(this.library && this.schema);
  }

  @computed
  private get showDeletedDocuments() {
    if (this.tablePageOptions?.filter) {
      return !!getFieldFilterValue(this.tablePageOptions?.filter, 'is_deleted');
    }

    return false;
  }

  @action.bound
  private handleBreadcrumbsItemClick(path: number[]) {
    const filter = { ...this.tablePageOptions?.filter };

    removeFieldFilter(filter, 'path');
    removeFieldFilter(filter, 'is_deleted');

    if (path.length) {
      addFilterPart(filter, getPathFilter(path));
    }
    this.tableInvoke.setFilter(filter);
  }

  @boundMethod
  private renderActions({ rowData }: { rowData: LibraryRecord }): ReactElement {
    return this.showDeletedDocuments ? (
      <LibraryDeletedDocumentActions className={cnLibraryRegistry('Actions')} document={rowData} as='menu' />
    ) : (
      <LibraryDocumentActions className={cnLibraryRegistry('Actions')} document={rowData} as='menu' />
    );
  }

  @boundMethod
  private renderCheck({ rowData }: { rowData: LibraryRecord }): ReactElement {
    const { addedDocuments, checkedLibraryDocuments } = this.props;

    const checked =
      checkedLibraryDocuments?.some(item => item.id === rowData.id) ||
      addedDocuments?.some(item => item.id === rowData.id);

    return (
      <Checkbox
        disabled={addedDocuments?.some(item => item.id === rowData.id)}
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

    const filterById = getFieldFilterValue(pageOptions.filter, 'id') as { $in: number[] } | undefined;
    if (filterById) {
      const modifiedFilter = cloneDeep(pageOptions.filter);

      modifyFieldFilterValue(modifiedFilter, 'id');
      pageOptions = {
        ...pageOptions,
        filter: modifiedFilter,
        queryParams: {
          ...pageOptions.queryParams,
          recordId: filterById.$in.join(',')
        }
      };
    }

    const [documents, totalPages] = await getLibraryRecordsAsRegistry(
      this.library.table_name,
      this.schema.name,
      pageOptions
    );

    if (this.props.inDialog) {
      this.setLibraryDocuments(documents);
    }

    return [
      documents.map(document => {
        const properties = this.schema?.properties || [];
        const documentCalculated = calculateValues<LibraryRecord>(document, properties);

        for (const property of properties) {
          documentCalculated[property.name] = convertToComplexField(property, document);
        }

        return documentCalculated;
      }),
      totalPages
    ];
  }

  private getStorageKey(): string {
    return `registrySettings_${currentUser.id}_${this.library.table_name}_${this.props.id}`;
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
      this.setLibrary(await getLibrary(this.props.libraryTableName));
      this.setSchema(await schemaService.getSchema(this.library.schemaId));
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;

      this.setError(err?.response?.data?.message || err?.message);
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

  @action.bound
  private setPageOptions(pageOptions: PageOptions) {
    this.tablePageOptions = pageOptions;
  }

  @action
  private setError(error: string) {
    this.error = error;
  }

  @action.bound
  private changeHandler(e: React.ChangeEvent<HTMLInputElement>, checked: boolean) {
    const selectedRecord = this.libraryDocuments.find(item => item.id === Number(e.target.value));

    if (!selectedRecord) {
      throw new Error('Нет выбранных документов');
    }

    this.props.onSelect(
      checked
        ? [...this.props.checkedLibraryDocuments, selectedRecord]
        : this.props.checkedLibraryDocuments.filter(item => item !== selectedRecord)
    );
  }
}
