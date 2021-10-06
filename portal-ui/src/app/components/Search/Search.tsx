import React, { Component } from 'react';
import { cn } from '@bem-react/classname';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { boundMethod } from 'autobind-decorator';
import { SearchOutlined } from '@mui/icons-material';
import { IconButton, InputBase, Popover, Paper, CircularProgress } from '@mui/material';

import { mapService } from '../../services/map/map.service';
import { geocodeService, YaGeoObjectCollection } from '../../services/yandex-geocode.service';
import { getRosreestrMultipleAreaData, getRosreestrMultipleOksData } from '../../services/rosreestr-data.service';
import { KadObject } from '../../services/kad-search.models';
import { SearchResultList } from './ResultList/Search-ResultList';

import '!style-loader!css-loader!sass-loader!./Search.scss';

const cnSearch = cn('Search');

@observer
export class Search extends Component {
  @observable private searchValue: string;
  @observable private searchResult: YaGeoObjectCollection;
  @observable private resultListOpen = false;
  @observable private isLoading = false;
  @observable private kadAreas: KadObject[] = [];
  @observable private kadOks: KadObject[] = [];

  private anchor?: HTMLElement;

  private kadNumRegex = /\d{2}?:?\d{2}:?\d{6}:/;

  render() {
    return (
      <>
        <Paper component='form' className={cnSearch()} onSubmit={this.handleSubmit} elevation={3}>
          <InputBase
            className={cnSearch('Input')}
            placeholder='Найти адрес или кадастровый номер'
            onChange={this.handleInputChange}
          />

          <IconButton className={cnSearch('Button')} size='small' type='submit'>
            {!this.isLoading ? <SearchOutlined /> : <CircularProgress size={20} />}
          </IconButton>
        </Paper>

        <Popover
          classes={{ paper: cnSearch('Paper') }}
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
          <SearchResultList addressData={this.searchResult} kadAreasData={this.kadAreas} kadOksData={this.kadOks} />
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
    this.clearKadItems();

    this.anchor = e.target as HTMLElement;

    if (!this.searchValue) {
      return;
    }

    this.setLoading(true);
    if (this.kadNumRegex.test(this.searchValue)) {
      await this.getKadItems(this.searchValue.replace(/[\sa-zа-яё]/gi, ''));
      this.setSearchResult(null);
    } else {
      this.setSearchResult(await geocodeService.search(this.searchValue));
      this.setLoading(false);
      this.openResultList();
    }
  }

  @boundMethod
  private handleResultListClose() {
    this.closeResultList();
  }

  @action.bound
  private closeResultList() {
    this.resultListOpen = false;
  }

  @action
  private openResultList() {
    this.resultListOpen = true;
  }

  @action
  private async getKadItems(kadNum: string) {
    const [areas, oks] = await Promise.all([getRosreestrMultipleAreaData(kadNum), getRosreestrMultipleOksData(kadNum)]);

    if (areas || oks) {
      this.setKadItems(areas as KadObject[], oks as KadObject[]);
    } else {
      this.clearKadItems();
    }
    this.setLoading(false);
    this.openResultList();
  }

  @action
  private clearKadItems() {
    this.kadAreas = [];
    this.kadOks = [];
  }

  @action
  private setKadItems(areas: KadObject[], oks: KadObject[]) {
    this.kadAreas = areas;
    this.kadOks = oks;
  }

  @action
  private setLoading(value: boolean) {
    this.isLoading = value;
  }
}
