import React, { Component } from 'react';
import { action, observable, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { Tooltip } from '@mui/material';
import { boundMethod } from 'autobind-decorator';
import { FileUploadOutlined } from '@mui/icons-material';

import { SearchItemDataTypeFeature, SearchRequest } from '../../services/data/search/search.model';
import { ExplorerItemData, ExplorerSearchValue } from '../Explorer/Explorer.models';
import { getSearchResults } from '../../services/data/search/search.service';
import { extractFeatureId } from '../../services/geoserver/feature.util';
import { exportAsXLSX } from '../../services/util/export';
import { IconButton } from '../IconButton/IconButton';

interface ExportSearchResultsProps {
  item: ExplorerItemData<ExplorerSearchValue>;
}

@observer
export class ExportSearchResults extends Component<ExportSearchResultsProps> {
  @observable private loading = false;
  @observable private exportSearchItems: SearchItemDataTypeFeature[] = [];

  constructor(props: ExportSearchResultsProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    return (
      this.props.item.payload.type === 'FEATURE' && (
        <Tooltip title='Выгрузить в XLSX'>
          <IconButton loading={this.loading} onClick={this.exportXLSX}>
            <FileUploadOutlined />
          </IconButton>
        </Tooltip>
      )
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
      }
    }

    exportAsXLSX(data, 'documents');
    this.setLoading(false);
  }

  private async getData() {
    this.setLoading(true);
    const search = this.props.item.payload;
    let searchRequest: SearchRequest = { text: '' };

    if (search.type === 'FEATURE' && search.searchValue) {
      searchRequest = {
        text: search.searchValue,
        type: 'FEATURE'
      };
    }

    if (searchRequest.text) {
      const [items] = await getSearchResults(searchRequest, {
        page: 0,
        pageSize: 50
      });

      this.setExportSearchItems(items as SearchItemDataTypeFeature[]);
    }

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
