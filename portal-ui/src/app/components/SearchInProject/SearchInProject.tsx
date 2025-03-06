import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { SearchItemDataSource } from '../../services/data/search/search.model';
import { mapModeManager } from '../../services/map/a-map-mode/MapModeManager';
import { MapMode } from '../../services/map/map.models';
import { currentProject } from '../../stores/CurrentProject.store';
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
  private async search(searchValue: ExplorerSearchValue) {
    if (searchValue.searchValue) {
      const sources: SearchItemDataSource[] = currentProject.vectorLayers.map(({ dataset, tableName }) => {
        return {
          dataset,
          table: tableName
        };
      });

      await mapModeManager.changeMode(
        MapMode.SEARCH_IN_PROJECT,
        {
          payload: { ...searchValue, source: sources }
        },
        'search - 1'
      );
    }
  }

  @action.bound
  private toggleExpanded(): void {
    this.expanded = !this.expanded;
  }
}
