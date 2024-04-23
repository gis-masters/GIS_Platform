import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { boundMethod } from 'autobind-decorator';

import { SearchItemDataSource } from '../../services/data/search/search.model';
import { currentProject } from '../../stores/CurrentProject.store';
import { sidebars } from '../../stores/Sidebars.store';
import { ExplorerSearchValue } from '../Explorer/Explorer.models';
import { SearchField } from '../SearchField/SearchField';

@observer
export class SearchInProject extends Component {
  render() {
    return <SearchField whiteStyle onSubmit={this.onSubmit} />;
  }

  @boundMethod
  private onSubmit(search: ExplorerSearchValue) {
    if (search.searchValue) {
      const sources: SearchItemDataSource[] = currentProject.vectorLayers.map(({ dataset, tableName }) => {
        return {
          dataset,
          table: tableName
        };
      });

      sidebars.setSearchValue({ ...search, source: sources });
      sidebars.openFeaturesSidebar();
    }
  }
}
