import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { cn } from '@bem-react/classname';
import { action, observable } from 'mobx';
import { boundMethod } from 'autobind-decorator';
import { SearchOutlined } from '@material-ui/icons';
import { IconButton, InputBase, Popover, Paper, CircularProgress } from '@material-ui/core';

import { mapService } from '../../services/map/map.service';
import { geocodeService, YaGeoObjectCollection } from '../../services/yandex-geocode.service';

import { SearchResultList } from './ResultList/Search-ResultList';

import '!style-loader!css-loader!sass-loader!./Search.scss';

const cnSearch = cn('Search');

@observer
export class Search extends Component {
  @observable private searchValue: string;
  @observable private searchResult: YaGeoObjectCollection;
  @observable private resultListOpen = false;
  @observable private isLoading = false;

  private anchor?: HTMLElement;

  render() {
    return (
      <>
        <Paper component='form' className={cnSearch()} onSubmit={this.handleSubmit} elevation={3}>
          <InputBase
            className={cnSearch('Input')}
            placeholder='Найти адрес или место'
            onChange={this.handleInputChange}
          />

          <IconButton className={cnSearch('Button')} size='small' type='submit'>
            {!this.isLoading ? <SearchOutlined /> : <CircularProgress size={20} />}
          </IconButton>
        </Paper>

        <Popover
          open={this.resultListOpen}
          anchorEl={this.anchor}
          onClose={this.handleResultListClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center'
          }}
        >
          <SearchResultList data={this.searchResult} onClick={this.closeResultList} />
        </Popover>
      </>
    );
  }

  @action.bound
  private handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.searchValue = e.target.value;
    if (!this.searchValue) {
      mapService.clearMarkers();
    }
  }

  @action
  private setSearchResult(result: YaGeoObjectCollection) {
    this.searchResult = result;
  }

  @boundMethod
  private async handleSubmit(e: React.FormEvent<HTMLElement>) {
    e.preventDefault();

    this.anchor = e.target as HTMLElement;

    if (!this.searchValue) {
      return;
    }

    this.setLoading(true);
    this.setSearchResult(await geocodeService.search(this.searchValue));
    this.openResultList();
    this.setLoading(false);
  }

  @boundMethod
  private handleResultListClose() {
    this.closeResultList();
  }

  @action.bound
  private closeResultList() {
    this.resultListOpen = false;
    mapService.clearMarkers();
  }

  @action
  private openResultList() {
    this.resultListOpen = true;
  }

  @action
  private setLoading(value: boolean) {
    this.isLoading = value;
  }
}
