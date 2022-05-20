import React, { Component, ReactElement } from 'react';
import { action, computed, observable, when } from 'mobx';
import { observer } from 'mobx-react';
import { Checkbox } from '@mui/material';
import { Check, Close, HomeOutlined } from '@mui/icons-material';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';

import { route } from '../../stores/Route.store';
import { currentUser } from '../../stores/CurrentUser.store';
import {
  PropertySchema,
  PropertySchemaChoice,
  PropertySchemaDatetime,
  PropertySchemaDocument,
  PropertySchemaUrl,
  PropertyType,
  Schema
} from '../../services/crg/schema.models';
import { DocumentLibrary, getLibrary, getLibraryRecords2, LibraryRecord } from '../../services/crg/doc-library.service';
import { communicationService } from '../../services/communication.service';
import { calculateValues } from '../../services/crg/formValidation.service';
import { getFieldRelations } from '../../services/crg/schema.utils';
import { schemaService } from '../../services/crg/schema.service';
import { FilterQuery } from '../../services/util/filterObjects';
import { SortParams } from '../../services/util/sortObjects';
import { PageOptions, SortDir } from '../../services/models';
import { formatDate } from '../../services/util/date.util';
import { services } from '../../services/services';
import { LibraryDocumentActions } from '../LibraryDocumentActions/LibraryDocumentActions.composed';
import { RelatedDocumentsButton } from '../RelatedDocumentsButton/RelatedDocumentsButton';
import { BreadcrumbsItemData } from '../Breadcrumbs/Item/Breadcrumbs-Item';
import { DocumentInfo, Documents } from '../Documents/Documents';
import { FilterType } from '../XTable/Filter/XTable-Filter';
import { Breadcrumbs } from '../Breadcrumbs/Breadcrumbs';
import { XTable, XTableColumn } from '../XTable/XTable';
import { UrlsList } from '../UrlsList/UrlsList';
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
  @observable private filteredCols: string[] = [];

  private tableInvoke: { reload?(): void } = {};

  async componentDidMount() {
    this.setLibrary(await getLibrary(this.props.libraryId));
    this.setSchema(await schemaService.getSchema(this.library.schemaId));

    communicationService.libraryItemsUpdated.on(() => {
      if (this.tableInvoke.reload) {
        this.tableInvoke.reload();
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
        {this.ready ? (
          <>
            {!this.props.inDialog && <Breadcrumbs itemsType='link' items={this.breadcrumbsItems} />}
            <XTable<LibraryRecord>
              className={cnLibraryRegistry('Table')}
              cols={this.cols}
              hiddenFields={this.hiddenFields}
              getData={this.getData}
              getRowId={this.getRowId}
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
        ) : (
          <Loading noBackdrop />
        )}
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
    const sortableTypes = new Set([
      PropertyType.BOOL,
      PropertyType.CALCULATED,
      PropertyType.CHOICE,
      PropertyType.DATETIME,
      PropertyType.DURATION,
      PropertyType.FLOAT,
      PropertyType.INT,
      PropertyType.STRING,
      PropertyType.TIME
    ]);

    const filterableTypes = new Set([
      PropertyType.BOOL,
      PropertyType.CHOICE,
      PropertyType.DATETIME,
      PropertyType.FLOAT,
      PropertyType.INT,
      PropertyType.STRING
    ]);

    const typesCols: Partial<Record<PropertyType, Partial<XTableColumn<LibraryRecord>>>> = {
      [PropertyType.BOOL]: { align: 'center', CellContent: this.renderBool, filterType: FilterType.BOOL },
      [PropertyType.URL]: { CellContent: this.renderLink },
      [PropertyType.DOCUMENT]: { CellContent: this.renderDocuments },
      [PropertyType.CHOICE]: {
        filterType: FilterType.CHOICE,
        CellContent: ({ rowData, field }) => (
          <>
            {(
              this.properties.find(
                ({ name, propertyType }) => name === field && propertyType === PropertyType.CHOICE
              ) as PropertySchemaChoice
            )?.options.find(({ value }) => value === rowData[field])?.title || rowData[field]}
          </>
        )
      },
      [PropertyType.DATETIME]: { filterType: FilterType.DATETIME, CellContent: this.renderDate, align: 'center' },
      [PropertyType.INT]: { align: 'right', filterType: FilterType.FLOAT },
      [PropertyType.FLOAT]: { align: 'right', filterType: FilterType.FLOAT },
      [PropertyType.STRING]: { filterType: FilterType.STRING }
    };

    return [
      {
        CellContent: this.props.inDialog ? this.renderCheck : this.renderActions,
        align: 'center',
        cellProps: { padding: 'checkbox' }
      },
      ...this.properties.map(property => ({
        field: property.name,
        title: property.title,
        description: property.description,
        sortable: sortableTypes.has(property.propertyType),
        filterable: filterableTypes.has(property.propertyType) && property.name !== 'id',
        ...typesCols[property.propertyType],
        filterOptions: property.propertyType === PropertyType.CHOICE ? property.options : undefined,
        headerCellProps: { style: property.minWidth ? { minWidth: String(property.minWidth) + 'px' } : null },
        cellProps: {
          classes: {
            root: cnLibraryRegistry('Cell', { withRelations: !!getFieldRelations(property.name, this.schema).length })
          }
        },
        AfterCellContent: this.renderRelations
      }))
    ];
  }

  @computed
  private get ready(): boolean {
    return Boolean(this.library && this.schema);
  }

  private renderBool({ rowData, field }: { rowData: LibraryRecord; field: keyof LibraryRecord }): ReactElement {
    const value = ['true', '1'].includes(String(rowData[field]).toLowerCase());

    return value ? <Check color='primary' fontSize='small' /> : <Close color='disabled' fontSize='small' />;
  }

  @boundMethod
  private renderRelations({ rowData, field }: { rowData: LibraryRecord; field: keyof LibraryRecord }): ReactElement {
    const relations = getFieldRelations(field, this.schema);

    if (!relations.length) {
      return null;
    }

    return (
      <RelatedDocumentsButton
        obj={rowData}
        relations={relations}
        className={cnLibraryRegistry('Relations')}
        size='small'
      />
    );
  }

  @boundMethod
  private renderLink({ rowData, field }: { rowData: LibraryRecord; field: keyof LibraryRecord }): ReactElement {
    return rowData[field] ? (
      <UrlsList
        property={this.schema?.properties?.find(({ name }) => name === field) as PropertySchemaUrl}
        value={String(rowData[field])}
      />
    ) : (
      <></>
    );
  }

  @boundMethod
  private renderDocuments({ rowData, field }: { rowData: LibraryRecord; field: keyof LibraryRecord }): ReactElement {
    let value: DocumentInfo[] = [];

    try {
      value = JSON.parse(String(rowData[field])) as DocumentInfo[];
    } catch {}

    return rowData[field] ? (
      <Documents
        property={this.schema?.properties?.find(({ name }) => name === field) as PropertySchemaDocument}
        value={value}
      />
    ) : (
      <></>
    );
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

  @boundMethod
  private renderDate({ rowData, field }: { rowData: LibraryRecord; field: keyof LibraryRecord }): ReactElement {
    const property = this.properties.find(({ name }) => name === field) as PropertySchemaDatetime;
    const date = formatDate(rowData[field], property.format);

    return <>{date}</>;
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

    const { sort, sortDir, filter } = pageOptions;
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

  private getRowId(rowData: LibraryRecord) {
    return rowData.id;
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

  @computed
  private get sort(): SortParams<LibraryRecord> {
    try {
      const queryParamsSort = route.queryParams?.sort;
      const sort = queryParamsSort && (JSON.parse(queryParamsSort) as string[]);

      return this.props.urlChangeEnabled && queryParamsSort
        ? { field: sort[0], asc: sort[1] === SortDir.ASC }
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
