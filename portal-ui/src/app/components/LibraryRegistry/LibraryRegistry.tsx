import React, { Component, ReactElement } from 'react';
import { action, computed, observable, when } from 'mobx';
import { observer } from 'mobx-react';
import { Check, Close, HomeOutlined } from '@mui/icons-material';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';

import { route } from '../../stores/Route.store';
import { currentUser } from '../../stores/CurrentUser.store';
import {
  PropertySchema,
  PropertySchemaChoice,
  PropertySchemaDatetime,
  PropertyType
} from '../../services/crg/schema.models';
import { DocumentLibrary, getLibrary, getLibraryRecords2, LibraryRecord } from '../../services/crg/doc-library.service';
import { OldFeatureDescription } from '../../services/crg/schemaOld.models';
import { communicationService } from '../../services/communication.service';
import { schemaService } from '../../services/crg/schema.service';
import { convertSchema } from '../../services/crg/schema.utils';
import { formatDate } from '../../services/util/date.util';
import { PageOptions } from '../../services/models';
import { LibraryDocumentActions } from '../LibraryDocumentActions/LibraryDocumentActions.composed';
import { BreadcrumbsItemData } from '../Breadcrumbs/Item/Breadcrumbs-Item';
import { FilterType } from '../XTable/Filter/XTable-Filter';
import { Breadcrumbs } from '../Breadcrumbs/Breadcrumbs';
import { XTable, XTableColumn } from '../XTable/XTable';
import { Loading } from '../Loading/Loading';

import { LibraryRegistrySettings } from './Settings/LibraryRegistry-Settings';
import { LibraryRegistryExport } from './Export/LibraryRegistry-Export';

import '!style-loader!css-loader!sass-loader!./LibraryRegistry.scss';

const cnLibraryRegistry = cn('LibraryRegistry');

@observer
export class LibraryRegistry extends Component {
  @observable private library?: DocumentLibrary;
  @observable private schema?: OldFeatureDescription;
  @observable private hiddenFields: string[] = [];
  @observable private tablePageOptions?: PageOptions;

  private tableInvoke: { reload?(): void } = {};

  async componentDidMount() {
    const { libraryId } = route.params;
    this.setLibrary(await getLibrary(libraryId));
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
            <Breadcrumbs itemsType='link' items={this.breadcrumbsItems} />
            <XTable<LibraryRecord>
              className={cnLibraryRegistry('Table')}
              cols={this.cols.filter(({ field }) => !this.hiddenFields.includes(String(field)))}
              getData={this.getData}
              getRowId={this.getRowId}
              defaultSort={{ field: 'title', asc: true }}
              secondarySortField='id'
              filtersAlwaysEnabled
              defaultFilter={{ is_folder: { $in: [null, false] } }}
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
    return convertSchema(this.schema?.properties || []).filter(
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
      { CellContent: this.renderActions, align: 'center', cellProps: { padding: 'checkbox' } },
      ...this.properties.map(property => ({
        field: property.name,
        title: property.title,
        description: property.description,
        sortable: sortableTypes.has(property.propertyType),
        filterable: filterableTypes.has(property.propertyType) && property.name !== 'id',
        ...typesCols[property.propertyType],
        filterOptions: property.propertyType === PropertyType.CHOICE ? property.options : undefined,
        headerCellProps: { style: property.minWidth ? { minWidth: String(property.minWidth) + 'px' } : null }
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

  private renderActions({ rowData }: { rowData: LibraryRecord }): ReactElement {
    return <LibraryDocumentActions className={cnLibraryRegistry('Actions')} document={rowData} as='menu' />;
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
  private setSchema(schema: OldFeatureDescription) {
    this.schema = schema;
  }

  @boundMethod
  private async getData(pageOptions: PageOptions): Promise<[LibraryRecord[], number]> {
    if (!this.library || !this.schema) {
      return [[], 1];
    }

    return await getLibraryRecords2(this.library.identifier, this.schema.name, pageOptions);
  }

  @action.bound
  private handleTablePageOptionsChange(pageOptions: PageOptions) {
    this.tablePageOptions = pageOptions;
  }

  private getRowId(rowData: LibraryRecord) {
    return rowData.id;
  }

  private getStorageKey(): string {
    return `registrySettings_${currentUser.id}_${this.library.identifier}`;
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

  @action.bound
  private setHiddenFields(hiddenFields: string[]) {
    this.hiddenFields = hiddenFields;
    this.storeSettings();
  }
}
