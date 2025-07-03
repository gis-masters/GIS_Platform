import React, { Component, createRef, ReactNode, RefObject } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { FixedSizeList, ListChildComponentProps } from 'react-window';

import { WfsFeature } from '../../services/geoserver/wfs/wfs.models';
import { EditFeatureMode } from '../../services/map/a-map-mode/edit-feature/EditFeature.models';
import { mapModeManager } from '../../services/map/a-map-mode/MapModeManager';
import { selectedFeaturesStore } from '../../services/map/a-map-mode/selected-features/SelectedFeatures.store';
import { MapMode } from '../../services/map/map.models';
import { FeatureError } from '../../services/map/map-link-following.service';
import { sidebars } from '../../stores/Sidebars.store';
import { FeaturesListItem } from '../FeaturesListItem/FeaturesListItem';
import { FeaturesListEmpty } from './Empty/FeaturesList-Empty';

import '!style-loader!css-loader!sass-loader!./FeaturesList.scss';

const cnFeaturesList = cn('FeaturesList');

export interface FeaturesListItemInfo {
  feature?: WfsFeature;
  searchResultHighlight?: ReactNode;
  error?: FeatureError;
}

interface FeaturesListProps {
  items: FeaturesListItemInfo[];
  forSearch?: boolean;
}

@observer
export class FeaturesList extends Component<FeaturesListProps> {
  private ref: RefObject<HTMLDivElement> = createRef();
  private resizeObserver: ResizeObserver = new ResizeObserver(this.handleResize);

  @observable private width = 0;
  @observable private height = 0;

  constructor(props: FeaturesListProps) {
    super(props);
    makeObservable(this);
  }

  componentDidMount() {
    if (this.ref.current) {
      this.resizeObserver.observe(this.ref.current);
    }
  }

  componentWillUnmount() {
    if (this.ref.current) {
      this.resizeObserver.unobserve(this.ref.current);
    }
  }

  render() {
    const { items, forSearch } = this.props;

    return (
      <div className={cnFeaturesList(null, ['scroll'])} ref={this.ref}>
        {items.length ? (
          <FixedSizeList
            className='scroll'
            height={this.height}
            width={this.width}
            itemSize={forSearch ? 64 : 54}
            itemData={items}
            itemCount={items.length}
            overscanCount={5}
          >
            {this.renderRow}
          </FixedSizeList>
        ) : (
          <FeaturesListEmpty />
        )}
      </div>
    );
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

  @action.bound
  private async handleItemSelect(feature: WfsFeature) {
    if (this.props.forSearch) {
      sidebars.setFoundBySearchFeatureEdited(true);
    } else {
      sidebars.setSelectedFeaturesEdited(true);
    }

    await mapModeManager.changeMode(
      MapMode.EDIT_FEATURE,
      {
        payload: { features: [feature], mode: EditFeatureMode.single }
      },
      'handleItemSelect'
    );
  }

  @boundMethod
  private renderRow({ index, style }: ListChildComponentProps) {
    const { items, forSearch } = this.props;

    if (!items.length) {
      return <FeaturesListEmpty />;
    }

    if (!forSearch && selectedFeaturesStore.features.length && index >= selectedFeaturesStore.features.length) {
      const featureError = items[index].error;

      return <FeaturesListItem errorData={featureError} key={`err_${index}_${featureError?.id}`} style={style} />;
    }

    const feature = items[index].feature;

    return (
      <FeaturesListItem
        feature={feature}
        onSelect={this.handleItemSelect}
        key={feature?.id}
        searchResultHighlight={items[index].searchResultHighlight}
        isSearchList={forSearch}
        style={style}
      />
    );
  }
}
