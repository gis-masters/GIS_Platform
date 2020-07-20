import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { cn } from '@bem-react/classname';
import { action, observable } from 'mobx';
import { SearchTwoTone } from '@material-ui/icons';
import { Divider, IconButton, InputBase, Popover } from '@material-ui/core';

import { Loading } from '../Loading/Loading';
import { geocodeService, YaGeoObjectCollection } from '../../services/yandex-geocode.service';

import { SearchResultList } from './ResultList/Search-ResultList';

import '!style-loader!css-loader!sass-loader!./Search.scss';
import '!style-loader!css-loader!sass-loader!./Input/Search-Input.scss';
import '!style-loader!css-loader!sass-loader!./Divider/Search-Divider.scss';
import '!style-loader!css-loader!sass-loader!./Loader/Search-Loader.scss';

const cnSearch = cn('Search');

export interface SearchProps {
  hidden: boolean;
}

@observer
export class Search extends Component<SearchProps> {
  @observable private searchValue: string;
  @observable private searchResult: YaGeoObjectCollection;
  @observable private resultListOpen = false;
  @observable private isLoading = false;

  private anchor?: HTMLElement;

  constructor(props: SearchProps) {
    super(props);

    this.onFocus = this.onFocus.bind(this);
    this.doSearch = this.doSearch.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleResultListClose = this.handleResultListClose.bind(this);
  }

  render() {
    return (
      <>
        {!this.props.hidden ?
          <div className={cnSearch()}>
            <InputBase
              className={cnSearch('Input')}
              placeholder='Найти адрес или место'
              type='search'
              onChange={this.handleInputChange}
              onKeyUp={this.handleKeyUp}
              onFocus={this.onFocus}
            />

            <Divider className={cnSearch('Divider')} orientation='vertical'/>

            {!this.isLoading ?
              <IconButton className={ cnSearch('Button') } onClick={ this.doSearch } size='small'>
                <SearchTwoTone/>
              </IconButton> :
              <Loading className={ cnSearch('Loader') } visible={ true } size={ 20 }/>}

            <Popover
              open={this.resultListOpen}
              anchorEl={this.anchor}
              onClose={this.handleResultListClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
            >
              <SearchResultList data={this.searchResult} onClick={this.closeResultList}/>
            </Popover>
          </div> : null}
      </>
    );
  }

  @action.bound
  private handleInputChange(e) {
    this.searchValue = e.target.value;
  }

  @action
  private setSearchResult(result: YaGeoObjectCollection) {
    this.searchResult = result;
  }

  private onFocus(e) {
    this.anchor = e.target as HTMLElement;
  }

  private handleKeyUp(e) {
    if (e.key === 'Enter') {
      this.doSearch();
    }
  }

  private async doSearch() {
    if (!this.searchValue) {
      return;
    }

    this.setLoading(true);
    this.setSearchResult(await geocodeService.search(this.searchValue));
    this.openResultList();
    this.setLoading(false);
  }

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
  private setLoading(value: boolean) {
    this.isLoading = value;
  }
}
