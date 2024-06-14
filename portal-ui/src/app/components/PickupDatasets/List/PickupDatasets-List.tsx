import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { FormControl, Input, InputAdornment, InputLabel, List, Pagination } from '@mui/material';
import { Search } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { debounce, DebouncedFunc } from 'lodash';

import { communicationService } from '../../../services/communication.service';
import { Dataset } from '../../../services/data/vectorData/vectorData.models';
import { getDatasets } from '../../../services/data/vectorData/vectorData.service';
import { SortOrder } from '../../../services/models';
import { Loading } from '../../Loading/Loading';
import { PickupDatasetsItem } from '../Item/PickupDatasets-Item';

import '!style-loader!css-loader!sass-loader!./../Filter/PickupDatasets-Filter.scss';
import '!style-loader!css-loader!sass-loader!./../Empty/PickupDatasets-Empty.scss';
import '!style-loader!css-loader!sass-loader!./../EmptyTitle/PickupDatasets-EmptyTitle.scss';
import '!style-loader!css-loader!sass-loader!./../Paging/PickupDatasets-Paging.scss';
import '!style-loader!css-loader!sass-loader!./../Content/PickupDatasets-Content.scss';

const cnPickupDatasets = cn('PickupDatasets');

export interface PickupDatasetsListProps {
  onDatasetSelected(dataset: Dataset): void;
}

@observer
export class PickupDatasetsList extends Component<PickupDatasetsListProps> {
  @observable private filterValue = '';
  @observable private busy = false;
  @observable private totalPages = 0;
  @observable private currentPage = 1;
  @observable private datasets: Dataset[] = [];

  private isInitial = true;

  private readonly pageSize = 10;
  private readonly sortField = 'title';
  private readonly sortOrder = SortOrder.ASC;

  private readonly fetchDatasets: DebouncedFunc<() => Promise<void>>;

  constructor(props: PickupDatasetsListProps) {
    super(props);

    makeObservable(this);

    this.fetchDatasets = debounce(this._fetchDatasets, 200);
  }

  async componentDidMount() {
    await this._fetchDatasets();

    communicationService.datasetUpdated.on(async () => {
      this.setCurrentPage(1);
      this.setFilterValue('');
      await this.fetchDatasets();
    });
  }

  componentWillUnmount() {
    communicationService.off(this);
  }

  render() {
    const ready = this.isInitial && (!this.datasets || !this.datasets.length);

    return (
      <>
        {!ready && (
          <>
            <FormControl className={cnPickupDatasets('Filter')}>
              <InputLabel htmlFor='input-with-icon-adornment'>Фильтр</InputLabel>
              <Input
                id='input-with-icon-adornment'
                onChange={this.onFilterChanged}
                endAdornment={
                  <InputAdornment position='start'>
                    <Search />
                  </InputAdornment>
                }
              />
            </FormControl>
            <List className={cnPickupDatasets('Content', ['scroll'])} dense>
              {this.datasets.map((dataset: Dataset, i) => (
                <PickupDatasetsItem key={i} item={dataset} onClick={this.handleSelection} />
              ))}
            </List>
            {this.totalPages > 1 && (
              <div className={cnPickupDatasets('Paging')}>
                <Pagination count={this.totalPages} page={this.currentPage} onChange={this.handlePageChange} />
              </div>
            )}
          </>
        )}

        {ready && !this.busy && (
          <div className={cnPickupDatasets('Empty', { visible: !this.busy })}>
            <div className={cnPickupDatasets('EmptyTitle')}>Наборы данных не найдены</div>
            Для продолжения импорта создайте новый набор.
          </div>
        )}

        <Loading visible={this.busy} />
      </>
    );
  }

  private async _fetchDatasets() {
    this.setBusy(true);
    const [datasets, totalPages] = await getDatasets({
      page: this.currentPage - 1,
      pageSize: this.pageSize,
      sort: this.sortField,
      sortOrder: this.sortOrder,
      filter: { title: { $ilike: `%${String(this.filterValue)}%` } }
    });

    this.setTotalPages(totalPages);
    this.setDatasets(datasets);
    this.setBusy(false);
  }

  @boundMethod
  private handleSelection(dataset: Dataset) {
    this.props.onDatasetSelected(dataset);
  }

  @boundMethod
  private async onFilterChanged(event: React.ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;

    this.isInitial = false;
    this.setFilterValue(value);
    this.setCurrentPage(1);
    await this.fetchDatasets();
  }

  @boundMethod
  private async handlePageChange(event: unknown, newPage: number) {
    this.setCurrentPage(newPage);
    await this.fetchDatasets();
  }

  @action
  private setDatasets(datasets: Dataset[]) {
    this.datasets = datasets;
  }

  @action
  private setBusy(isBusy: boolean) {
    this.busy = isBusy;
  }

  @action
  private setTotalPages(totalPages: number) {
    this.totalPages = totalPages;
  }

  @action
  private setCurrentPage(newPage: number) {
    this.currentPage = newPage;
  }

  @action
  private setFilterValue(newValue: string) {
    this.filterValue = newValue;
  }
}
