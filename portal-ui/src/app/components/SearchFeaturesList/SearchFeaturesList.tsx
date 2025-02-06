import React, { Component } from 'react';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { AxiosError } from 'axios';

import { FoundFeature } from '../../services/data/search/search.model';
import { getSearchResults } from '../../services/data/search/search.service';
import { WfsFeature } from '../../services/geoserver/wfs/wfs.models';
import { services } from '../../services/services';
import { EmptyListView } from '../EmptyListView/EmptyListView';
import { FeaturesList } from '../FeaturesList/FeaturesList';
import { Loading } from '../Loading/Loading';
import { SearchInfo } from '../SearchField/SearchField';
import { SearchResultHighlightWrapper } from '../SearchResultHighlightWrapper/SearchResultHighlightWrapper';

import '!style-loader!css-loader!sass-loader!./SearchFeaturesList.scss';

const cnSearchFeaturesList = cn('SearchFeaturesList');

interface SearchFeaturesListProps {
  searchValue?: SearchInfo;
}

@observer
export class SearchFeaturesList extends Component<SearchFeaturesListProps> {
  @observable private loading = false;
  @observable private error?: string;
  @observable private foundFeatures: FoundFeature[] = [];

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
        {this.showResults && <FeaturesList items={this.foundFeatures} forSearch />}

        {!this.loading && !this.showResults && !this.error && (
          <EmptyListView text='Ничего не нашлось, попробуйте уточнить запрос' />
        )}

        {this.error && <div className={cnSearchFeaturesList('Error')}>{this.error}</div>}

        <Loading visible={this.loading} />
      </>
    );
  }

  @computed
  private get showResults(): boolean {
    const { searchValue } = this.props;

    return !!(
      (searchValue?.searchValue && this.foundFeatures.length) ||
      (!searchValue?.searchValue && this.foundFeatures.length)
    );
  }

  @action.bound
  private setLoading(isLoading: boolean): void {
    this.loading = isLoading;
  }

  @action.bound
  private setError(error: string): void {
    this.error = error;
  }

  private async getFeatures() {
    this.setLoading(true);
    this.setError('');

    const { searchValue } = this.props;
    if (searchValue?.searchValue) {
      const searchRequest = {
        text: searchValue.searchValue,
        sources: searchValue.source,
        type: searchValue.type
      };

      try {
        const [items] = await getSearchResults(searchRequest, { page: 0, pageSize: 50 });
        const foundFeatures = items.map(item => {
          return {
            feature: item.payload as WfsFeature,
            searchResultHighlight: <SearchResultHighlightWrapper item={item} />
          };
        });

        this.setFoundFeatures(foundFeatures.length ? foundFeatures : []);
      } catch (error) {
        const err = error as AxiosError<{ message?: string }>;
        this.setError(err.message || err.response?.data.message || 'Ошибка поиска');
        services.logger.error(error);
        this.setLoading(false);
      }
    }

    this.setLoading(false);
  }

  @action
  private setFoundFeatures(foundFeatures: FoundFeature[]) {
    this.foundFeatures = foundFeatures;
  }
}
