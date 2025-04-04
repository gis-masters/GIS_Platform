import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { CircularProgress, FormControl, IconButton, InputBase, Paper, Popover, Tooltip } from '@mui/material';
import { SearchOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { AxiosError } from 'axios';

import { WfsFeature } from '../../services/geoserver/wfs/wfs.models';
import { mapDrawService } from '../../services/map/draw/map-draw.service';
import { mapService } from '../../services/map/map.service';
import { getNspdData } from '../../services/nspd-data.service';
import { services } from '../../services/services';
import { wfsFeaturesToFeatures } from '../../services/util/open-layers.util';
import { YaGeoObjectCollection } from '../../services/yandex-geocode.service';
import { Toast } from '../Toast/Toast';
import { SearchResultList } from './ResultList/Search-ResultList';

import '!style-loader!css-loader!sass-loader!./Search.scss';

const cnSearch = cn('Search');

@observer
export default class Search extends Component {
  @observable private searchValue = '';
  @observable private searchResult?: YaGeoObjectCollection;
  @observable private resultListOpen = false;
  @observable private isLoading = false;
  @observable private features: WfsFeature[] = [];
  @observable private hasError = false;

  private anchor?: HTMLElement;

  constructor(props: Record<string, never>) {
    super(props);
    makeObservable(this);
  }

  render() {
    return (
      <>
        <Paper component='form' className={cnSearch()} onSubmit={this.handleSubmit} elevation={3}>
          <FormControl error={this.hasError} fullWidth>
            <Tooltip
              open={this.hasError}
              title='Не соответствует структуре кадастрового номера'
              arrow
              placement='bottom'
            >
              <InputBase
                className={cnSearch('Input')}
                placeholder='Найти кадастровый номер в НСПД'
                onChange={this.handleInputChange}
              />
            </Tooltip>
          </FormControl>

          <IconButton className={cnSearch('Button')} size='small' type='submit'>
            {this.isLoading ? <CircularProgress size={20} /> : <SearchOutlined />}
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
          {this.searchValue && (
            <SearchResultList value={this.searchValue} addressData={this.searchResult} features={this.features} />
          )}
        </Popover>
      </>
    );
  }

  @action.bound
  private handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setError(false);
    this.setSearchValue(e.target.value);
    const olFeatures = wfsFeaturesToFeatures(this.features);

    for (const feature of olFeatures) {
      mapDrawService.removeFeature(feature);
    }

    mapDrawService.clearDraft();
    mapService.clearMarkers();
  }

  @boundMethod
  private async handleSubmit(e: React.FormEvent<HTMLElement>) {
    e.preventDefault();

    this.setError(this.searchValue ? !/^\d{2}:\d{2}:\d{6}:\d{1,5}$/.test(this.searchValue) : false);
    this.anchor = e.target as HTMLElement;

    if (!this.searchValue || this.hasError) {
      return;
    }

    this.setLoading(true);

    await this.getKadItems(this.searchValue.replaceAll(/[\sa-zа-яё]/gi, ''));

    this.setLoading(false);
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
    try {
      const features = await getNspdData(kadNum);
      this.setSearchValue(kadNum);
      this.setFeatures(features);
      this.openResultList();
    } catch (error) {
      const err = error as AxiosError;

      Toast.warn({
        message: <>Объект {kadNum} не найден в НСПД</>
      });
      services.logger.error(`Ошибка ответа НСПД: ${kadNum}`, err.message);
    }
    this.setLoading(false);
  }

  @action
  private setSearchValue(value: string) {
    this.searchValue = value.trim();
  }

  @action
  private setFeatures(features: WfsFeature[]) {
    this.features = features;
  }

  @action
  private setLoading(value: boolean) {
    this.isLoading = value;
  }

  @action
  private setError(error: boolean) {
    this.hasError = error;
  }
}
