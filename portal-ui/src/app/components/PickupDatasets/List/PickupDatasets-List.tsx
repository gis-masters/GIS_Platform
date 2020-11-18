import React, { Component } from 'react';
import { debounce } from 'lodash';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { action, observable } from 'mobx';
import { Search } from '@material-ui/icons';
import { Pagination } from '@material-ui/lab';
import { InputAdornment, FormControl, List, Input, InputLabel } from '@material-ui/core';
import { boundMethod } from 'autobind-decorator';

import { Loading } from '../../Loading/Loading';
import { SortDir } from '../../../services/models';
import { PickupDatasetsItem } from '../Item/PickupDatasets-Item';
import { DataSet, getDataSets } from '../../../services/data.service';
import { communicationService } from '../../../services/communication.service';

import '!style-loader!css-loader!sass-loader!./../Filter/PickupDatasets-Filter.scss';
import '!style-loader!css-loader!sass-loader!./../Empty/PickupDatasets-Empty.scss';
import '!style-loader!css-loader!sass-loader!./../EmptyTitle/PickupDatasets-EmptyTitle.scss';
import '!style-loader!css-loader!sass-loader!./../Paging/PickupDatasets-Paging.scss';
import '!style-loader!css-loader!sass-loader!./../Content/PickupDatasets-Content.scss';

const cnPickupDatasets = cn('PickupDatasets');

export interface PickupDatasetsListProps {
  onDatasetSelected: (dataset: DataSet) => void;
}

@observer
export class PickupDatasetsList extends Component<PickupDatasetsListProps> {
  @observable private filterValue = '';
  @observable private busy = false;
  @observable private totalPages: number;
  @observable private currentPage = 1;
  @observable private datasets: DataSet[] = [];

  private isInitial = true;

  private readonly pageSize = 10;
  private readonly sortField = 'title';
  private readonly sortDir = SortDir.ASC;

  private readonly fetchDatasets: () => Promise<void>;

  constructor(props: PickupDatasetsListProps) {
    super(props);

    this.fetchDatasets = debounce(this._fetchDatasets, 200);
  }

  async componentDidMount() {
    await this._fetchDatasets();

    communicationService.datasetsUpdated.on(async () => {
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
            <List className={cnPickupDatasets('Content', ['scroll'])} dense={true}>
              {this.datasets.map((dataset: DataSet) => (
                <PickupDatasetsItem key={dataset.resourceIdentifier} item={dataset} onClick={this.handleSelection} />
              ))}
            </List>
            {this.totalPages > 1 && (
              <div className={cnPickupDatasets('Paging')}>
                <Pagination count={this.totalPages} page={this.currentPage} onChange={this.pageChanged} />
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
    const [datasets, totalPages] = await getDataSets(
      this.currentPage - 1,
      this.pageSize,
      this.sortField,
      this.sortDir,
      {
        title: this.filterValue
      }
    );

    this.setTotalPages(totalPages);
    this.setDatasets(datasets);
    this.setBusy(false);
  }

  @boundMethod
  private handleSelection(dataset: DataSet) {
    this.props.onDatasetSelected(dataset);
  }

  @boundMethod
  private async onFilterChanged(event) {
    const { value } = event.target;

    this.isInitial = false;
    this.setFilterValue(value);
    this.setCurrentPage(1);
    await this.fetchDatasets();
  }

  @boundMethod
  private async pageChanged(event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) {
    this.setCurrentPage(newPage);
    await this.fetchDatasets();
  }

  @action
  private setDatasets(datasets: DataSet[]) {
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
