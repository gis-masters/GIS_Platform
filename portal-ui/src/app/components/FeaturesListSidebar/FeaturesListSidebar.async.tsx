import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { Close } from '@mui/icons-material';
import { boundMethod } from 'autobind-decorator';
import { IconButton, Tab, Tabs } from '@mui/material';
import { IReactionDisposer, action, makeObservable, observable, reaction } from 'mobx';

import FeaturesListSidebarFeatures from '../FeaturesListSidebarFeatures/FeaturesListSidebarFeatures';
import { communicationService } from '../../services/communication.service';
import { SearchInfo } from '../SearchField/SearchField';
import { sidebars } from '../../stores/Sidebars.store';
import { mapStore } from '../../stores/Map.store';
import { TabInner } from '../TabInner/TabInner';
import { TabTitle } from '../TabTitle/TabTitle';
import { Loading } from '../Loading/Loading';

import '!style-loader!css-loader!sass-loader!./FeaturesListSidebar.scss';

const cnFeaturesListSidebar = cn('FeaturesListSidebar');

const tabsTitles: string[] = ['Выделенные объекты', 'Результаты поиска'];

@observer
export default class FeaturesListSidebar extends Component {
  @observable private singleTab = false;
  @observable private loading = false;
  @observable private search: SearchInfo = {};
  @observable private activeTab = 0;

  private selectionReactionDisposer?: IReactionDisposer;
  private searchReactionDisposer?: IReactionDisposer;

  constructor(props: Record<string, unknown>) {
    super(props);
    makeObservable(this);
  }

  componentDidMount() {
    this.setSearchValue(sidebars.searchValue);

    communicationService.featuresUpdated.on(this.close, this);
    this.selectionReactionDisposer = reaction(
      () => mapStore.selectedFeatures.map(({ id }) => id),
      () => {
        this.selectedFeaturesUpdate();
      },
      { fireImmediately: true }
    );

    this.searchReactionDisposer = reaction(
      () => sidebars.searchValue,
      (search: SearchInfo) => {
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
            onChange={this.changeHandler}
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
                      onPointerDown={this.closePointerDownHandler}
                      onMouseDown={this.closePointerDownHandler}
                      onClick={label === 'Выделенные объекты' ? this.close : this.closeSearchTab}
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

  private closePointerDownHandler(e: React.PointerEvent<HTMLButtonElement>) {
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

    if (sidebars.selectedFeaturesEdited && mapStore.selectedFeatures.length) {
      this.setActiveTabValue(0);
      this.setLoading(false);
      sidebars.setSelectedFeaturesEdited(false);

      return;
    }

    if (sidebars?.searchValue?.searchValue) {
      this.setActiveTabValue(1);
    }

    if (mapStore.selectedFeatures.length) {
      this.setActiveTabValue(0);
    }

    this.setLoading(false);
  }

  @action.bound
  private setTabState() {
    this.setLoading(true);

    if (sidebars?.searchValue?.searchValue && mapStore.selectedFeatures.length) {
      this.setSingleTab(false);
    } else if (sidebars?.searchValue?.searchValue || mapStore.selectedFeatures.length) {
      this.setSingleTab(true);
    } else if (!sidebars?.searchValue?.searchValue && !mapStore.selectedFeatures.length) {
      sidebars.closeFeaturesSidebar();
    }

    this.setLoading(false);
  }

  @action.bound
  private setSingleTab(singleTab: boolean) {
    this.singleTab = singleTab;
  }

  @action.bound
  private setSearchValue(search: SearchInfo): void {
    this.search = search;
  }

  @action.bound
  private setLoading(loading: boolean): void {
    this.loading = loading;
  }

  @boundMethod
  private changeHandler(event: React.ChangeEvent, value: number) {
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
  private searchUpdate(search: SearchInfo) {
    this.setSearchValue(search);
    this.setTabState();
    this.setActiveTabValue(1);
  }

  @boundMethod
  private close() {
    sidebars.setMemorizedFeatures([]);
    mapStore.setSelectedFeatures([]);
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

    if (!mapStore.selectedFeatures.length) {
      this.setActiveTab(1);

      return;
    }

    if (activeTab) {
      this.setActiveTab(activeTab);
    }
  }
}
