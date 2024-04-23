import React, { Component, ReactElement } from 'react';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { HomeOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { AxiosError } from 'axios';

import { MessagesRegistriesMessages } from '../../services/data/messagesRegistries/messagesRegistries.models';
import {
  getMessagesRegistriesData,
  getMessagesRegistriesSchema
} from '../../services/data/messagesRegistries/messagesRegistries.service';
import { Schema } from '../../services/data/schema/schema.models';
import { PageOptions } from '../../services/models';
import { FilterQuery } from '../../services/util/filterObjects';
import { SortParams } from '../../services/util/sortObjects';
import { Breadcrumbs, BreadcrumbsItemData } from '../Breadcrumbs/Breadcrumbs';
import { EmptyListView } from '../EmptyListView/EmptyListView';
import { Loading } from '../Loading/Loading';
import { Registry } from '../Registry/Registry';
import { XTableColumn } from '../XTable/XTable.models';
import { getXTableColumnsFromSchema } from '../XTable/XTable.utils';
import { MessagesRegistryOpenAction } from './OpenAction/MessagesRegistry-OpenAction';

import '!style-loader!css-loader!sass-loader!./MessagesRegistry.scss';

const cnMessagesRegistry = cn('MessagesRegistry');

export interface MessagesRegistryProps {
  id: string;
  urlChangeEnabled?: boolean;
  messagesRegistryTableName: string;
  onSelect?: (items: MessagesRegistriesMessages[]) => void;
}

@observer
export default class MessagesRegistry extends Component<MessagesRegistryProps> {
  @observable private schema?: Schema;
  @observable private error: string;
  private defaultSort: SortParams<MessagesRegistriesMessages> = { field: 'system', asc: true };
  private defaultFilter: FilterQuery;

  constructor(props: MessagesRegistryProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount() {
    await this.getSchema();
  }

  render() {
    return (
      <div className={cnMessagesRegistry()}>
        {this.ready && (
          <>
            <Breadcrumbs items={this.items} itemsType='link' size='medium' />

            <Registry<MessagesRegistriesMessages>
              className={cnMessagesRegistry('Table')}
              cols={this.cols}
              id={this.getId()}
              getData={this.getData}
              defaultSort={this.defaultSort}
              filtersAlwaysEnabled
              showFiltersPanel
              defaultFilter={this.defaultFilter}
            />
          </>
        )}
        {!this.ready && !this.error && <Loading noBackdrop />}

        {this.error && <EmptyListView text={this.error} />}
      </div>
    );
  }

  private getId(): string {
    return this.props.id + '_MessagesRegistryRegistry_' + this.props.messagesRegistryTableName;
  }

  @computed
  private get items(): BreadcrumbsItemData[] {
    const items: BreadcrumbsItemData[] = [];

    const messagesRegistryRootUrlItems = ['r', 'root', 'mrr', 'messagesRegistries'];
    const messagesRegistryRootPath = JSON.stringify([...messagesRegistryRootUrlItems, 'none', 'none']);

    items.push(
      { title: <HomeOutlined />, url: '/data-management' },
      {
        title: 'Реестры сообщений',
        url: `/data-management?path_dm=${messagesRegistryRootPath}`
      },
      {
        title: this.schema?.title,
        itemType: 'none'
      }
    );

    return items;
  }

  @computed
  private get cols(): XTableColumn<MessagesRegistriesMessages>[] {
    return [
      {
        CellContent: this.renderActions,
        align: 'center',
        minWidth: 60,
        filterable: false,
        cellProps: { padding: 'checkbox' }
      },
      ...getXTableColumnsFromSchema<MessagesRegistriesMessages>(this.schema)
    ].map((item: XTableColumn<MessagesRegistriesMessages>) => ({
      ...item,
      filterable: item.filterable
    }));
  }

  @boundMethod
  private renderActions({ rowData }: { rowData: MessagesRegistriesMessages }): ReactElement {
    return <MessagesRegistryOpenAction schema={this.schema} message={rowData} />;
  }

  @computed
  private get ready(): boolean {
    return Boolean(this.schema);
  }

  @action
  private async getSchema() {
    try {
      this.schema = await getMessagesRegistriesSchema(this.props.messagesRegistryTableName);
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;

      this.setError(err?.response?.data?.message || err?.message);
    }
  }

  @boundMethod
  private async getData(pageOptions: PageOptions): Promise<[MessagesRegistriesMessages[], number]> {
    if (!this.schema) {
      return [[], 1];
    }

    return await getMessagesRegistriesData(this.props.messagesRegistryTableName, pageOptions);
  }

  @action
  private setError(error: string) {
    this.error = error;
  }
}
