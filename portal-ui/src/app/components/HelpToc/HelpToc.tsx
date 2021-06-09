import React, { Component } from 'react';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';
import { action, computed, observable } from 'mobx';
import { observer } from 'mobx-react';
import TreeView from '@material-ui/lab/TreeView';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import { IconButton, TextField } from '@material-ui/core';
import { SearchOutlined, Clear } from '@material-ui/icons';

import { Toc, TocItem } from '../../stores/Help.store';
import { HelpTocItem } from './Item/HelpToc-Item';

import '!style-loader!css-loader!sass-loader!./HelpToc.scss';

const cnHelpToc = cn('HelpToc');

interface HelpTocProps extends IClassNameProps {
  items: Toc;
  selectedItem?: TocItem;
  onSelect: (item: TocItem) => void;
}

@observer
export class HelpToc extends Component<HelpTocProps> {
  @observable private filterParam: string = '';
  @observable private searchResults: Toc = [];
  @observable private tocTreeHiden: boolean = false;

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
            startAdornment: <SearchOutlined className={cnHelpToc('SearchIcon')} />,
            endAdornment: (
              <IconButton size='small' onClick={this.handleFilterClear} className={cnHelpToc('SearchClear')}>
                <Clear />
              </IconButton>
            )
          }}
        />
        {this.tocTreeHiden
          ? this.searchResults.map(item => (
              <div
                className={cnHelpToc('ItemTitleLink')}
                key={item.id}
                onClick={() => this.clickHandler(item)}
                dangerouslySetInnerHTML={{ __html: item.title }}
              />
            ))
          : items.map(item => (
              <TreeView
                key={item.id}
                defaultCollapseIcon={<ArrowDropDownIcon className={cnHelpToc('TitleIcon')} />}
                defaultExpandIcon={<ArrowRightIcon className={cnHelpToc('TitleIcon')} />}
                disableSelection={true}
              >
                <HelpTocItem item={item} onSelect={onSelect} />
              </TreeView>
            ))}
      </div>
    );
  }

  @action
  private clickHandler(item: TocItem) {
    item.children ? null : this.props.onSelect(item);
  }

  @action
  private search(word: string) {
    const regEx = new RegExp('(' + word + ')(?!([^<]+)?>)', 'gi');

    function searchRegExp(text) {
      return text.replace(regEx, `<span class=${cnHelpToc('Mark')}>$1</span>`);
    }

    this.setSearchResults(
      this.flatArray
        .map(item => {
          if (regEx.test(item.title) || regEx.test(item.content)) {
            return { ...item, title: searchRegExp(item.title), content: searchRegExp(item.content) };
          }
        })
        .filter(item => item !== undefined)
    );
  }

  @action.bound
  private handleFilterChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setFilterParam(e.target.value);
    this.search(e.target.value);
    e.target.value.trim() ? this.setTocTreeHiden(true) : this.setTocTreeHiden(false);
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
  private setTocTreeHiden(status: boolean) {
    this.tocTreeHiden = status;
  }

  @action.bound
  private handleFilterClear() {
    this.setFilterParam('');
    this.search('');
    this.setTocTreeHiden(false);
  }

  @computed
  private get flatArray(): Toc {
    return this.alignArray(this.props.items);
  }

  @action
  private alignArray (arr: Toc): Toc {
    return arr.map(article => (article.children ? this.alignArray(article.children) : article)).flat(2);
  };
}
