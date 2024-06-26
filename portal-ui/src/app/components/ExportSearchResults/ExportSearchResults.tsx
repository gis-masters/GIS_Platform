import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Tooltip } from '@mui/material';
import { FileUploadOutlined } from '@mui/icons-material';
import { boundMethod } from 'autobind-decorator';

import { SearchItemData, SearchItemDataTypeFeature } from '../../services/data/search/search.model';
import { getSearchResults } from '../../services/data/search/search.service';
import { getSearchRequest } from '../../services/data/search/search.util';
import { extractFeatureId } from '../../services/geoserver/featureType/featureType.util';
import { exportAsXLSX } from '../../services/util/export';
import { ExplorerSearchValue } from '../Explorer/Explorer.models';
import { IconButton } from '../IconButton/IconButton';

interface ExportSearchResultsProps {
  item: ExplorerSearchValue;
}

@observer
export class ExportSearchResults extends Component<ExportSearchResultsProps> {
  @observable private loading = false;
  @observable private exportSearchItems: SearchItemData[] = [];

  constructor(props: ExportSearchResultsProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    return (
      <Tooltip title='Выгрузить в XLSX'>
        <IconButton loading={this.loading} onClick={this.exportXLSX}>
          <FileUploadOutlined />
        </IconButton>
      </Tooltip>
    );
  }

  @boundMethod
  private async exportXLSX() {
    this.setLoading(true);
    await this.getData();
    const data: string[][] = [['Идентификатор', 'Наименование', 'Источник данных']];

    if (this.exportSearchItems.length) {
      for (const searchItems of this.exportSearchItems) {
        if (searchItems.type === 'FEATURE') {
          data.push([
            String(extractFeatureId(searchItems.payload.id)),
            searchItems.source.tableTitle,
            `${searchItems.source.dataset}, ${searchItems.source.table}`
          ]);
        }

        if (searchItems.type === 'DOCUMENT') {
          data.push([String(searchItems.payload.id), searchItems.payload.title || '', searchItems.source.title]);
        }
      }
    }

    exportAsXLSX(data, 'documents');
    this.setLoading(false);
  }

  private async getData() {
    this.setLoading(true);
    const searchRequest = await getSearchRequest(this.props.item);

    const [items] = await getSearchResults(searchRequest, {
      page: 0,
      pageSize: 50
    });

    this.setExportSearchItems(items as SearchItemDataTypeFeature[]);
    this.setLoading(false);
  }

  @action.bound
  private setLoading(loading: boolean) {
    this.loading = loading;
  }

  @action.bound
  private setExportSearchItems(searchItems: SearchItemDataTypeFeature[]) {
    this.exportSearchItems = searchItems;
  }
}
