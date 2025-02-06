import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { SearchItemDataSource } from '../../services/data/search/search.model';
import { currentProject } from '../../stores/CurrentProject.store';
import { sidebars } from '../../stores/Sidebars.store';
import { ExplorerSearchValue } from '../Explorer/Explorer.models';
import { SearchInProjectSearchField } from './SearchField/SearchInProject-SearchField';
import { SearchInProjectToggler } from './Toggler/SearchInProject-Toggler';

import '!style-loader!css-loader!sass-loader!./SearchInProject.scss';

const cnSearchInProject = cn('SearchInProject');

@observer
export class SearchInProject extends Component {
  @observable private expanded = false;

  constructor(props: Record<string, never>) {
    super(props);
    makeObservable(this);
  }

  render() {
    return (
      <div className={cnSearchInProject()}>
        <SearchInProjectSearchField expanded={this.expanded} onSubmit={this.search} />
        <SearchInProjectToggler expanded={this.expanded} onClick={this.toggleExpanded} />
      </div>
    );
  }

  @boundMethod
  private search(searchValue: ExplorerSearchValue) {
    if (searchValue.searchValue) {
      const sources: SearchItemDataSource[] = currentProject.vectorLayers.map(({ dataset, tableName }) => {
        return {
          dataset,
          table: tableName
        };
      });

      sidebars.setSearchValue({ ...searchValue, source: sources });
      sidebars.openSearchSidebar();
    }
  }

  @action.bound
  private toggleExpanded(): void {
    this.expanded = !this.expanded;
  }
}
