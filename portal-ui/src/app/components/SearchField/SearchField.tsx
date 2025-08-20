import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { TextField } from '@mui/material';
import { Search } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';
import { boundMethod } from 'autobind-decorator';

import { FtsType } from '../../../server-types/common-contracts';
import { SearchItemDataSource } from '../../services/data/search/search.model';
import { MapAction } from '../../services/map/map.models';
import { mapStore } from '../../stores/Map.store';
import { ExplorerSearchValue } from '../Explorer/Explorer.models';
import { IconButton } from '../IconButton/IconButton';

import '!style-loader!css-loader!sass-loader!./SearchField.scss';

export interface SearchInfo {
  searchValue?: string;
  source?: SearchItemDataSource[];
  type?: FtsType;
}

interface SearchFieldProps extends IClassNameProps {
  whiteStyle?: boolean;
  onSubmit(search: ExplorerSearchValue): void;
}

const cnSearchField = cn('SearchField');

@observer
export class SearchField extends Component<SearchFieldProps> {
  @observable private search: ExplorerSearchValue = {};

  constructor(props: SearchFieldProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    return (
      <form className={cnSearchField(null, [this.props.className])} onSubmit={this.onSubmit}>
        <TextField
          disabled={!mapStore.allowedActions.includes(MapAction.SEARCH_FIELD)}
          className={cnSearchField('Input', {
            whiteStyle: this.props.whiteStyle
          })}
          value={this.search.searchValue || ''}
          onChange={this.handleSearchChange}
          placeholder='Поиск'
          slotProps={{
            input: {
              endAdornment: (
                <IconButton
                  type='submit'
                  size='small'
                  color='inherit'
                  disabled={!mapStore.allowedActions.includes(MapAction.SEARCH_FIELD)}
                >
                  <Search />
                </IconButton>
              )
            }
          }}
          variant='standard'
        />
      </form>
    );
  }

  @boundMethod
  private onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    this.props.onSubmit(this.search);
  }

  @boundMethod
  private handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setSearch({
      searchValue: e.target.value,
      type: 'FEATURE'
    });
  }

  @action.bound
  private setSearch(search: ExplorerSearchValue) {
    this.search = search;
  }
}
