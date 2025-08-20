import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { boundMethod } from 'autobind-decorator';

import { SearchItemDataSource } from '../../services/data/search/search.model';
import { EditFeatureMode } from '../../services/map/a-map-mode/edit-feature/EditFeature.models';
import { mapModeManager } from '../../services/map/a-map-mode/MapModeManager';
import { MapMode } from '../../services/map/map.models';
import { sidebars } from '../../stores/Sidebars.store';
import { ExplorerSearchValue } from '../Explorer/Explorer.models';
import { SearchField } from '../SearchField/SearchField';
import { SearchResultDialog } from '../SearchResultDialog/SearchResultDialog';

interface GlobalSearchProps {
  whiteStyle?: boolean;
  source?: SearchItemDataSource;
}

@observer
export class GlobalSearch extends Component<GlobalSearchProps> {
  @observable private search: ExplorerSearchValue = {};
  @observable private dialogOpen = false;

  constructor(props: GlobalSearchProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    return (
      <>
        <SearchField whiteStyle={this.props.whiteStyle} onSubmit={this.onSubmit} />

        <SearchResultDialog
          open={!!(sidebars.editFeatureOpen && this.dialogOpen)}
          onClose={this.closeDialog}
          search={this.search}
        />
      </>
    );
  }

  @boundMethod
  private async onSubmit(search: ExplorerSearchValue) {
    const { source } = this.props;
    if (search.searchValue && source) {
      this.setSearch({
        ...search,
        breadcrumbSearchValue: search.searchValue,
        source: [source]
      });

      // TODO: Тоже привести это к смене режима
      this.openDialog();

      await mapModeManager.changeMode(
        MapMode.EDIT_FEATURE,
        {
          payload: {
            features: [],
            mode: EditFeatureMode.single
          }
        },
        'search onSubmit'
      );
    }
  }

  @action.bound
  private setSearch(search: ExplorerSearchValue) {
    this.search = search;
  }

  @action
  private openDialog() {
    this.dialogOpen = true;
  }

  @action.bound
  private closeDialog() {
    this.dialogOpen = false;
  }
}
