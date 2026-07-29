import React, { type ChangeEvent, Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { CircularProgress, FormControl, InputBase, Paper, Popover, Tooltip } from '@mui/material';
import { SearchOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { type AxiosError } from 'axios';

import { type WfsFeature } from '../../services/geoserver/wfs/wfs.models';
import { mapDrawService } from '../../services/map/draw/map-draw.service';
import { mapService } from '../../services/map/map.service';
import { getNspdData, getNspdDataByAddress } from '../../services/nspd/data/nspd-data.service';
import { services } from '../../services/services';
import { wfsFeaturesToFeatures } from '../../services/util/open-layers.util';
import { type YaGeoObjectCollection } from '../../services/yandex-geocode.service';
import { IconButton } from '../IconButton/IconButton';
import { Toast } from '../Toast/Toast';
import { SearchResultList } from './ResultList/Search-ResultList';

import './Search.scss';

const cnSearch = cn('Search');
const nspdSearchTooltip =
  'Введите корректный кадастровый номер для точного поиска ' +
  '(пример 90:00:000000:1054). ' +
  'Во всех остальных случаях будет выполнен поиск по адресу.';
const nspdSearchErrorTooltip = 'Неверный формат кадастрового номера';
const nspdAddressSearchErrorTooltip = 'Введите не менее 3 символов для поиска по адресу';
const minNspdAddressSearchLength = 3;
const cadastralNumberRegExp = /^\d{2}:\d{2}:\d{6,7}:\d{1,5}$/;
const cadastralNumberLikeRegExp = /^[\d\s:]+$/;

type NspdSearchType = 'empty' | 'cadastralNumber' | 'invalidCadastralNumber' | 'shortAddress' | 'address';

@observer
export default class Search extends Component {
  @observable private searchValue = '';
  @observable private searchResult?: YaGeoObjectCollection;
  @observable private resultListOpen = false;
  @observable private isLoading = false;
  @observable private features: WfsFeature[] = [];
  @observable private hasError = false;
  @observable private errorTooltip = nspdSearchErrorTooltip;
  @observable private nspdFeaturesTotalCount?: number;
  @observable private tooltipOpen = false;

  private anchor?: HTMLElement;
  private searchRequestId = 0;

  constructor(props: Record<string, never>) {
    super(props);
    makeObservable(this);
  }

  render() {
    const searchInput = (
      <InputBase className={cnSearch('Input')} placeholder='Найти в НСПД' onChange={this.handleInputChange} />
    );

    return (
      <>
        <Paper component='form' className={cnSearch()} onSubmit={this.handleSubmit} elevation={3}>
          <FormControl error={this.hasError} fullWidth>
            <Tooltip
              open={this.hasError || this.tooltipOpen}
              title={this.hasError ? this.errorTooltip : nspdSearchTooltip}
              arrow
              placement='bottom'
              onOpen={this.handleTooltipOpen}
              onClose={this.handleTooltipClose}
            >
              {searchInput}
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
            <SearchResultList
              value={this.searchValue}
              addressData={this.searchResult}
              features={this.features}
              nspdFeaturesTotalCount={this.nspdFeaturesTotalCount}
            />
          )}
        </Popover>
      </>
    );
  }

  @action.bound
  private handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    this.invalidateSearchRequest();
    this.setError(false);
    this.setLoading(false);
    this.setSearchValue(e.target.value);
    this.clearNspdFeaturesTotalCount();
    const olFeatures = wfsFeaturesToFeatures(this.features);

    for (const feature of olFeatures) {
      mapDrawService.removeFeature(feature);
    }

    mapDrawService.clearDraft();
    mapService.clearMarkers();
    this.setFeatures([]);
    this.closeResultList();
  }

  @boundMethod
  private handleSubmit(e: React.FormEvent<HTMLElement>) {
    e.preventDefault();

    void this.submitSearch(e.currentTarget);
  }

  private async submitSearch(anchor: HTMLElement) {
    const searchValue = this.searchValue;
    const searchType = this.getNspdSearchType(searchValue);
    this.anchor = anchor;

    if (searchType === 'empty') {
      return;
    }

    if (searchType === 'invalidCadastralNumber') {
      this.setError(true, nspdSearchErrorTooltip);

      return;
    }

    if (searchType === 'shortAddress') {
      this.setError(true, nspdAddressSearchErrorTooltip);

      return;
    }

    const searchRequestId = this.invalidateSearchRequest();
    this.setLoading(true);

    try {
      await (searchType === 'cadastralNumber'
        ? this.getKadItems(this.getNormalizedCadastralNumber(searchValue), searchRequestId)
        : this.getAddressItems(searchValue, searchRequestId));
    } finally {
      if (this.isCurrentSearchRequest(searchRequestId)) {
        this.setLoading(false);
      }
    }
  }

  @boundMethod
  private handleResultListClose() {
    this.closeResultList();
  }

  @action.bound
  private handleTooltipOpen() {
    this.tooltipOpen = true;
  }

  @action.bound
  private handleTooltipClose() {
    this.tooltipOpen = false;
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
  private async getKadItems(kadNum: string, searchRequestId: number) {
    try {
      const features = await getNspdData(kadNum);

      if (!this.isCurrentSearchRequest(searchRequestId)) {
        return;
      }

      this.setSearchValue(kadNum);
      this.setFeatures(features);
      this.clearNspdFeaturesTotalCount();
      this.openResultList();
    } catch (error) {
      if (!this.isCurrentSearchRequest(searchRequestId)) {
        return;
      }

      const err = error as AxiosError;

      Toast.warn({
        message: <>Объект {kadNum} не найден в НСПД</>
      });
      services.logger.error(`Ошибка ответа НСПД: ${kadNum}`, err.message);
    }
  }

  @action
  private async getAddressItems(address: string, searchRequestId: number) {
    try {
      const result = await getNspdDataByAddress(address);

      if (!this.isCurrentSearchRequest(searchRequestId)) {
        return;
      }

      this.setSearchValue(address);
      this.setFeatures(result.features);
      this.setNspdFeaturesTotalCount(result.totalCount);
      this.warnIfNspdAddressSearchPartial(address, result.failedSearchCount);
      this.openResultList();
    } catch (error) {
      if (!this.isCurrentSearchRequest(searchRequestId)) {
        return;
      }

      const err = error as AxiosError;

      Toast.warn({
        message: <>Объекты по адресу {address} не найдены в НСПД</>
      });
      services.logger.error(`Ошибка ответа НСПД: ${address}`, err.message);
    }
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
  private setError(error: boolean, tooltip = nspdSearchErrorTooltip) {
    this.hasError = error;
    this.errorTooltip = tooltip;
  }

  @action
  private setNspdFeaturesTotalCount(count?: number) {
    this.nspdFeaturesTotalCount = count;
  }

  @action
  private clearNspdFeaturesTotalCount() {
    this.nspdFeaturesTotalCount = undefined;
  }

  private warnIfNspdAddressSearchPartial(address: string, failedSearchCount: number) {
    if (!failedSearchCount) {
      return;
    }

    Toast.warn({
      message: <>Поиск в НСПД выполнен частично. Некоторые ресурсы временно недоступны</>
    });
    services.logger.warn(`Частичная ошибка ответа НСПД: ${address}. ` + `Неуспешных ресурсов: ${failedSearchCount}`);
  }

  private getNspdSearchType(value: string): NspdSearchType {
    const searchValue = value.trim();
    const cadastralNumber = this.getNormalizedCadastralNumber(searchValue);

    if (!searchValue) {
      return 'empty';
    }

    if (cadastralNumberRegExp.test(cadastralNumber)) {
      return 'cadastralNumber';
    }

    if (cadastralNumberLikeRegExp.test(searchValue) && searchValue.includes(':')) {
      return 'invalidCadastralNumber';
    }

    if (searchValue.length < minNspdAddressSearchLength) {
      return 'shortAddress';
    }

    return 'address';
  }

  private getNormalizedCadastralNumber(value: string): string {
    return value.replaceAll(/\s/g, '');
  }

  private invalidateSearchRequest(): number {
    this.searchRequestId += 1;

    return this.searchRequestId;
  }

  private isCurrentSearchRequest(searchRequestId: number): boolean {
    return searchRequestId === this.searchRequestId;
  }
}
