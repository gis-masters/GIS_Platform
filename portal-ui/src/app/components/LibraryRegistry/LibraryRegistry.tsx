import React, { Component, ReactElement, useEffect, useState } from 'react';
import { action, computed, observable, when, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { Subject, takeUntil } from 'rxjs';
import { NavigationEnd, RouterEvent } from '@angular/router';
import { Checkbox } from '@mui/material';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';
import { AxiosError } from 'axios';

import { route } from '../../stores/Route.store';
import { currentUser } from '../../stores/CurrentUser.store';
import { getXTableColumnsFromSchema } from '../XTable/XTable.utils';
import { PropertySchema, PropertyType, Schema } from '../../services/data/schema.models';
import { communicationService } from '../../services/communication.service';
import { calculateValues } from '../../services/formValidation.service';
import { schemaService } from '../../services/data/schema.service';
import { FilterQuery } from '../../services/util/filterObjects';
import { PageOptions, SortOrder } from '../../services/models';
import { SortParams } from '../../services/util/sortObjects';
import { services } from '../../services/services';
import {
  DocumentLibrary,
  getLibrary,
  getLibraryRecord,
  getLibraryRecords2,
  LibraryRecord
} from '../../services/data/doc-library.service';
import { getIdsFromPath, getPathFromIds, registryDefaultFilter } from '../DataManagement/DataManagement.utils';
import { LibraryDocumentActions } from '../LibraryDocumentActions/LibraryDocumentActions';
import { LibraryViewSwitch } from '../LibraryViewSwitch/LibraryViewSwitch';
import { XTable, XTableColumn, XTableProps } from '../XTable/XTable';
import { EmptyListView } from '../EmptyListView/EmptyListView';
import { DocumentInfo } from '../Documents/Documents';
import { Loading } from '../Loading/Loading';

import { LibraryRegistryExport } from './Export/LibraryRegistry-Export';
import { LibraryRegistrySettings } from './Settings/LibraryRegistry-Settings';
import { LibraryRegistryBreadcrumbs } from './Breadcrumbs/LibraryRegistry-Breadcrumbs';

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
  private defaultSort: SortParams<LibraryRecord> = { field: 'title', asc: true };
  private defaultFilter: FilterQuery = registryDefaultFilter;
  private unsubscribe$: Subject<void> = new Subject<void>();
  private tableInvoke: XTableProps<LibraryRecord>['invoke'] = {};
  private selfInitedNavigationIds: number[] = [];

  constructor(props: LibraryRegistryProps) {
    super(props);
    makeObservable(this);

    if (props.urlChangeEnabled) {
      this.defaultSort = this.getSortFromUrl();
      this.defaultFilter = this.getFilterFromUrl();
    }
  }

  async componentDidMount() {
    await this.getInfo();

    communicationService.libraryItemsUpdated.on(async () => {
      if (this.tableInvoke.reload) {
        await this.tableInvoke.reload();
      }
    });

    if (this.props.urlChangeEnabled) {
      services.router.events.pipe(takeUntil(this.unsubscribe$)).subscribe((e: RouterEvent) => {
        if (e instanceof NavigationEnd) {
          if (this.selfInitedNavigationIds.includes(e.id)) {
            this.selfInitedNavigationIds.splice(this.selfInitedNavigationIds.indexOf(e.id), 1);

            return;
          }

          this.tableInvoke.setSort(this.getSortFromUrl());
          this.tableInvoke.setFilter(this.getFilterFromUrl());
        }
      });
    }

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
                onItemClick={this.handleBreadcrumbsItemClick}
                fromHome
              />
            )}
            <XTable<LibraryRecord>
              className={cnLibraryRegistry('Table')}
              cols={this.cols}
              id={this.getId()}
              getData={this.getData}
              defaultSort={this.defaultSort}
              secondarySortField='id'
              filtersAlwaysEnabled
              showFiltersPanel
              defaultFilter={this.defaultFilter}
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
                  <LibraryViewSwitch to='explorer' library={this.library} path={this.breadcrumbsPath} />
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

  private getId(): string {
    return this.props.id + '_LibraryRegistry_' + this.library.identifier;
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
    return getIdsFromPath((this.tablePageOptions?.filter?.path as FilterQuery)?.$ilike as string);
  }

  @computed
  private get cols(): XTableColumn<LibraryRecord>[] {
    return [
      {
        CellContent: this.props.inDialog ? this.renderCheck : this.renderActions,
        align: 'center',
        cellProps: { padding: 'checkbox' }
      },
      ...getXTableColumnsFromSchema<LibraryRecord>(this.schema, [
        {
          field: 'path',
          type: PropertyType.CUSTOM,
          CellContent: ({ rowData, filterParams }) => (
            <LibraryRegistryBreadcrumbs
              filter={filterParams}
              path={getIdsFromPath(rowData.path)}
              library={this.library}
              onItemClick={this.handleBreadcrumbsItemClick}
              size='small'
            />
          ),
          CustomFilterPanelItemComponent:
            !!this.breadcrumbsPath?.at(-1) &&
            observer(() => {
              const [data, setData] = useState<LibraryRecord>();
              const id = this.breadcrumbsPath.at(-1);

              useEffect(() => {
                void (async () => {
                  if (this.library?.identifier && id) {
                    const result = await getLibraryRecord(this.library?.identifier, id);
                    setData(result);
                  }
                })();
              });

              return <span>{data?.title}</span>;
            })
        }
      ])
    ].map((item: XTableColumn<LibraryRecord>) => ({
      ...item,
      hidden: this.hiddenFields.includes(String(item.field)) || item.hidden
    }));
  }

  @computed
  private get ready(): boolean {
    return Boolean(this.library && this.schema);
  }

  @boundMethod
  private handleBreadcrumbsItemClick(path: number[]) {
    const filter = { ...this.tablePageOptions?.filter };

    if (path.length) {
      filter.path = { $ilike: getPathFromIds(path) };
    } else {
      delete filter.path;
    }
    this.tableInvoke.setFilter(filter);
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
  private handleTablePageOptionsChange(pageOptions: PageOptions) {
    this.tablePageOptions = pageOptions;

    const { sort, sortOrder: sortDir, filter } = pageOptions;
    const encodedSort = JSON.stringify([sort, sortDir]);
    const encodedFilter = JSON.stringify(filter);

    services.ngZone.run(() => {
      void services.router.navigate([location.pathname], {
        queryParams: {
          sort: encodedSort,
          filter: encodedFilter
        },
        queryParamsHandling: 'merge',
        replaceUrl: true
      });

      const currentNavigation = services.router.getCurrentNavigation();
      if (currentNavigation) {
        this.selfInitedNavigationIds.push(currentNavigation.id);
      }
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

  private getSortFromUrl(): SortParams<LibraryRecord> | undefined {
    try {
      const queryParamsSort = route.queryParams?.sort;
      const sort = queryParamsSort && (JSON.parse(queryParamsSort) as string[]);

      return sort && { field: sort[0], asc: sort[1] === SortOrder.ASC };
    } catch {
      services.logger.warn('LibraryRegistry: не удалось восстановить параметры сортировки из url');
    }
  }

  private getFilterFromUrl(): FilterQuery {
    try {
      const queryParamsFilter = route.queryParams?.filter;

      return queryParamsFilter && (JSON.parse(queryParamsFilter) as FilterQuery);
    } catch {
      services.logger.warn('LibraryRegistry: не удалось восстановить параметры фильтрации из url');
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
