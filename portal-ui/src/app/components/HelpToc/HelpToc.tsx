import React, { type ChangeEvent, Component } from 'react';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { TextField } from '@mui/material';
import { Clear } from '@mui/icons-material';
import { SimpleTreeView } from '@mui/x-tree-view';
import { cn } from '@bem-react/classname';
import { type IClassNameProps } from '@bem-react/core';

import { notFalsyFilter } from '../../services/util/NotFalsyFilter';
import { type Toc, type TocItem } from '../../stores/Help.store';
import { IconButton } from '../IconButton/IconButton';
import { HelpTocCollapseIcon } from './CollapseIcon/HelpToc-CollapseIcon';
import { HelpTocExpandIcon } from './ExpandIcon/HelpToc-ExpandIcon';
import { HelpTocItem } from './Item/HelpToc-Item';
import { HelpTocItemTitleLink } from './ItemTitleLink/HelpToc-ItemTitleLink';
import { HelpTocSearchIcon } from './SearchIcon/HelpToc-SearchIcon';

import './HelpToc.scss';

const cnHelpToc = cn('HelpToc');

interface HelpTocProps extends IClassNameProps {
  items: Toc;
  selectedItem?: TocItem;
  onSelect(item: TocItem): void;
}

@observer
export class HelpToc extends Component<HelpTocProps> {
  @observable private filterParam = '';
  @observable private searchResults: Toc = [];
  @observable private tocTreeHidden = false;

  constructor(props: HelpTocProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { className, items, onSelect } = this.props;

    return (
      <div className={cnHelpToc(null, [className])}>
        <TextField
          fullWidth
          placeholder='Поиск'
          value={this.filterParam}
          onChange={this.handleFilterChange}
          InputProps={{
            startAdornment: <HelpTocSearchIcon />,
            endAdornment: (
              <IconButton size='small' onClick={this.handleFilterClear} className={cnHelpToc('SearchClear')}>
                <Clear />
              </IconButton>
            )
          }}
          variant='standard'
        />
        {this.tocTreeHidden
          ? this.searchResults.map(item => (
              <HelpTocItemTitleLink key={item.id} item={item} onClick={this.handleClick} />
            ))
          : items.map(item => (
              <SimpleTreeView
                key={item.id}
                slots={{
                  collapseIcon: HelpTocCollapseIcon,
                  expandIcon: HelpTocExpandIcon
                }}
                disableSelection
              >
                <HelpTocItem item={item} onSelect={onSelect} />
              </SimpleTreeView>
            ))}
      </div>
    );
  }

  @action.bound
  private handleClick(item: TocItem) {
    if (!item.children) {
      this.props.onSelect(item);
    }
  }

  @action
  private search(word: string) {
    const regEx = new RegExp('(' + word + ')(?!([^<]+)?>)', 'gi');
    const toc: Toc = this.flatArray
      .map(item => {
        if (item.content && (regEx.test(item.title) || regEx.test(item.content))) {
          return {
            ...item,
            title: this.searchRegExp(item.title, regEx),
            content: this.searchRegExp(item.content, regEx)
          };
        }
      })
      .filter(notFalsyFilter);

    this.setSearchResults(toc);
  }

  private searchRegExp(text: string, regEx: RegExp): string {
    return text.replace(regEx, `<span class=${cnHelpToc('Mark')}>$1</span>`);
  }

  @action.bound
  private handleFilterChange(e: ChangeEvent<HTMLInputElement>) {
    this.setFilterParam(e.target.value);
    this.search(e.target.value);
    if (e.target.value.trim()) {
      this.setTocTreeHidden(true);
    } else {
      this.setTocTreeHidden(false);
    }
  }

  @action
  private setFilterParam(word: string) {
    this.filterParam = word;
  }

  @action
  private setSearchResults(results: Toc) {
    this.searchResults = results;
  }

  @action
  private setTocTreeHidden(status: boolean) {
    this.tocTreeHidden = status;
  }

  @action.bound
  private handleFilterClear() {
    this.setFilterParam('');
    this.search('');
    this.setTocTreeHidden(false);
  }

  @computed
  private get flatArray(): Toc {
    return this.alignArray(this.props.items);
  }

  @action
  private alignArray(arr: Toc): Toc {
    return arr.map(article => (article.children ? this.alignArray(article.children) : article)).flat(2) as Toc;
  }
}
