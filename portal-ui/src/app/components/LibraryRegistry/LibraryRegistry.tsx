import React, { Component, ReactElement } from 'react';
import { action, computed, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Check, Close, HomeOutlined } from '@mui/icons-material';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';

import { route } from '../../stores/Route.store';
import { DocumentLibrary, getLibrary, getLibraryRecords2, LibraryRecord } from '../../services/crg/doc-library.service';
import { PropertySchema, PropertyType } from '../../services/crg/schema.models';
import { OldFeatureDescription } from '../../services/crg/schemaOld.models';
import { communicationService } from '../../services/communication.service';
import { schemaService } from '../../services/crg/schema.service';
import { FilterParams } from '../../services/util/filterObjects';
import { convertSchema } from '../../services/crg/schema.utils';
import { PageOptions } from '../../services/models';
import { LibraryDocumentActions } from '../LibraryDocumentActions/LibraryDocumentActions.composed';
import { BreadcrumbsItemData } from '../Breadcrumbs/Item/Breadcrumbs-Item';
import { LibraryDocument } from '../LibraryDocument/LibraryDocument';
import { Breadcrumbs } from '../Breadcrumbs/Breadcrumbs';
import { XTable, XTableColumn } from '../XTable/XTable';
import { Loading } from '../Loading/Loading';

import '!style-loader!css-loader!sass-loader!./LibraryRegistry.scss';

const cnLibraryRegistry = cn('LibraryRegistry');

@observer
export class LibraryRegistry extends Component {
  @observable private library?: DocumentLibrary;
  @observable private schema?: OldFeatureDescription;

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
              cols={this.cols}
              getData={this.getData}
              defaultSort={{ field: 'title', asc: true }}
              secondarySortField='id'
              filtersAlwaysEnabled
              invoke={this.tableInvoke}
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
    return convertSchema(this.schema?.properties || []);
  }

  @computed
  private get breadcrumbsItems(): BreadcrumbsItemData[] {
    const libraryRootUrlItems = [
      ['root', 'root'],
      ['libraryRoot', 'libraryRoot']
    ];
    const libraryRootPath = JSON.stringify([...libraryRootUrlItems, ['', '', 0]]);
    const libraryPath = JSON.stringify([...libraryRootUrlItems, ['library', this.library?.identifier, 0], ['', '', 0]]);

    return [
      { title: <HomeOutlined />, url: '/data-management' },
      {
        title: 'Библиотеки',
        url: `/data-management?explorerPath_DataManagement=${libraryRootPath}`
      },
      {
        title: this.library?.title,
        url: `/data-management?explorerPath_DataManagement=${libraryPath}`
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

    const filterableTypes = new Set([PropertyType.STRING, PropertyType.CHOICE]);

    const typesCols: Partial<Record<PropertyType, Partial<XTableColumn<LibraryRecord>>>> = {
      [PropertyType.BOOL]: { align: 'center', CellContent: this.renderBool },
      [PropertyType.INT]: { align: 'right' },
      [PropertyType.FLOAT]: { align: 'right' }
    };

    return [
      { CellContent: this.renderActions, align: 'center', cellProps: { padding: 'checkbox' } },
      ...this.properties
        .filter(({ hidden, propertyType }) => !hidden && propertyType !== PropertyType.BINARY)
        .map(({ name, title, propertyType }) => ({
          field: name,
          title,
          sortable: sortableTypes.has(propertyType),
          filterable: filterableTypes.has(propertyType),
          ...(typesCols[propertyType] || {})
        }))
    ];
  }

  @computed
  private get ready(): boolean {
    return Boolean(this.library && this.schema);
  }

  private renderBool({
    rowData,
    field
  }: {
    rowData: LibraryRecord;
    field: keyof LibraryRecord;
    filterActive: boolean;
    filterParams: FilterParams<LibraryRecord>;
  }): ReactElement {
    const value = ['true', '1'].includes(String(rowData[field]).toLowerCase());

    return value ? <Check color='primary' fontSize='small' /> : <Close color='disabled' fontSize='small' />;
  }

  private renderActions({ rowData }: { rowData: LibraryRecord }): ReactElement {
    return (
      <LibraryDocumentActions
        className={cnLibraryRegistry('Actions')}
        document={rowData}
        as='menu'
        LibraryDocument={LibraryDocument}
      />
    );
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
}
