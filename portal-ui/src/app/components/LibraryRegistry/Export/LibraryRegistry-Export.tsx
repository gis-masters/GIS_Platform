import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { ListItemIcon, MenuItem, Tooltip } from '@mui/material';
import { ArchiveOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { Library, LibraryRecord } from '../../../services/data/library/library.models';
import { getAllLibraryRecordsAsRegistry } from '../../../services/data/library/library.service';
import { PropertySchema } from '../../../services/data/schema/schema.models';
import { getReadablePropertyValue } from '../../../services/data/schema/schema.utils';
import { PageOptions } from '../../../services/models';
import { exportAsCSV, exportAsXLSX } from '../../../services/util/export';
import { sleep } from '../../../services/util/sleep';
import { FileIcon } from '../../FileIcon/FileIcon';
import { MenuIconButton } from '../../MenuIconButton/MenuIconButton';
import { XTableColumn } from '../../XTable/XTable.models';

const cnLibraryRegistryExport = cn('LibraryRegistry', 'Export');

interface LibraryRegistryExportProps {
  library: Library;
  tablePageOptions: PageOptions;
  cols: XTableColumn<LibraryRecord>[];
  properties: PropertySchema[];
}

@observer
export class LibraryRegistryExport extends Component<LibraryRegistryExportProps> {
  @observable private loading = false;

  constructor(props: LibraryRegistryExportProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    return (
      <Tooltip title='Экспортировать реестр' placement='top'>
        <MenuIconButton
          className={cnLibraryRegistryExport()}
          icon={<ArchiveOutlined />}
          loading={this.loading}
          disabled={this.loading}
        >
          <MenuItem onClick={this.exportCSV}>
            <ListItemIcon>
              <FileIcon ext='CSV' outlined />
            </ListItemIcon>
            Экспортировать в CSV
          </MenuItem>
          <MenuItem onClick={this.exportXLSX}>
            <ListItemIcon>
              <FileIcon ext='XLS' outlined />
            </ListItemIcon>
            Экспортировать в XLSX
          </MenuItem>
        </MenuIconButton>
      </Tooltip>
    );
  }

  @boundMethod
  private async exportCSV() {
    this.setLoading(true);
    await sleep(100);
    exportAsCSV(await this.getData(), 'documents');
    this.setLoading(false);
  }

  @boundMethod
  private async exportXLSX() {
    this.setLoading(true);
    await sleep(100);
    exportAsXLSX(await this.getData(), 'documents');
    this.setLoading(false);
  }

  private async getData(): Promise<unknown[][]> {
    const { tablePageOptions, library, properties, cols } = this.props;

    const records = await getAllLibraryRecordsAsRegistry(library.table_name, library.schema.name, tablePageOptions);
    const fields = cols.filter(({ field }) => field);
    const data: unknown[][] = [fields.map(({ title }) => title)];

    for (const record of records) {
      data.push(
        fields.map(({ field }) =>
          getReadablePropertyValue(
            field ? record[field] : undefined,
            properties.find(({ name }) => name === field)
          )
        )
      );
    }

    return data;
  }

  @action.bound
  private setLoading(loading: boolean) {
    this.loading = loading;
  }
}
