import React, { Component, ReactElement } from 'react';
import { action, computed, makeObservable, observable, when } from 'mobx';
import { observer } from 'mobx-react';
import { Checkbox } from '@mui/material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { AxiosError } from 'axios';
import { cloneDeep, isArray } from 'lodash';
import { Subject } from 'rxjs';

import { communicationService } from '../../services/communication.service';
import { Library, LibraryRecord } from '../../services/data/library/library.models';
import { getLibrary, getLibraryRecordsAsRegistry } from '../../services/data/library/library.service';
import { PropertySchema, PropertyType, Schema } from '../../services/data/schema/schema.models';
import { PageOptions } from '../../services/models';
import {
  addFilterPart,
  getFieldFilterValue,
  modifyFieldFilterValue,
  removeFieldFilter
} from '../../services/util/filters/filters';
import { FilterQuery } from '../../services/util/filters/filters.models';
import { calculateValues } from '../../services/util/form/formValidation.utils';
import { SortParams } from '../../services/util/sortObjects';
import { isNumberArray } from '../../services/util/typeGuards/isNumberArray';
import { currentUser } from '../../stores/CurrentUser.store';
import { Counter, CounterItem } from '../Counter/Counter';
import { getIdsFromPath, getPathFilter, registryDefaultFilter } from '../DataManagement/DataManagement.utils';
import { DocumentInfo } from '../Documents/Documents';
import { EmptyListView } from '../EmptyListView/EmptyListView';
import { convertToComplexField } from '../Form/Form.utils';
import { DeletedDocuments } from '../Icons/DeletedDocuments';
import { LibraryDeletedDocumentActions } from '../LibraryDeletedDocumentActions/LibraryDeletedDocumentActions';
import { LibraryDeletedDocumentsSwitch } from '../LibraryDeletedDocumentsSwitch/LibraryDeletedDocumentsSwitch';
import { LibraryDocumentActions } from '../LibraryDocumentActions/LibraryDocumentActions';
import { LibraryViewSwitch } from '../LibraryViewSwitch/LibraryViewSwitch';
import { Loading } from '../Loading/Loading';
import { Registry } from '../Registry/Registry';
import { RegistrySettings } from '../RegistrySettings/RegistrySettings';
import { XTableFilterPanelItemContentProps } from '../XTable/FilterPanelItemContent/XTable-FilterPanelItemContent.base';
import { XTableProps } from '../XTable/XTable';
import { XTableColumn, XTableExtraColumnType } from '../XTable/XTable.models';
import { getXTableColumnsFromSchema } from '../XTable/XTable.utils';
import { LibraryRegistryBreadcrumbs } from './Breadcrumbs/LibraryRegistry-Breadcrumbs';
import { LibraryRegistryExport } from './Export/LibraryRegistry-Export';
import { getBreadcrumbsPathFromFilter } from './LibraryRegistry.util';
import { LibraryRegistryPathFilterPanelItem } from './PathFilterPanelItem/LibraryRegistry-PathFilterPanelItem';

import '!style-loader!css-loader!sass-loader!./LibraryRegistry.scss';

const cnLibraryRegistry = cn('LibraryRegistry');

export interface LibraryRegistryProps {
  id: string;
  libraryTableName: string;
  inDialog?: boolean;
  urlChangeEnabled?: boolean;
  addedDocuments?: DocumentInfo[];
  checkedLibraryDocuments?: LibraryRecord[];
  onSelect?(items: LibraryRecord[]): void;
}

@observer
export default class LibraryRegistry extends Component<LibraryRegistryProps> {
  @observable private library?: Library;
  @observable private hiddenFields: string[] = [];
  @observable private totalItemCounter?: string;
  @observable private tablePageOptions?: PageOptions;
  @observable private libraryDocuments: LibraryRecord[] = [];
  @observable private error?: string;
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
      if (this.tableInvoke?.reload) {
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
        {this.library && (
          <>
            {this.showDeletedDocuments && (
              <div className={cnLibraryRegistry('BreadcrumbsTextTitle')}>
                <DeletedDocuments className={cnLibraryRegistry('BreadcrumbsTextTitleIcon')} color='inherit' />
                Корзина удаленных документов
              </div>
            )}

            {!this.showDeletedDocuments && !this.props.inDialog && this.library && (
              <LibraryRegistryBreadcrumbs
                filter={this.tablePageOptions?.filter || {}}
                library={this.library}
                path={this.breadcrumbsPath}
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
              counter={<Counter setCounters={this.setCounters} totalItemCounter={this.totalItemCounter} />}
              invoke={this.tableInvoke}
              setPageOptions={this.setPageOptions}
              headerActions={
                <>
                  {!this.showDeletedDocuments && (
                    <>
                      {this.props.id === 'registryPage' && this.tablePageOptions && this.library && (
                        <LibraryRegistryExport
                          tablePageOptions={this.tablePageOptions}
                          properties={this.properties}
                          library={this.library}
                          cols={this.cols}
                        />
                      )}
                      <RegistrySettings
                        properties={this.properties}
                        hiddenFields={this.hiddenFields}
                        onChangeHiddenFields={this.setHiddenFields}
                      />
                    </>
                  )}

                  {this.showDeletedDocuments && this.library && this.props.id === 'registryPage' && (
                    <LibraryViewSwitch to='registry' library={this.library} path={this.breadcrumbsPath} />
                  )}

                  {!this.showDeletedDocuments && this.library && this.props.id === 'registryPage' && (
                    <>
                      <LibraryDeletedDocumentsSwitch library={this.library} />
                      <LibraryViewSwitch to='explorer' library={this.library} path={this.breadcrumbsPath} />
                    </>
                  )}
                </>
              }
            />
          </>
        )}
        {!this.library && !this.error && <Loading noBackdrop />}

        {this.error && <EmptyListView text={this.error} />}
      </div>
    );
  }

  private getId(): string {
    return this.props.id + '_LibraryRegistry_' + this.library?.table_name;
  }

  @computed
  private get properties(): PropertySchema[] {
    return (this.library?.schema.properties || []).filter(
      ({ hidden, propertyType }) => !hidden && propertyType !== PropertyType.BINARY
    );
  }

  @computed
  private get breadcrumbsPath(): number[] {
    return getBreadcrumbsPathFromFilter(this.tablePageOptions?.filter || {});
  }

  @computed
  private get cols(): XTableColumn<LibraryRecord>[] {
    const pathProperty = this.library?.schema.properties.find(({ name }) => name === 'path');
    const pathHidden = !pathProperty || pathProperty.hidden;

    if (!this.library) {
      return [];
    }

    const standardFieldsOverrides: XTableColumn<LibraryRecord>[] = [
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
        CellContent: ({ rowData, filterParams }) =>
          this.library && (
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
          ? ({ rowData, filterParams }) =>
              this.library && (
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
    ];

    const checkboxColumn: XTableColumn<LibraryRecord> = {
      CellContent: this.props.inDialog ? this.renderCheck : this.renderActions,
      align: 'center',
      minWidth: 30,
      cellProps: { padding: 'checkbox' }
    };

    const cols: XTableColumn<LibraryRecord>[] = [
      checkboxColumn,
      ...getXTableColumnsFromSchema<LibraryRecord>(this.library.schema, standardFieldsOverrides)
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
  private get showDeletedDocuments() {
    if (this.tablePageOptions?.filter) {
      return !!getFieldFilterValue(this.tablePageOptions?.filter, 'is_deleted');
    }

    return false;
  }

  @action.bound
  private handleBreadcrumbsItemClick(path: unknown) {
    if (!isNumberArray(path)) {
      throw new Error('Невозможные данные');
    }

    const filter = { ...this.tablePageOptions?.filter };

    removeFieldFilter(filter, 'path');
    if (!this.showDeletedDocuments) {
      removeFieldFilter(filter, 'is_deleted');
    }

    if (path.length) {
      addFilterPart(filter, getPathFilter(path));
    }

    if (this.tableInvoke?.setFilter) {
      this.tableInvoke.setFilter(filter);
    }
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
        onChange={this.handleChange}
      />
    );
  }

  @action
  private setLibrary(library: Library) {
    this.library = library;
  }

  @boundMethod
  private async getData(pageOptions: PageOptions): Promise<[LibraryRecord[], number]> {
    if (!this.library) {
      return [[], 1];
    }

    if (pageOptions.filter) {
      const filterById = getFieldFilterValue(pageOptions.filter, 'id') as { $in: number[] } | undefined;
      const modifiedFilter = cloneDeep(pageOptions.filter);

      this.modifyAllFiasFilters(this.library.schema, modifiedFilter);

      pageOptions = {
        ...pageOptions,
        filter: modifiedFilter
      };

      if (filterById) {
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
    }

    const [documents, pages] = await getLibraryRecordsAsRegistry(
      this.library.table_name,
      this.library.schema.name,
      pageOptions
    );

    this.setTotalItemCounter(`Найдено: ${pages.totalElements}`);

    if (this.props.inDialog) {
      this.setLibraryDocuments(documents);
    }

    return [
      documents.map(document => {
        const properties = this.library?.schema.properties || [];
        const documentCalculated = calculateValues<LibraryRecord>(document, properties);

        for (const property of properties) {
          documentCalculated[property.name] = convertToComplexField(property, document);
        }

        return documentCalculated;
      }),
      pages.totalPages
    ];
  }

  // в текущей реализации фильтры для FIAS ведут нестрогий поиск в колонке "__address"
  private modifyAllFiasFilters(schema: Schema, filter: FilterQuery) {
    for (const property of schema.properties) {
      if (property.propertyType === PropertyType.FIAS) {
        const propertyFilterVal = getFieldFilterValue(filter, property.name);

        if (propertyFilterVal && !isArray(propertyFilterVal)) {
          modifyFieldFilterValue(filter, `${property.name}__address`, propertyFilterVal);
          removeFieldFilter(filter, property.name);
        }
      }
    }
  }

  @boundMethod
  private async setCounters(): Promise<CounterItem[]> {
    if (!this.library) {
      return [];
    }

    let counterInfo: CounterItem[] = [];
    if (this.tablePageOptions) {
      const clonedOptionsWithFilters = cloneDeep(this.tablePageOptions);
      const clonedOptionsWithoutFilters = cloneDeep(this.tablePageOptions);
      const currentIsFolderFilter = getFieldFilterValue(this.tablePageOptions.filter || {}, 'is_folder');
      clonedOptionsWithoutFilters.filter = { $and: [] };
      clonedOptionsWithoutFilters.pageSize = 1;
      addFilterPart(clonedOptionsWithoutFilters.filter, getPathFilter(this.breadcrumbsPath));

      if (clonedOptionsWithFilters.filter) {
        modifyFieldFilterValue(clonedOptionsWithFilters.filter, 'is_folder', { $in: [null, false] });
      }
      modifyFieldFilterValue(clonedOptionsWithoutFilters.filter, 'is_folder', { $in: [null, false] });

      const [, documentsTotal] = await getLibraryRecordsAsRegistry(
        this.library.table_name,
        this.library.schema.name,
        clonedOptionsWithoutFilters
      );
      counterInfo = [{ title: 'Всего документов: ', value: documentsTotal.totalElements }];

      const [, filteredDocuments] = await getLibraryRecordsAsRegistry(
        this.library.table_name,
        this.library.schema.name,
        clonedOptionsWithFilters
      );

      counterInfo.push({
        title: 'Найдено документов: ',
        value: currentIsFolderFilter === true ? 0 : filteredDocuments.totalElements
      });

      if (clonedOptionsWithFilters.filter) {
        modifyFieldFilterValue(clonedOptionsWithFilters.filter, 'is_folder', true);
      }
      modifyFieldFilterValue(clonedOptionsWithoutFilters.filter, 'is_folder', true);
      const [, foldersTotal] = await getLibraryRecordsAsRegistry(
        this.library.table_name,
        this.library.schema.name,
        clonedOptionsWithoutFilters
      );
      counterInfo.push({ title: 'Всего папок: ', value: foldersTotal.totalElements });

      const [, filteredFolders] = await getLibraryRecordsAsRegistry(
        this.library.table_name,
        this.library.schema.name,
        clonedOptionsWithFilters
      );

      counterInfo.push({
        title: 'Найдено папок: ',
        value: currentIsFolderFilter === true || currentIsFolderFilter === undefined ? filteredFolders.totalElements : 0
      });
    }

    return counterInfo;
  }

  private getStorageKey(): string {
    return `registrySettings_${currentUser.id}_${this.library?.table_name}_${this.props.id}`;
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

  @action
  private setTotalItemCounter(totalItemCounter: string) {
    this.totalItemCounter = totalItemCounter;
  }

  @action.bound
  private handleChange(e: React.ChangeEvent<HTMLInputElement>, checked: boolean) {
    const selectedRecord = this.libraryDocuments.find(item => item.id === Number(e.target.value));

    if (!selectedRecord) {
      throw new Error('Нет выбранных документов');
    }

    const { checkedLibraryDocuments = [], onSelect } = this.props;

    if (onSelect) {
      onSelect(
        checked
          ? [...checkedLibraryDocuments, selectedRecord]
          : checkedLibraryDocuments.filter(item => item !== selectedRecord)
      );
    }
  }
}
