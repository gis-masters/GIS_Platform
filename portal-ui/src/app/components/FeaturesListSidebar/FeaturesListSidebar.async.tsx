import React, { Component, SyntheticEvent } from 'react';
import { action, IReactionDisposer, makeObservable, observable, reaction } from 'mobx';
import { observer } from 'mobx-react';
import { IconButton, Tab, Tabs } from '@mui/material';
import { Close } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { communicationService } from '../../services/communication.service';
import { selectedFeaturesStore } from '../../services/map/a-map-mode/selected-features/SelectedFeatures.store';
import { sidebars } from '../../stores/Sidebars.store';
import FeaturesListSidebarFeatures from '../FeaturesListSidebarFeatures/FeaturesListSidebarFeatures';
import { Loading } from '../Loading/Loading';
import { SearchInfo } from '../SearchField/SearchField';
import { TabInner } from '../TabInner/TabInner';
import { TabTitle } from '../TabTitle/TabTitle';

import '!style-loader!css-loader!sass-loader!./FeaturesListSidebar.scss';

const cnFeaturesListSidebar = cn('FeaturesListSidebar');

const tabsTitles: string[] = ['Выделенные объекты', 'Результаты поиска'];

@observer
export default class FeaturesListSidebar extends Component {
  @observable private singleTab = false;
  @observable private loading = false;
  @observable private search?: SearchInfo;
  @observable private activeTab = 0;

  private selectionReactionDisposer?: IReactionDisposer;
  private searchReactionDisposer?: IReactionDisposer;

  constructor(props: Record<string, unknown>) {
    super(props);
    makeObservable(this);
  }

  componentDidMount() {
    if (sidebars.searchValue) {
      this.setSearchValue(sidebars.searchValue);
    }

    communicationService.featuresUpdated.on(this.closeSelectedFeaturesTab, this);
    this.selectionReactionDisposer = reaction(
      () => selectedFeaturesStore.features.map(({ id }) => id),
      () => {
        this.selectedFeaturesUpdate();
      },
      { fireImmediately: true }
    );

    this.searchReactionDisposer = reaction(
      () => sidebars.searchValue,
      (search?: SearchInfo) => {
        this.searchUpdate(search);
      }
    );

    this.init();
  }

  componentWillUnmount() {
    communicationService.off(this);
    this.selectionReactionDisposer?.();
    this.searchReactionDisposer?.();
  }

  render() {
    return (
      <div className={cnFeaturesListSidebar()}>
        {!this.singleTab && (
          <Tabs
            className={cnFeaturesListSidebar('Tabs')}
            value={this.activeTab}
            indicatorColor='primary'
            textColor='primary'
            onChange={this.handleChange}
          >
            {tabsTitles.map((label, i) => (
              <Tab
                label={
                  <TabInner>
                    <TabTitle selected={i === this.activeTab}>{label}</TabTitle>
                    <IconButton
                      edge='end'
                      size='small'
                      color='inherit'
                      onPointerDown={this.handleClosePointerDown}
                      onMouseDown={this.handleClosePointerDown}
                      onClick={label === 'Выделенные объекты' ? this.closeSelectedFeaturesTab : this.closeSearchTab}
                    >
                      <Close fontSize='small' />
                    </IconButton>
                  </TabInner>
                }
                value={i}
                key={i}
              />
            ))}
          </Tabs>
        )}

        {!this.activeTab && <FeaturesListSidebarFeatures singleTab={this.singleTab} />}
        {this.activeTab === 1 && this.search?.searchValue && (
          <FeaturesListSidebarFeatures searchValue={this.search} singleTab={this.singleTab} />
        )}

        <Loading global visible={this.loading} />
      </div>
    );
  }

  private handleClosePointerDown(e: React.PointerEvent<HTMLButtonElement>) {
    e.stopPropagation();
  }

  @action.bound
  private init() {
    this.setLoading(true);
    this.setTabState();

    if (sidebars.foundBySearchFeatureEdited && sidebars?.searchValue?.searchValue) {
      this.setActiveTabValue(1);
      this.setLoading(false);
      sidebars.setFoundBySearchFeatureEdited(false);

      return;
    }

    if (sidebars.selectedFeaturesEdited && selectedFeaturesStore.features.length) {
      this.setActiveTabValue(0);
      this.setLoading(false);
      sidebars.setSelectedFeaturesEdited(false);

      return;
    }

    if (sidebars?.searchValue?.searchValue) {
      this.setActiveTabValue(1);
    }

    if (selectedFeaturesStore.features.length && !sidebars?.searchValue?.searchValue) {
      this.setActiveTabValue(0);
    }

    this.setLoading(false);
  }

  @action.bound
  private setTabState() {
    this.setLoading(true);

    if (sidebars?.searchValue?.searchValue && selectedFeaturesStore.features.length) {
      this.setSingleTab(false);
    } else if (sidebars?.searchValue?.searchValue || selectedFeaturesStore.features.length) {
      this.setSingleTab(true);
    } else if (!sidebars?.searchValue?.searchValue && !selectedFeaturesStore.features.length) {
      sidebars.closeSelectedFeaturesSidebar();
    }

    this.setLoading(false);
  }

  @action.bound
  private setSingleTab(singleTab: boolean) {
    this.singleTab = singleTab;
  }

  @action.bound
  private setSearchValue(search?: SearchInfo): void {
    this.search = search;
  }

  @action.bound
  private setLoading(loading: boolean): void {
    this.loading = loading;
  }

  @boundMethod
  private handleChange(event: SyntheticEvent<Element, Event>, value: number) {
    if (!this.singleTab) {
      this.setActiveTab(value);
    }
  }

  @action.bound
  private setActiveTab(value: number) {
    this.activeTab = value;
  }

  @action.bound
  private selectedFeaturesUpdate() {
    this.setTabState();
    this.setActiveTabValue(0);
  }

  @action.bound
  private searchUpdate(search?: SearchInfo) {
    this.setSearchValue(search);
    this.setTabState();
    this.setActiveTabValue(1);
  }

  @boundMethod
  private closeSelectedFeaturesTab() {
    this.setSingleTab(true);
    this.setActiveTabValue();
  }

  @boundMethod
  private closeSearchTab() {
    sidebars.setSearchValue({});
    this.setSingleTab(true);
    this.setActiveTabValue();
  }

  @boundMethod
  private setActiveTabValue(activeTab?: number) {
    if (!sidebars?.searchValue?.searchValue) {
      this.setActiveTab(0);

      return;
    }

    if (!selectedFeaturesStore.features.length) {
      this.setActiveTab(1);

      return;
    }

    if (activeTab !== undefined) {
      this.setActiveTab(activeTab);
    }
  }
}
