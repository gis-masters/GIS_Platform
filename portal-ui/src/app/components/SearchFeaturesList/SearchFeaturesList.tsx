import React, { Component } from 'react';
import { observable, action, computed, makeObservable } from 'mobx';
import { observer } from 'mobx-react';

import { SearchResultHighlightWrapper } from '../SearchResultHighlightWrapper/SearchResultHighlightWrapper';
import { getSearchResults } from '../../services/data/search/search.service';
import { FoundWfsFeature } from '../../services/data/search/search.model';
import { WfsFeature } from '../../services/geoserver/wfs/wfs.models';
import { FeaturesList } from '../FeaturesList/FeaturesList';
import { SearchInfo } from '../SearchField/SearchField';
import { services } from '../../services/services';
import { Loading } from '../Loading/Loading';

interface SearchFeaturesListProps {
  searchValue?: SearchInfo;
}

@observer
export class SearchFeaturesList extends Component<SearchFeaturesListProps> {
  @observable private loading = false;
  @observable private foundWfsFeature: FoundWfsFeature[] = [];

  constructor(props: SearchFeaturesListProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount() {
    if (this.props.searchValue) {
      await this.getFeatures();
    }
  }

  async componentDidUpdate(prevProps: SearchFeaturesListProps) {
    if (this.props.searchValue !== prevProps.searchValue) {
      await this.getFeatures();
    }
  }

  render() {
    return (
      <>
        {this.showResults && <FeaturesList items={this.foundWfsFeature} forSearch />}

        <Loading visible={this.loading} />
      </>
    );
  }

  @computed
  private get showResults(): boolean {
    const { searchValue } = this.props;

    return !!(
      (searchValue?.searchValue && this.foundWfsFeature.length) ||
      (!searchValue?.searchValue && this.foundWfsFeature.length)
    );
  }

  @action.bound
  private setLoading(isLoading: boolean): void {
    this.loading = isLoading;
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
        const foundWfsFeature = items.map(item => {
          return {
            feature: item.payload as WfsFeature,
            searchResultHighlight: <SearchResultHighlightWrapper item={item} />
          };
        });

        if (foundWfsFeature.length) {
          this.setFoundWfsFeature(foundWfsFeature);
        }
      } catch (error) {
        services.logger.error(error);
        this.setLoading(false);
      }
    }

    this.setLoading(false);
  }

  @action
  private setFoundWfsFeature(foundWfsFeature: FoundWfsFeature[]) {
    this.foundWfsFeature = foundWfsFeature;
  }
}
