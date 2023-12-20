import React, { Component, createRef, RefObject } from 'react';
import { observable, action, computed, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';

import { SearchItemDataTypeFeature } from '../../services/data/search/search.model';
import { FeatureError } from '../../services/map/map-link-following.service';
import { getSearchResults } from '../../services/data/search/search.service';
import { getFeaturesById } from '../../services/geoserver/wfs/wfs.service';
import { EditFeatureMode, sidebars } from '../../stores/Sidebars.store';
import { FeaturesListItem } from '../FeaturesListItem/FeaturesListItem';
import { WfsFeature } from '../../services/geoserver/wfs/wfs.models';
import { currentProject } from '../../stores/CurrentProject.store';
import { mapService } from '../../services/map/map.service';
import { SearchInfo } from '../GlobalSearch/GlobalSearch';
import { services } from '../../services/services';
import { mapStore } from '../../stores/Map.store';
import { Loading } from '../Loading/Loading';

import { FeaturesListEmpty } from './Empty/FeaturesList-Empty';

import '!style-loader!css-loader!sass-loader!./FeaturesList.scss';

const cnFeaturesList = cn('FeaturesList');

interface FeaturesListProps {
  searchValue?: SearchInfo;
}

interface WfsFeaturesRequestInfo {
  complexName: string;
  featureId: string;
}

@observer
export class FeaturesList extends Component<FeaturesListProps> {
  private ref: RefObject<HTMLDivElement> = createRef();
  private resizeObserver: ResizeObserver = new ResizeObserver(this.handleResize);
  @observable private loading = false;
  @observable private width = 0;
  @observable private height = 0;
  @observable private highlightedFeatureId: string | undefined;
  @observable private searchResult: WfsFeature[] = [];
  private highlightAllFeaturesTimeout: number | undefined;

  constructor(props: FeaturesListProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount() {
    if (this.ref.current) {
      this.resizeObserver.observe(this.ref.current);
    }

    if (this.props.searchValue) {
      await this.getFeatures();
    }
  }

  async componentDidUpdate(prevProps: FeaturesListProps) {
    if (this.props.searchValue !== prevProps.searchValue) {
      await this.getFeatures();
    }
  }

  componentWillUnmount() {
    this.highlightItem(null);
    if (this.ref.current) {
      this.resizeObserver.unobserve(this.ref.current);
    }
  }

  render() {
    return (
      <div className={cnFeaturesList(null, ['scroll'])} ref={this.ref}>
        {this.showResults ? (
          <FixedSizeList
            className='scroll'
            height={this.height}
            width={this.width}
            itemSize={54}
            itemData={this.items}
            itemCount={this.items.length}
            overscanCount={5}
          >
            {this.renderRow}
          </FixedSizeList>
        ) : (
          !this.loading && <div className={cnFeaturesList('Empty')}>Объекты не найдены</div>
        )}
        <Loading visible={this.loading} />
      </div>
    );
  }

  @computed
  private get showResults(): boolean {
    const { searchValue } = this.props;

    return !!(
      (searchValue?.searchValue && this.searchResult.length) ||
      (!searchValue?.searchValue && this.items.length)
    );
  }

  @computed
  private get items(): (WfsFeature | FeatureError)[] {
    if (this.searchResult.length) {
      return this.searchResult;
    }

    return [
      ...mapStore.selectedFeatures,
      ...(sidebars.deletedFeatures || []),
      ...(sidebars.featuresWithNoAccess || []),
      ...(sidebars.deletedLayers || [])
    ];
  }

  @action.bound
  private setLoading(isLoading: boolean): void {
    this.loading = isLoading;
  }

  @action.bound
  private highlightItem(feature: WfsFeature | null) {
    if (feature) {
      clearTimeout(this.highlightAllFeaturesTimeout);
      mapService.highlightFeatures([feature]);
    } else {
      mapService.highlightFeatures(mapStore.highlightedFeatures);
    }
    this.highlightedFeatureId = feature?.id;
  }

  @action.bound
  private handleItemSelect(feature: WfsFeature) {
    if (this.props.searchValue) {
      sidebars.setFoundBySearchFeatureEdited(true);
    } else {
      sidebars.setMemorizedFeatures(mapStore.selectedFeatures);
      sidebars.setSelectedFeaturesEdited(true);
    }
    sidebars.closeSidebar();
    sidebars.openEdit({ features: [feature], mode: EditFeatureMode.single });
  }

  @action
  private setSize(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  @boundMethod
  private handleResize(entries: ResizeObserverEntry[]) {
    for (const entry of entries) {
      const contentBoxSize = (
        Array.isArray(entry.contentBoxSize) ? entry.contentBoxSize[0] : entry.contentBoxSize
      ) as ResizeObserverSize;

      if (this.ref.current) {
        this.setSize(
          contentBoxSize?.inlineSize || this.ref.current.clientWidth,
          contentBoxSize?.blockSize || this.ref.current.clientHeight
        );
      }
    }
  }

  private async getFeatures() {
    this.setLoading(true);

    const { searchValue } = this.props;

    if (searchValue?.searchValue) {
      const searchRequest = {
        text: searchValue.searchValue,
        sources: searchValue.source,
        type: searchValue.type
      };

      try {
        const [items] = await getSearchResults(searchRequest, { page: 0, pageSize: 50 });
        const foundFeatures = items as SearchItemDataTypeFeature[];
        const wfsFeaturesRequestInfo: WfsFeaturesRequestInfo[] = foundFeatures
          .map(feature => {
            const layer = currentProject.layers.find(
              ({ dataset, tableName }) => dataset === feature.source.dataset && tableName === feature.source.table
            );

            if (layer?.complexName) {
              return { complexName: layer.complexName, featureId: feature.payload.id };
            }
          })
          .filter(Boolean);

        const features = await Promise.all(
          wfsFeaturesRequestInfo.map(async obj => {
            return await getFeaturesById([obj.featureId], obj.complexName);
          })
        );

        this.setSearchResult(features.flat());
      } catch (error) {
        services.logger.error(error);
        this.setLoading(false);
      }
    }

    this.setLoading(false);
  }

  @action
  private setSearchResult(searchResult: WfsFeature[]) {
    this.searchResult = searchResult;
  }

  @boundMethod
  private renderRow({ index, style }: ListChildComponentProps) {
    if (!this.items.length) {
      return <FeaturesListEmpty />;
    }

    if (!this.props.searchValue && mapStore.selectedFeatures.length && index >= mapStore.selectedFeatures.length) {
      const featureError = this.items[index] as FeatureError;

      return <FeaturesListItem errorData={featureError} key={`err_${index}_${featureError.id}`} style={style} />;
    }

    const feature = this.items[index] as WfsFeature;

    return (
      <FeaturesListItem
        feature={feature}
        highlighted={feature.id === this.highlightedFeatureId}
        onHighlight={this.highlightItem}
        onSelect={this.handleItemSelect}
        key={feature.id}
        isSearchList={!!this.props.searchValue}
        style={style}
      />
    );
  }
}
