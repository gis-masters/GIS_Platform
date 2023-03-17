import React, { Component, createRef, RefObject } from 'react';
import { observable, action, computed, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';

import { mapStore } from '../../stores/Map.store';
import { EditFeatureMode, sidebars } from '../../stores/Sidebars.store';
import { FeatureError } from '../../services/map/map-link-following.service';
import { WfsFeature } from '../../services/geoserver/wfs/wfs.models';
import { mapService } from '../../services/map/map.service';
import { FeaturesListItem } from '../FeaturesListItem/FeaturesListItem';

import { FeaturesListEmpty } from './Empty/FeaturesList-Empty';

import '!style-loader!css-loader!sass-loader!./FeaturesList.scss';

const cnFeaturesList = cn('FeaturesList');

@observer
export class FeaturesList extends Component {
  private ref: RefObject<HTMLDivElement> = createRef();
  private resizeObserver: ResizeObserver = new ResizeObserver(this.handleResize);
  @observable private width = 0;
  @observable private height = 0;
  @observable private highlightedFeatureId: string | null = null;
  private highlightAllFeaturesTimeout: number;

  constructor(props: Record<string, never>) {
    super(props);
    makeObservable(this);
  }

  componentDidMount() {
    this.resizeObserver.observe(this.ref.current);
  }

  componentWillUnmount() {
    this.highlightItem(null);
    this.resizeObserver.unobserve(this.ref.current);
  }

  render() {
    return (
      <div className={cnFeaturesList(null, ['scroll'])} ref={this.ref}>
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
      </div>
    );
  }

  @computed
  private get items(): (WfsFeature | FeatureError)[] {
    return [
      ...mapStore.selectedFeatures,
      ...(sidebars.deletedFeatures || []),
      ...(sidebars.featuresWithNoAccess || []),
      ...(sidebars.deletedLayers || [])
    ];
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
    sidebars.setMemorizedFeatures(mapStore.selectedFeatures);
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

      this.setSize(
        contentBoxSize?.inlineSize || this.ref.current.clientWidth,
        contentBoxSize?.blockSize || this.ref.current.clientHeight
      );
    }
  }

  @boundMethod
  private renderRow({ index, style }: ListChildComponentProps) {
    if (!this.items.length) {
      return <FeaturesListEmpty />;
    }

    if (index >= mapStore.selectedFeatures.length) {
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
        style={style}
      />
    );
  }
}
