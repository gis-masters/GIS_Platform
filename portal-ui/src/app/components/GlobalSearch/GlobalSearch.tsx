import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { boundMethod } from 'autobind-decorator';

import { SearchItemDataSource } from '../../services/data/search/search.model';
import { ExplorerSearchValue } from '../Explorer/Explorer.models';
import { SearchField } from '../SearchField/SearchField';
import { SearchResultDialog } from '../SearchResultDialog/SearchResultDialog';

interface GlobalSearchProps {
  whiteStyle?: boolean;
  source?: SearchItemDataSource;
}

@observer
export class GlobalSearch extends Component<GlobalSearchProps> {
  @observable private search: ExplorerSearchValue = {};
  @observable private dialogOpen = false;

  constructor(props: GlobalSearchProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    return (
      <>
        <SearchField whiteStyle={this.props.whiteStyle} onSubmit={this.onSubmit} />

        <SearchResultDialog open={this.dialogOpen} onClose={this.closeDialog} search={this.search} />
      </>
    );
  }

  @boundMethod
  private onSubmit(search: ExplorerSearchValue) {
    if (search.searchValue) {
      this.setSearch({
        ...search,
        breadcrumbSearchValue: search.searchValue,
        source: [this.props.source]
      });

      this.openDialog();
    }
  }

  @action.bound
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
