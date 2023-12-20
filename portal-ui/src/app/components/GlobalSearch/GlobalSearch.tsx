import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { TextField } from '@mui/material';
import { boundMethod } from 'autobind-decorator';
import { Search } from '@mui/icons-material';
import { action, makeObservable, observable } from 'mobx';

import { SearchItemDataSource } from '../../services/data/search/search.model';
import { currentProject } from '../../stores/CurrentProject.store';
import { FtsType } from '../../../server-types/common-contracts';
import { sidebars } from '../../stores/Sidebars.store';
import { IconButton } from '../IconButton/IconButton';

import '!style-loader!css-loader!sass-loader!./GlobalSearch.scss';

export interface SearchInfo {
  searchValue?: string;
  source?: SearchItemDataSource[];
  type?: FtsType;
}

const cnExplorerSearch = cn('GlobalSearch');

@observer
export class GlobalSearch extends Component {
  @observable private search: SearchInfo = {};

  constructor(props: Record<string, unknown>) {
    super(props);
    makeObservable(this);
  }

  render() {
    return (
      <form className={cnExplorerSearch()} onSubmit={this.onSubmit}>
        <TextField
          className={cnExplorerSearch('SearchField')}
          value={this.search.searchValue || ''}
          onChange={this.handleSearchChange}
          placeholder='Поиск'
          InputProps={{
            endAdornment: (
              <IconButton type='submit' size='small' color='inherit'>
                <Search />
              </IconButton>
            )
          }}
          variant='standard'
        />
      </form>
    );
  }

  @boundMethod
  private onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (this.search.searchValue) {
      const sources: SearchItemDataSource[] = currentProject.vectorLayers.map(({ dataset, tableName }) => {
        return {
          dataset,
          table: tableName
        };
      });

      sidebars.setSearchValue({ ...this.search, source: sources });
      sidebars.openFeaturesSidebar();
    }
  }

  @boundMethod
  private handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setSearch({
      searchValue: e.target.value,
      type: 'FEATURE'
    });
  }

  @action.bound
  private setSearch(search: SearchInfo) {
    this.search = search;
  }
}
