import React, { Component } from 'react';
import { action, makeObservable, observable, reaction } from 'mobx';
import { observer } from 'mobx-react';
import { TextField } from '@mui/material';
import { Search } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { FtsType } from '../../../../server-types/common-contracts';
import { Form } from '../../Form/Form';
import { IconButton } from '../../IconButton/IconButton';
import { SearchResultDialog } from '../../SearchResultDialog/SearchResultDialog';
import { hasSearch } from '../Adapter/Explorer-Adapter';
import { ExplorerItemType, ExplorerSearchValue } from '../Explorer.models';
import { ExplorerService } from '../Explorer.service';
import { ExplorerStore } from '../Explorer.store';

import '!style-loader!css-loader!sass-loader!./Explorer-Search.scss';

const cnExplorerSearch = cn('Explorer', 'Search');

interface ExplorerSearchProps {
  store: ExplorerStore;
  service: ExplorerService;
  onChange(): void;
}

@observer
export class ExplorerSearch extends Component<ExplorerSearchProps> {
  @observable private search: ExplorerSearchValue = {};
  @observable private dialogOpen = false;

  constructor(props: ExplorerSearchProps) {
    super(props);
    makeObservable(this);
  }

  componentDidMount() {
    reaction(
      () => this.props.store.openedItem,
      () => {
        this.closeDialog();
        this.setSearch({});
      }
    );
  }

  render() {
    const { openedItem, explorerRole } = this.props.store;

    return (
      <>
        {explorerRole === 'dm' && hasSearch(openedItem, this.props.store) && (
          <Form className={cnExplorerSearch()} onSubmit={this.onSubmit}>
            <TextField
              label={'Поиск'}
              value={this.search?.searchValue || ''}
              onChange={this.handleSearchChange}
              InputProps={{
                endAdornment: (
                  <IconButton type='submit' size='small'>
                    <Search />
                  </IconButton>
                )
              }}
              variant='standard'
            />
          </Form>
        )}

        {openedItem.type !== ExplorerItemType.SEARCH_RESULT_ROOT && this.search?.searchValue && (
          <SearchResultDialog open={this.dialogOpen} onClose={this.closeDialog} search={this.search} />
        )}
      </>
    );
  }

  @boundMethod
  private onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    this.setSearchInfo(this.search.searchValue);
  }

  @boundMethod
  private handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setSearch({
      ...this.search,
      searchValue: e.target.value
    });
  }

  private setSearchInfo(value?: string) {
    let type: FtsType | undefined;

    if (
      this.props.store.openedItem.type === ExplorerItemType.LIBRARY_ROOT ||
      this.props.store.openedItem.type === ExplorerItemType.LIBRARY ||
      this.props.store.openedItem.type === ExplorerItemType.FOLDER
    ) {
      type = 'DOCUMENT';
    } else if (
      this.props.store.openedItem.type === ExplorerItemType.DATASET_ROOT ||
      this.props.store.openedItem.type === ExplorerItemType.DATASET
    ) {
      type = 'FEATURE';
    }

    if (value) {
      const { store } = this.props;
      this.setSearch({
        searchValue: value,
        path: store.path.slice(1, -1),
        type,
        breadcrumbSearchValue: value
      });

      this.openDialog();
    }
  }

  @action
  private setSearch(search: ExplorerSearchValue) {
    this.search = search;
  }

  @action
  private openDialog() {
    this.dialogOpen = true;
  }

  @action.bound
  private closeDialog() {
    this.dialogOpen = false;
  }
}
